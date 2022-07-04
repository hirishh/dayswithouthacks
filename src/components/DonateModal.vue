<template lang="pug">
v-dialog(v-model='dialog' max-width='80%' eager)
  template(v-slot:activator='{ on, attrs }')
    v-btn(large text v-bind='attrs' v-on='on')
      span.mr-2 Donate with real money.
      v-icon(color="yellow darken-3") mdi-bitcoin
      span.mx-2 or
      v-icon(color="yellow darken-3") mdi-flash
  v-card
    v-card-title
      v-icon(large).mx-2 mdi-gift
      span.headline Thank you.
    v-card-text
      // Notifications
      notifications(group="clipboard" position="bottom right" :duration="1500" width="500px")
      v-container.contact
        v-row(justify="center")
          v-col(cols='12' :md="6")

            h1.my-5 On Chain Transaction
            v-card(width="100%")
              v-card-text
                code.py-2
                  a.btc-addr(:href='`bitcoin:${donationAddress}`')
                    | {{ donationAddress }}
                .mt-4
                  v-btn(
                    v-clipboard:copy="donationAddress"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onCopyError")
                    v-icon mdi-content-copy
                    | Copy
            v-btn.my-4(@click="expandQR = !expandQR") Show QR Code
            v-expand-transition(mode="out-in")
              v-row(v-show="expandQR" justify="center")
                v-col(cols='12' :md="6")
                  v-card(width="100%")
                    v-img(src="@/assets/btc-qrcode.png" alt="Bitcoin Donation QRCode"
                      contain='' width="100%" eager)

        v-divider.my-6

        v-row(justify="center")
          v-col(cols='12' :md="10")
            h1.my-5 Lightning Network Transaction

            v-row.mt-5(justify="center")
              v-alert(v-model="showSuccess" prominent outlined type='success' text border="left"
                transition="fab-transition")
                | Donation Received. Thank you for your support!
              v-alert(v-model="showError" prominent outlined type="warning" text border="left"
                transition="fade-transition")
                | An error occurred while checking the invoice. Please try again later.

            template(v-if="!showSuccess && !showError")
              v-expand-transition(mode="out-in")
                v-row(v-show="paymentRequest === null" justify="center")
                  v-col(cols='12' :md="6")
                    v-form(v-model='valid' ref="donateForm")
                      v-text-field.my-2(v-model='value'
                        label='Satoshis' :rules='valueRules' required)
                      v-text-field.my-2(v-model='memo' :rules='memoRules'
                        label='Invoice Memo. Leave us a message!')
              v-expand-transition(mode="out-in")
                v-row(v-if="paymentRequest !== null" justify="center")
                  v-col(cols='12' :md="6")
                    vue-qrcode.p-5(:value="paymentRequest")
                  v-col(cols='12' :md="6").text-left
                    pre.pre-word-wrap.rounded-lg
                      | {{ paymentRequest }}
                    v-btn.my-4.mx-4(
                      v-clipboard:copy="paymentRequest"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onCopyError")
                        v-icon.mr-2 mdi-content-copy
                        | Copy
                    v-btn(:href='`lightning:${paymentRequest}`').my-4.mx-4.float-right
                      v-icon.mr-2 mdi-open-in-new
                      | Open in Wallet

            v-btn.my-4.mr-5(color='error' @click='reset')
              | Reset Donation
            v-btn.my-4(:disabled='!valid || paymentRequest !== null'
              color='success' @click="generateInvoice")
              | Generate Invoice

    v-card-actions
      v-spacer
      v-btn(color='blue darken-1' text='' @click='dialog = false')
        | Close
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueQrcode from 'vue-qrcode';
import EventSource from 'eventsource';
import _ from 'lodash';
import api from '../api';

type VForm = Vue & {
  validate: () => boolean;
  reset: () => void;
}

function getBytesSize(str: string): number {
  let bytes = 0;
  const len = str.length;
  let codePoint;
  let next;
  let i;

  // eslint-disable-next-line no-plusplus
  for (i = 0; i < len; i++) {
    codePoint = str.charCodeAt(i);
    // Lone surrogates cannot be passed to encodeURI
    if (codePoint >= 0xD800 && codePoint < 0xE000) {
      if (codePoint < 0xDC00 && i + 1 < len) {
        next = str.charCodeAt(i + 1);

        if (next >= 0xDC00 && next < 0xE000) {
          bytes += 4;
          // eslint-disable-next-line no-plusplus
          i++;
          // eslint-disable-next-line no-continue
          continue;
        }
      }
    }
    // eslint-disable-next-line no-nested-ternary
    bytes += (codePoint < 0x80 ? 1 : (codePoint < 0x800 ? 2 : 3));
  }
  return bytes;
}

@Component({
  components: { VueQrcode },
})
export default class DonateModal extends Vue {
  private dialog = false;

  private expandQR = false;

  private donationAddress = 'bc1q4efg3q7cn9q987ct8rs6yapa32jyuh8pt7nt8k';

  private valid = false;

  private paymentRequest: string | null = null;

  private rHashStr: string | null = null;

  private settledListener: EventSource | null = null;

  private value: number | null = null;

  private valueRules = [
    (v: string) => !!v || 'Amount in Satoshis is required',
    (v: string) => !_.isNaN(_.toNumber(v)) || 'Only numeric values here',
  ];

  private memo = '';

  private memoRules = [
    (v: string) => getBytesSize(v || '') < 639 || 'Max 639 bytes allowed',
  ];

  private showSuccess = false;

  private showError = false;

  public reset(): void {
    this.paymentRequest = null;
    this.rHashStr = null;
    this.value = null;
    this.memo = '';
    this.showSuccess = false;
    this.showError = false;
    const form = (this.$refs.donateForm as VForm);
    if (form) form.reset();
    if (this.settledListener) this.settledListener.close();
  }

  // eslint-disable-next-line class-methods-use-this
  public onCopy(): void {
    this.$notify({
      group: 'clipboard',
      type: 'ok',
      title: 'Copy To Clipboard',
      text: 'Text successfully copied in your clipboard!',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public onCopyError(): void {
    this.$notify({
      group: 'clipboard',
      type: 'ko',
      title: 'Copy To Clipboard',
      text: 'This functionality is not supported on your browser. Sorry!',
    });
  }

  public async generateInvoice() {
    if (!this.value) { return; }
    const res = await api.createInvoice(this.value, this.memo);
    if (res) {
      this.paymentRequest = _.get(res, 'payment_request', '');
      this.rHashStr = _.get(res, 'r_hash_str');

      // Put in listening mode
      this.settledListener = api.createListenSettledESS(this.rHashStr || '');
      this.settledListener.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.isSettled === true) {
          if (this.settledListener) this.settledListener.close();
          this.showSuccess = true;
          this.showError = false;
          this.sendTelegramNotification();
        }
      };
      this.settledListener.onerror = () => {
        if (this.settledListener) this.settledListener.close();
        this.showSuccess = false;
        this.showError = true;
      };
    } else {
      // Manage Error
      this.showSuccess = false;
      this.showError = true;
    }
  }

  public async sendTelegramNotification() {
    const data = {
      value: this.value || 0,
      memo: this.memo,
    };
    await api.sendDonationNotification(data);
  }
}
</script>

<style lang="scss">
.btc-addr {
  margin: 1rem;
  text-decoration:none
}

.vue-notification {
  padding: 10px;
  margin: 0 15px 15px;

  font-size: 1rem;

  &.ok {
    background: #68CD86;
    border-left-color: #42A85F !important;
  }

  &.ko {
    background: #E54D42;
    border-left-color: #B82E24 !important;
  }
}

.pre-word-wrap {
  border: aqua 1px solid;
  padding: 15px;
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>
