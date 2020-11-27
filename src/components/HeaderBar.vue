<template lang="pug">
  div
    // Desktop Menu
    v-app-bar#nav(app elevate-on-scroll absolute)
      router-link(to='/')
        .d-flex.align-center.vertical
          v-img.x-logo.mx-2(v-if="!$vuetify.theme.dark"
            alt='Days Without Hacks Logo' contain='' src='@/assets/logo-black.svg'
            transition='scale-transition' height='40' width='40')
          v-img.x-logo.mx-2(v-if="$vuetify.theme.dark"
            alt='Days Without Hacks Logo' contain='' src='@/assets/logo-white.svg'
            transition='scale-transition' height='40' width='40')

          v-img(v-if="!$vuetify.theme.dark"
            alt='C19.EARTH' transition='scale-transition'
            contain=''  src='@/assets/logo-name-black.png' height='40' width='360')
          v-img(v-if="$vuetify.theme.dark"
            alt='C19.EARTH' transition='scale-transition'
            contain='' src='@/assets/logo-name.png' height='40' width='360')

      v-divider.ml-4(vertical light inset).hidden-sm-and-down
      //
        router-link(to='/contact').hidden-sm-and-down
          v-btn(large text)
            v-icon mdi-email
            span.ml-4 Is there a new succulent hack? Contact Us!
      ContactModal

      v-spacer
      DonateModal.hidden-sm-and-down
      v-divider(vertical light inset).mr-4.hidden-sm-and-down
      ThemeSelector

      v-progress-linear(:active="loading" :indeterminate="true"
        absolute bottom color="cyan")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import ThemeSelector from '@/components/ThemeSelector.vue';
import ContactModal from '@/components/ContactModal.vue';
import DonateModal from '@/components/DonateModal.vue';

@Component({
  components: {
    ContactModal,
    DonateModal,
    ThemeSelector,
  },
  computed: {
    ...mapState(['loading']),
  },
})
export default class HeaderBar extends Vue {}
</script>

<style lang="scss">
#nav {
  a {
    text-decoration: none;
  }

  svg {
    fill: white;
    color: white;
  }
}
</style>
