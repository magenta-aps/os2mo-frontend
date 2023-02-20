SPDX-FileCopyrightText: 2017-2020 Magenta ApS SPDX-License-Identifier: MPL-2.0
<template>
  <div>
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
      <mo-locale-picker />
      <div class="col text-center">
        <h1>{{ $t("common.welcome_message") }}</h1>
        <h4>{{ $t("common.welcome_tagline") }}</h4>
      </div>
    </nav>
    <div id="main-menu">
      <div v-for="(m, index) in menu" :key="index" class="col">
        <component :is="m.template" />
      </div>
    </div>
    <div class="version">
      <div>
        <span class="text-primary">{{ this.mo_version }}</span>
      </div>
      <div>
        <span class="text-primary">{{ this.dipex_version }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * A landing page component.
 */
import Frontpage from "@/api/Frontpage"
import Version from "@/api/Version"
import MoLocalePicker from "@/components/MoLocalePicker.vue"

export default {
  components: {
    MoLocalePicker,
  },

  data() {
    return {
      menu: [],
      mo_version: null,
      mo_hash: null,
      dipex_version: null,
    }
  },

  created() {
    this.menu = Frontpage.getMenu()

    Version.get().then((response) => {
      const version_dict = response.data
      this.mo_version = `OS2mo ${version_dict["mo_version"]}`
      this.mo_hash = (version_dict["mo_hash"] || "").substring(0, 8)
      if (
        version_dict["dipex_version"] !== undefined &&
        version_dict["dipex_version"] !== null &&
        version_dict["dipex_version"] !== ""
      ) {
        this.dipex_version = `DIPEX ${version_dict["dipex_version"]}`
      }
    })
  },

  methods: {
    /**
     * Push route to destination.
     */
    setDestination(val) {
      this.$router.push({
        name: val,
      })
    },
  },
}
</script>

<style scoped>
#main-menu {
  text-align: center;
  margin-top: 10em;
}

#locale-picker {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 1111;
}

.version {
  position: absolute;
  bottom: 1em;
  left: 1em;
}

nav {
  height: auto;
}

h1,
h4 {
  color: #ffffff;
}
</style>
