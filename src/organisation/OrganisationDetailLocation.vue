<template>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Adresse</th>
          <th scope="col">Lokationsnavn</th>
          <th scope="col">Primær adresse</th>
          <th scope="col">Startdato</th>
          <th scope="col">Slutdato</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="location in details" v-bind:key="location.uuid">
          <td>{{location.location.vejnavn}}</td>
          <td>{{location.location.name}}</td>
          <td>{{location.primaer}}</td>
          <td>{{location['valid-from']}}</td>
          <td>{{location['valid-to']}}</td>
        </tr>
      </tbody>
    </table>
</template>

<script>
  import Organisation from '../api/Organisation'

  export default {
    components: {},
    data () {
      return {
        details: [],
        detailsPast: [],
        detailsFuture: []
      }
    },
    created: function () {
      this.getDetails()
    },
    methods: {
      getDetails: function () {
        var vm = this
        Organisation.getLocationDetails('456362c4-0ee4-4e5e-a72c-751239745e62', this.$route.params.uuid)
        .then(function (response) {
          vm.details = response
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>