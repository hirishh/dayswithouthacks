<template lang="pug">
  v-scroll-y-transition(mode='in-out' :hide-on-leave='true')
    v-card.mx-auto.justify-center(v-if="show" width='100%')
      v-card-text
        .display-4 {{ displayValue() }}
      v-card-text
        .display-1 {{ property }}
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import _ from 'lodash';

@Component({
  filters: {
    zerofill(value: number): string {
      // value = ( value < 0 ? 0 : value );
      return (value < 10 && value > -1 ? '0' : '') + value;
    },
  },
})
export default class Tracker extends Vue {
  @Prop({ required: true, type: String, default: '' })
  public property!: string

  @Prop({ required: true, type: [String, Number], default: 0 })
  public value!: string | number

  @Prop({ type: Boolean, default: false })
  public zerofill!: boolean

  public show = false;

  mounted() {
    this.show = true;
  }

  public displayValue(): string {
    if (this.zerofill) {
      return this.$options.filters?.zerofill(this.value);
    }
    return _.toString(this.value);
  }
}
</script>
