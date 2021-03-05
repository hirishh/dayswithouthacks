<template lang="pug">
  v-row(dense).d-flex.justify-center
    v-col(v-if='years > 0')
      Tracker(property='Years' v-model="years")
    v-col
      Tracker(property='Days' v-model="days")
    v-col
      Tracker(property='Hours' v-model="hours" :zerofill="true")
    v-col
      Tracker(property='Minutes' v-model="minutes" :zerofill="true")
    v-col.hidden-sm-and-down
      Tracker(property='Seconds' v-model="seconds" :zerofill="true")
</template>

<script lang="ts">
import { DateTime, Duration } from 'luxon';
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import Tracker from '@/components/FlipCountUp/Tracker.vue';

@Component({
  components: {
    Tracker,
  },
})
export default class FlipCountUp extends Vue {
  @Prop({ required: true, type: Number, default: '' })
  public readonly timestamp!: number

  private time: DateTime = DateTime.fromMillis(this.timestamp);

  private timer: NodeJS.Timeout | null = null;

  private years = 0;

  private days = 0;

  private hours = 0;

  private minutes = 0;

  private seconds = 0;

  beforeMount() {
    this.update();
  }

  mounted() {
    this.timer = setInterval(this.update.bind(this), 1000);
  }

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  @Watch('timestamp')
  timestampChanged(newTimestamp: number) {
    this.time = DateTime.fromMillis(newTimestamp);
    this.update();
  }

  public update() {
    const now = DateTime.local();
    const diff: Duration = now.diff(this.time)
      .shiftTo('years', 'days', 'hours', 'minutes', 'seconds');
    this.years = diff.years;
    this.days = diff.days;
    this.hours = diff.hours;
    this.minutes = diff.minutes;
    this.seconds = Math.round(diff.seconds);
  }
}
</script>

<style lang="scss">

</style>
