<template lang="pug">
v-container(fluid).home
  Hacks
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Hacks from '@/components/Hacks.vue';

@Component({
  components: {
    Hacks,
  },
})
export default class Home extends Vue {}
</script>
