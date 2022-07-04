<template lang="pug">
.hacks-table
  v-card
    v-card-title
      v-text-field(v-model='search' append-icon='mdi-magnify'
        label='Search' single-line hide-details
        :loading='loading' loading-text="Loading Articles... Please wait")
    v-data-table(:headers='headers' :items='articles' :search='search' :items-per-page="15")
      template(v-slot:item.when='{ item }')
        span {{ fromTimestampToDate(item.when) }}
      template(v-slot:item.stolen_usd='{ item }')
        span {{ item.stolen_usd_str }}
      template(v-slot:item.urls='{ item }')
        .m-0(v-for="url in item.urls")
          a(:href="url.link" target="_blank").text-decoration-none
            v-icon mdi-link
            span.ml-2 {{ url.text}}
        //
          ul
            li(v-for="url in item.urls")
              a(:href="url.link" target="_blank") {{ url.text}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { DateTime } from 'luxon';
import { Article, Header, StateRoot } from '@/store';

@Component({
  computed: {
    ...(mapState(['loading']) as MapStateToComputed<StateRoot>),
  },
})
export default class HacksTable extends Vue {
  @Prop({ required: true, type: Array, default: [] })
  public readonly articles!: Array<Article>

  @Prop({ required: true, type: Array, default: [] })
  public readonly headers!: Array<Header>

  private loading!: boolean; // is assigned via mapState

  private search = '';

  // eslint-disable-next-line class-methods-use-this
  public fromTimestampToDate(timestamp: number): string {
    return DateTime.fromMillis(timestamp).toISODate();
  }
}
</script>
