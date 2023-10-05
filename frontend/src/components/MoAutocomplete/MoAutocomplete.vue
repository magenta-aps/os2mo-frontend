SPDX-FileCopyrightText: 2021 Magenta ApS SPDX-License-Identifier: MPL-2.0
<template>
  <autocomplete
    :search="search"
    :getResultValue="getResultValue"
    :autoSelect="true"
    :debounceTime="1000"
    @update="update"
    @submit="onSubmit"
  >
    <template
      slot="default"
      slot-scope="{
        rootProps,
        inputProps,
        inputListeners,
        resultListProps,
        resultListListeners,
        results,
        resultProps,
      }"
    >
      <div v-bind="rootProps">
        <input
          v-bind="inputProps"
          v-on="inputListeners"
          :class="[
            'form-control autocomplete-input',
            { 'autocomplete-input-no-results': noResults },
            { 'autocomplete-input-focused': focused },
          ]"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <ul
          v-if="noResults"
          class="autocomplete-result-list"
          style="position: absolute; z-index: 1; width: 100%; top: 100%"
        >
          <li class="autocomplete-result">
            {{ $t("alerts.no_search_results") }}
          </li>
        </ul>
        <ul v-bind="resultListProps" v-on="resultListListeners">
          <li
            v-for="(result, index) in results"
            :key="resultProps[index].id"
            v-bind="resultProps[index]"
          >
            <div v-if="canDisplayParentOrgUnitName(result)">
              <small>{{ getParentOrgUnitName(result) }}</small>
            </div>
            {{ result.name }}
            <span v-if="show_employee_birthday"
              >({{ getEmployeeBirthday(result) }})</span
            >
            <icon
              v-if="isLoading && use_graphql_search"
              class="text-primary"
              name="spinner"
              scale="1"
              spin
            />
            <div v-if="use_graphql_search" v-for="obj in extra" :key="obj.id">
              <small
                v-if="obj.name === result.name"
                v-for="(address, addressIndex) in obj.addresses"
                :key="addressIndex"
              >
                <span> {{ address.value }} <br /> </span>
                <span v-if="address.value2"> {{ address.value2 }} <br /> </span>
              </small>
            </div>
            <div v-for="item in result.attrs" :key="item.uuid">
              <small>
                <b>{{ item.title }}</b>
                <span>{{ item.value }}</span>
              </small>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </autocomplete>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue"
import "@trevoreyre/autocomplete-vue/dist/style.css"
import { get_by_graphql } from "../../api/HttpCommon"

export default {
  name: "MoAutocomplete",

  components: {
    Autocomplete,
  },

  props: {
    search: Function,
    getResultValue: Function,
    onSubmit: Function,
  },

  data() {
    return {
      focused: false,
      value: "",
      results: [],
      use_graphql_search: this.$store.getters["conf/GET_CONF_DB"].use_graphql_search,
      extra: [],
      show_employee_birthday:
        this.$store.getters["conf/GET_CONF_DB"].show_employee_birthday_in_search,
      routeName: "",
      isLoading: false,
    }
  },

  watch: {
    /**
     * Whenever route change update.
     */
    $route(to) {
      this.getRouteName(to)
    },
  },

  computed: {
    noResults() {
      return this.value && this.results.length === 0
    },
  },

  created() {
    /**
     * Called synchronously after the instance is created.
     * Get route name.
     */
    this.getRouteName(this.$route)
  },

  methods: {
    handleFocus() {
      this.focused = true
    },
    getRouteName(route) {
      if (route.name.indexOf("Organisation") > -1) {
        this.routeName = "org_units"
      }
      if (route.name.indexOf("Employee") > -1) {
        this.routeName = "employees"
      }
    },
    update(results) {
      if (this.use_graphql_search) {
        if (results.length) {
          this.isLoading = true
          let employeeRoute = this.routeName == "employees"
          let uuids = results.map((result) => result.uuid)
          let query = `query getLazyData($uuids: [UUID!], $isEmployeeRoute: Boolean!) {
            ...employee_or_org
          }

          fragment employee_or_org on Query {
            employees(filter: {uuids: $uuids}) @include(if: $isEmployeeRoute) {
              objects {
                objects {
                  name
                  addresses {
                    resolve {
                      ... on DefaultAddress {
                        __typename
                        value
                      }
                      ... on DARAddress {
                        __typename
                        name
                      }
                      ... on MultifieldAddress {
                        __typename
                        value
                        value2
                      }
                    }
                  }
                  itusers {
                    user_key
                  }
                }
              }
            }
            org_units(filter: {uuids: $uuids}) @skip(if: $isEmployeeRoute) {
              objects {
                objects {
                  name
                  addresses {
                    resolve {
                      ... on DefaultAddress {
                        __typename
                        value
                      }
                      ... on DARAddress {
                        __typename
                        name
                      }
                      ... on MultifieldAddress {
                        __typename
                        value
                        value2
                      }
                    }
                  }
                }
              }
            }
          }`
          get_by_graphql({
            query: query,
            variables: {
              uuids: uuids,
              isEmployeeRoute: employeeRoute,
            },
          }).then((response) => {
            const result = response.data[this.routeName].objects.map((item) => {
              const object = item.objects[0]
              const { name, addresses = [], itusers = [] } = object

              const extractedAddresses = addresses.map((address) => {
                const { resolve } = address
                if (resolve.__typename === "DefaultAddress") {
                  return { value: resolve.value }
                }
                if (resolve.__typename === "DARAddress") {
                  return { value: resolve.name }
                }
                if (resolve.__typename === "MultifieldAddress") {
                  return { value: resolve.value, value2: resolve.value2 }
                }
              })

              const extractedItUsers = itusers.map((ituser) => ({
                value: ituser.user_key,
              }))

              const data = {
                name,
                addresses: [...extractedAddresses, ...extractedItUsers],
              }
              return data
            })
            this.isLoading = false
            this.extra = result
          })
        }
      }
    },

    handleBlur() {
      this.focused = false
    },

    canDisplayParentOrgUnitName(result) {
      return "path" in result && result.path !== null
    },

    getParentOrgUnitName(result) {
      if (result.path !== null) {
        return result.path[result.path.length - 2]
      }
    },
    getEmployeeBirthday(result) {
      return result.cpr_no.trim().slice(0, -4)
    },
  },
}
</script>
