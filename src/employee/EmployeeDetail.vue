<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">
        <icon name="user-o"/>
        Medarbejder
      </h4>
      <div class="row">
        <div class="col">
          <p class="card-text">
            Navn: {{employee.name}}
            Cpr. nr.: {{employee['user-key']}}
          </p>
        </div>
      </div>

      <ul class="nav nav-tabs">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'EmployeeDetailEngagement' }">
            Engagement
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'EmployeeDetailContact' }">
            Kontakt
          </router-link>
        </li>
      </ul>

      <router-view/>
    </div>
  </div>
</template>

<script>
  import Employee from '../api/Employee'

  export default {
    components: {
    },
    data () {
      return {
        employee: Object
      }
    },
    created () {
      this.getEmployee(this.$route.params.uuid)
    },
    methods: {
      getEmployee: function (uuid) {
        var vm = this
        Employee.getEmployee(uuid)
        .then(response => {
          vm.employee = response
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
