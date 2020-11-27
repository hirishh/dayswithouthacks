<template lang="pug">
  mixin Copyright
    v-icon(left='').mb-1 mdi-copyright
    span
      | {{ new Date().getFullYear() }} &mdash;
      |
      strong DaysWithoutHacks.LOL

  v-footer#footer(app padless fixed outlined absolute)
    v-col(cols='12').text-left
      +Copyright()

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class FooterBar extends Vue {
}
</script>

<style lang="scss">
#footer {
  a {
    text-decoration: none;
  }
}
</style>
