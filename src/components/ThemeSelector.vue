<template lang="pug">
div
  v-tooltip(v-if='$vuetify.theme.dark' bottom='')
    template(v-slot:activator='{ on }')
      v-btn(v-on='on' x-small fab @click='darkMode')
        v-icon(small).mr-1 mdi-moon-waxing-crescent
    span Dark Mode On
  v-tooltip(v-else='' bottom='')
    template(v-slot:activator='{ on }')
      v-btn(v-on='on' x-small fab @click='darkMode')
        v-icon(small color='yellow') mdi-white-balance-sunny
    span Dark Mode Off
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class ThemeSelector extends Vue {
  public darkMode() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }
}
</script>
