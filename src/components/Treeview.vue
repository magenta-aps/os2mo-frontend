<template>
  <div>
    <ul v-if="tree">
      <item
      v-model="selectedOrgUnit"
      :model="tree"/>
    </ul>
    <loading v-show="!tree"/>
  </div>
</template>

<script>
  import Organisation from '../api/Organisation'
  import Item from './TreeviewItem'
  import Loading from './Loading'

  export default {
    components: {
      Item,
      Loading
    },
    props: {
      value: Object,
      orgUuid: String
    },
    data () {
      return {
        tree: null,
        selectedOrgUnit: {}
      }
    },
    watch: {
      orgUuid (newVal, oldVal) {
        this.tree = null
        this.getTree(newVal)
      },

      selectedOrgUnit (newVal, oldVal) {
        this.$emit('input', newVal)
      }
    },
    created () {
      this.getTree(this.orgUuid)
    },
    methods: {
      getTree (uuid) {
        var vm = this
        if (!uuid) {
          vm.tree = {}
          return
        }
        Organisation.getFullHierachy(uuid).then(function (response) {
          vm.tree = response.hierarchy
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
