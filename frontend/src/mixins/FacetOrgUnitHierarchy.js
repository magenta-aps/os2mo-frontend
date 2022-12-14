// SPDX-FileCopyrightText: 2019-2020 Magenta ApS
// SPDX-License-Identifier: MPL-2.0

import { Facet } from "@/store/actions/facet"
export default {
    computed: {
        facetOrgUnitHierarchy() {
            let facet = this.$store.getters[Facet.getters.GET_FACET]("org_unit_hierarchy")
            let result = [{ value: null, text: this.$t("shared.entire_organisation") }]
            if ("classes" in facet) {
                for (var cl of facet.classes) {
                    result.push({ value: cl.uuid, text: cl.name })
                }
            }
            return result
        }
    },
}