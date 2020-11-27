<template lang="pug">
  v-dialog(v-model='dialog' max-width='50%')
    template(v-slot:activator='{ on, attrs }')
      v-btn(large text v-bind='attrs' v-on='on')
        v-icon mdi-email
        span.ml-4 New Hack? Contact Us!
    v-card
      v-card-title
        v-icon(large).mx-2 mdi-email
        span.headline Contact Us
      v-card-text
        v-container.contact
          v-row(justify="center")
            v-col(cols='12')
              .text-body-1
                | Do we miss an hack?
                | Do you have any questions?
              .text-body-1
                | Please do not hesitate to contact us!

              v-form(v-model='valid' ref="contactForm")
                v-row
                  v-col(cols='12' md='6')
                    v-text-field(v-model='name' label='Name')
                  v-col(cols='12' md='6')
                    v-text-field(v-model='email' :rules='emailRules' label='E-mail (*)' required)
                v-row
                  v-col(cols='12')
                    v-text-field(v-model='subject' label='Subject')
                  v-col(cols='12')
                    v-textarea(v-model='message' :rules='messageRules'
                      outlined name='Message' label='Message')
                v-row(justify="center")
                  v-alert(v-model="showSuccess" outlined type='success' text border="left"
                    transition="fab-transition")
                    | Message Sent successfully.
                  v-alert(v-model="showError" outlined type="warning" text border="left"
                    transition="fade-transition")
                    | An error occurred while sending the message. Please try again later.
                v-row
                  v-col(cols='12')
                    v-btn.mr-4(:disabled='!valid' color='success' @click="submit")
                      | Submit
                    v-btn.mr-4(color='error' @click='reset')
                      | Reset Form
      v-card-actions
        v-spacer
        v-btn(color='blue darken-1' text='' @click='dialog = false')
          | Close
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '../api';

export type VForm = Vue & {
  validate: () => boolean;
  reset: () => void;
}

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
})
export default class ContactModal extends Vue {
  private dialog = false;

  private valid = false;

  private name = '';

  private email = '';

  private emailRules = [
    (v: string) => !!v || 'A mail is required',
    (v: string) => emailRegex.test(v) || 'E-mail must be valid',
  ];

  private subject = '';

  private message = '';

  private messageRules = [
    (v: string) => !!v || 'A message is required',
  ];

  private showSuccess = false;

  private showError = false;

  public reset(): void {
    (this.$refs.contactForm as VForm).reset();
    this.showSuccess = false;
    this.showError = false;
  }

  public async submit() {
    const textMessage = `Name: ${this.name}\n`
      + `Email: ${this.email}\n`
      + `Subject: ${this.subject}\n`
      + `----------------\n${this.message}\n----------------`;
    const res = await api.sendTelegramMessage(textMessage);
    if (res) {
      // Alarm ok
      this.showSuccess = true;
      this.showError = false;
    } else {
      // Alarm ko
      this.showSuccess = false;
      this.showError = true;
    }
  }
}
</script>
