<template>
  <div class="py-3">
    <v-row v-if="contactAddOrExportSectionShow" class="justify-center">
      <v-col cols="12" lg="8" class="pt-0">
        <!-- Imported contact Start -->
        <v-card class="mx-auto mb-5 rounded-lg border-1" outlined>
          <v-row class="px-4 mt-4 mb-2 align-center">
            <v-col class="py-0" cols="5">
              <h4 class="font-weight-medium subtitle-1 text--text">
                {{ contactCount }} Imported Contacts
              </h4>
            </v-col>
            <v-col class="py-0" cols="7">
              <v-text-field
                label="Search by name or company"
                persistent-hint
                outlined
                dense
                hide-details
                :prepend-inner-icon="mdiMagnify"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="mt-5"></v-divider>

          <template v-if="contacts.length > 0">
            <v-list v-for="(contact, i) in contacts" :key="contact.id">
              <v-list-item class="d-flex pa-0">
                <div class="pl-4 d-flex align-center">
                  <v-list-item-avatar
                    class="rounded-pill d-inline-block"
                    tile
                    size="70"
                    color="primary"
                    ><img src="~/assets/images/home/book.png"
                  /></v-list-item-avatar>
                </div>
                <div
                  class="justify-center d-flex flex-column flex-grow-1 h-100"
                >
                  <div>
                    <div
                      class="
                        mx-sm-4
                        ml-1
                        my-2
                        mr-sm-3 mr-1
                        d-flex
                        justify-space-between
                        flex-grow-1
                        wrap
                      "
                    >
                      <div class="text-overline">
                        <v-list-item-title class="text-lowercase contact_email">
                          <span>{{ contact.email }}</span>
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="
                            my-1
                            text-capitalize
                            body-2
                            greyMuted--text
                            contact_email
                          "
                        >
                          Created:
                          {{ contact.created_at | toFormattedDateString }}
                        </v-list-item-subtitle>
                      </div>
                      <v-card-actions>
                        <v-chip
                          v-if="contact.connected"
                          outlined
                          color="primary"
                        >
                          Connected
                        </v-chip>
                        <v-chip
                          v-else-if="contact.invited"
                          outlined
                          color="success"
                        >
                          Invited
                        </v-chip>
                        <v-btn
                          v-else
                          rounded
                          outlined
                          color="primary"
                          width="90"
                          class="
                            py-2
                            text-capitalize
                            body-1
                            font-weight-bold
                            height-31
                          "
                          :loading="contact.loading"
                          @click="invite(contact, i)"
                        >
                          Invite
                        </v-btn>
                      </v-card-actions>
                    </div>
                    <v-divider class="align-baseline"></v-divider>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </template>


          <!-- no functionality for show more button, removed for now -->
          <!-- <div v-if="contactCount > 0" class="px-5 pt-8">
            <v-btn
              outlined
              rounded
              text
              class="
                py-2
                mb-5
                rounded-pill
                font-weight-regular
                w-100
                text-transform-initial
              "
              >Show more results
            </v-btn>
          </div> -->
        </v-card>
      
        <!-- Imported contact End -->
      </v-col>
      <v-col v-if="contactAddOrExportSectionShow" class="pt-0" cols="12" lg="4">
        <div>
          <v-btn color="primary" rounded block outlined @click="importContact">
            <v-icon>{{ mdiPlus }}</v-icon>
            Add more contacts
          </v-btn>
        </div>

        <!-- this two button is being removed for now, maybe will implement in future -->
        <!-- <div class="mt-4">
          <v-btn color="primary" rounded block outlined>
            <v-icon>{{ mdiExport }}</v-icon>
            Export contacts
          </v-btn>
        </div> -->
        <!-- <div class="mt-4">
          <v-btn color="primary" rounded block outlined>
            <v-icon>{{ mdiSync }}</v-icon>
            manage synced contacts
          </v-btn>
        </div> -->
      </v-col>
    </v-row>

    <!-- Grow your CXBrainstorm network Start -->
    <v-row v-if="!contactAddOrExportSectionShow">
      <v-col cols="12" class="pt-0">
        <v-card
          tile
          outlined
          flat
          class="justify-center rounded-lg pa-4 d-flex"
        >
          <div>
            <p class="mb-0 text-center font-weight-medium text--text font-28">
              Grow your CXBrainstorm network
            </p>
            <v-card-subtitle
              class="py-0 text-center title font-weight-regular text--text"
              >Enter your email below to sync your contacts.</v-card-subtitle
            >
            <validation-observer
              ref="form"
              v-slot="{ handleSubmit, invalid }"
              tag="div"
              class="v-card__text pb-0"
            >
              <v-form
                class="justify-md-center mt-7 mb-4 d-flex flex-wrap align-start"
                @submit.prevent="handleSubmit(sendEmail)"
              >
                <b-email
                  v-model="email"
                  rules="required|email"
                  label="Email"
                  vid="email"
                  outlined
                  rounded
                  dense
                  class="flex-grow-1"
                />
                <v-card-actions class="pl-sm-2 pl-0 pt-0">
                  <v-spacer />
                  <v-btn
                    :loading="sending"
                    class="
                      mx-sm-2 mx-1
                      text-capitalize
                      rounded-pill
                      primary
                      whiteBackground--text
                      px-5
                      mb-1
                    "
                    type="submit"
                    :disabled="invalid"
                  >
                    Invite
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
            <!-- <p class="pl-4 text-center">
              Or use one of these networks to sync your contacts
            </p>
            <div class="justify-center d-flex social-icon mb-3">
              <v-btn text fab @click.stop="socialAuthorization('google')">
                <v-img
                  class="
                    cursor-pointer
                    d-inline-block
                    flex-grow-0
                    elevation-3
                    rounded-lg
                  "
                  :src="`/socials/google.png`"
                  width="36"
                />
              </v-btn>
            </div> -->
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- Grow your CXBrainstorm network Start -->
  </div>
</template>

<script>
import {
  mdiAccountBox,
  mdiPlus,
  mdiExport,
  mdiSync,
  mdiAccount,
  mdiGoogle,
  mdiFacebook,
  mdiLinkedin,
  mdiMagnify,
} from '@mdi/js';

export default {
  name: 'MyContacts',
  middleware: 'auth',
  props: {
    contactCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    loading: false,
    contacts: [],
    sending: false,
    email: '',
    google_contacts: false,
    linkedin_contacts: false,
    facebook_contacts: false,
    index: -1,
    current_page: 1,
    last_page: 0,
    load_more: false,
    mdiAccountBox,
    mdiPlus,
    mdiExport,
    mdiSync,
    mdiAccount,
    mdiGoogle,
    mdiFacebook,
    mdiLinkedin,
    mdiMagnify,
    contactAddOrExportSectionShow: true,
  }),
  head: {
    title: 'Contacts',
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
  },
  async mounted() {
    await this.getContacts();
  },
  methods: {
    // send invite email
    async invite(contact, index) {
      contact.loading = true;
      this.$set(this.contacts, index, contact);
      try {
        const { message } = await this.$axios.$post(
          'api/send-invitation-email',
          {
            email: contact.email,
          }
        );
        contact.loading = false;
        this.$set(this.contacts, index, contact);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        contact.loading = false;
        this.$set(this.contacts, index, contact);
        if (err.response && err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    // send invite email
    async sendEmail() {
      this.sending = true;
      try {
        const { message } = await this.$axios.$post(
          'api/send-invitation-email',
          {
            email: this.email,
          }
        );
        this.sending = false;
        this.email = '';
        this.$refs.form.reset();
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
      } catch (err) {
        this.sending = false;
        if (err.response && err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
    importContact() {
      this.contactAddOrExportSectionShow = false;
    },
    loginWithGoogle() {
      // something
    },
    loginWithFacebook() {
      // something
    },
    loginWithLinkedin() {
      // something
    },
    contactSyncContinue() {
      this.contactAddOrExportSectionShow = true;
    },
    // get contacts
    async getContacts() {
      this.loading = true;
      try {
        const { data } = await this.$axios.$get('api/connection/contact');
        this.loading = false;
        this.contacts = data;
      } catch (e) {}
    },

    async socialAuthorization(provider) {
      await this.$social.redirect(provider);
    },
  },
};
</script>
