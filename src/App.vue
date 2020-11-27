<template lang='pug'>
  v-app

    HeaderBar

    v-main
      v-container(fluid)
        v-scroll-x-transition(mode='out-in' :hide-on-leave='true')
          router-view

    FooterBar

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeaderBar from '@/components/HeaderBar.vue';
import FooterBar from '@/components/FooterBar.vue';

@Component({
  components: {
    HeaderBar, FooterBar,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
