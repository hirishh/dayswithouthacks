<template lang="pug">
.ethereum
  v-row.justify-center
    v-col(cols='12' md="10")
      FlipCountUp(:timestamp="getLatestTimestamp()")
  v-row(v-if="ethUsdStolen > 0").justify-center
    v-col(cols='12')
      .iCountUp
        ICountUp(:delay="100" :endVal="ethUsdStolen" :options="options")
  v-row.justify-center
    v-col(cols='12' xl="8")
      HacksTable(:articles='eth' :headers='headers')
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore missing types
import ICountUp from 'vue-countup-v2';
import { mapState } from 'vuex';
import { Article, Header, StateRoot } from '@/store';
import FlipCountUp from '@/components/FlipCountUp/FlipCountUp.vue';
import HacksTable from '@/components/HacksTable.vue';

@Component({
  computed: {
    ...(mapState(['eth', 'ethUsdStolen', 'btc', 'btcUsdStolen', 'headers']) as MapStateToComputed<StateRoot>),
  },
  components: {
    HacksTable,
    FlipCountUp,
    ICountUp,
  },
})
export default class Hacks extends Vue {
  private eth!: Array<Article>; // is assigned via mapState

  private btc!: Array<Article>; // is assigned via mapState

  private headers!: Array<Header>; // is assigned via mapState

  private options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    prefix: '$ ',
    suffix: ' Stolen on Ethereum',
    duration: 10,
  }

  public getLatestTimestamp(): number {
    if (this.eth && this.eth.length > 0) {
      return _.get(_.first(this.eth), 'when', 0);
    }
    return 0;
  }
}
</script>

<style scoped>
  .iCountUp {
    font-size: 4vw;
    margin: 0;
    color: #606faa;
  }
</style>
