<template>
  <div class="form-group">
      <label for="">{{ label }}</label>
      <input 
        type="text" 
        class="form-control" 
        placeholder="Kommer senere..."
        ref="orgUnitPicker"
        :value="selectedSuperUnit.name"
        @focus="show"
      >
      <div class="mo-input-group" v-show="showTree">
        <tree-view v-model="selectedSuperUnit" :orgUuid="org.uuid"/>
      </div>
  </div>
</template>

<script>
  import Organisation from '../api/Organisation'
  import TreeView from '../components/Treeview'
  export default {
    components: {
      TreeView
    },
    props: {
      label: {
        default: 'Angiv overenhed',
        type: String
      }
    },
    data () {
      return {
        org: {},
        selectedSuperUnit: {},
        showTree: false
      }
    },
    watch: {
      selectedSuperUnit (newVal, oldVal) {
        this.$refs.orgUnitPicker.blur()
        this.hide()
      }
    },
    created () {
      this.getSelectedOrganisation()
    },
    methods: {
      getSelectedOrganisation () {
        this.org = Organisation.getSelectedOrganisation()
      },

      show () {
        this.showTree = true
      },

      hide () {
        this.showTree = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .form-group {
    position: relative;
  }
  .mo-input-group {
    z-index: 999;
    background-color: #fff;
    width: 100%;
    padding: 0.375rem 0.75rem;
    position: absolute;
    border: 1px solid #ced4da;
    border-radius: 0 0 0.25rem;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  }

</style>