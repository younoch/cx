<template>
  <div id="profile">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="3" class="d-none d-sm-inline-block">
          <div class="w-full sticky-top">
            <ad-card :footer="true" class="mt-2">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>

        <!-- create post section -->
        <v-col cols="12" md="6">
          <v-card class="mx-auto mt-2 rounded-lg" flat outlined>
            <div class="theme--dark">
              <v-subheader>
                <h2 class="font-weight-black">People</h2>
              </v-subheader>
            </div>

            <div v-if="members.length > 0">
              <v-list v-for="(member, idx) in members" :key="idx">
                <v-list-item three-line dense class="cursor-pointer mt-n2">
                  <v-list-item-content
                    class="mt-n3"
                    @click="$router.push(`/${member.username}`)"
                  >
                    <!-- <div class="text-overline mb-4">People</div> -->
                    <div class="d-flex" style="height: 30px">
                      <v-list-item-avatar
                        style="margin: 5px"
                        min-width="40"
                        min-height="40"
                        color="grey"
                      >
                        <v-img
                          class="elevation-4 pt-n4"
                          :alt="member.name + 's image'"
                          :src="member.image"
                        ></v-img
                      ></v-list-item-avatar>
                      <!-- :class="member.tagline ? '' : 'pt-5' " -->
                      <v-list-item-title class="subtitle-1 pl-2">
                        {{ member.name }}
                      </v-list-item-title>
                    </div>

                    <v-list-item-subtitle class="pl-15 mt-n8 font-weight-light">
                      {{ subStrText(member.tagline, 70) }}
                    </v-list-item-subtitle>
                    <!-- <p class="pl-15 caption font-weight-thin">
                        {{ subStrText(member.bio, 80) }}
                      </p> -->
                  </v-list-item-content>

                  <v-card-actions>
                    <v-btn
                      v-if="member.connectionStatus === 'notConnected'"
                      :loading="connecting && idx === index"
                      class="ma-2 no-uppercase"
                      min-width="120"
                      rounded
                      outlined
                      color="#2cbee3"
                      @click.prevent="showConnectNote(member, idx)"
                    >
                      Connect
                    </v-btn>
                    <v-btn
                      v-if="member.connectionStatus === 'connected'"
                      class="text-capitalize rounded-pill px-4"
                      color="primary"
                      outlined
                      :loading="connecting && idx === index"
                      @click="removeConfirm(member, idx)"
                    >
                      Connected
                    </v-btn>
                    <v-btn
                      v-if="member.connectionStatus === 'pending'"
                      class="text-capitalize rounded-pill px-2"
                      color="error"
                      outlined
                      :loading="connecting && idx === index"
                      @click="cancelConfirm(member, idx)"
                    >
                      Cancel Request
                    </v-btn>
                    <v-btn
                      v-if="member.connectionStatus === 'blocked'"
                      disabled
                      class="text-capitalize not-allowed rounded-pill px-2"
                      color="gray"
                      outlined
                    >
                      Withdrawn
                    </v-btn>
                  </v-card-actions>
                </v-list-item>
                <v-divider v-show="members.length > 1" inset></v-divider>
              </v-list>
              <div v-if="hasPage" class="text-center" @click="getMembers(true)">
                <div v-if="loading_users_pages" class="pb-5 text-center">
                  <v-progress-circular width="2" size="20" indeterminate />
                </div>

                <div v-else class="d-flex justify-center cursor-pointer">
                  <h2
                    class="
                      subtitle-1
                      pt-2
                      mt-n1
                      text-center
                      pb-2
                      font-weight-bold
                    "
                  >
                    See more
                  </h2>
                  <v-icon size="28" class="ml-4 seemore-icon mr-4 my-1">
                    {{ mdiChevronDown }}</v-icon
                  >
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <!-- START MOST POPULAR POSTS -->
          <div class="w-full sticky-top z-index-5 background mt-2">
            <!-- START MOST POPULAR POSTS -->
            <ad-card :footer="true" class="mt-2">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <Confirm ref="confirm" />

    <ConnectionNotePopUp
      ref="connectNote"
      @emitGetConnectionNote="getConnectionNote($event)"
    />
  </div>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
export default {
  name: 'SearchUser',
  data() {
    return {
      index: -1,
      connectionNote: '',
      connecting: false,
      mdiChevronDown,
      members: [],
      following: false,
      following_loading: false,
      hasPage: true,
      loading_users_pages: false,
      currentPage: 1,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    searchQuery() {
      return this.$route.query.users;
    },
  },

  mounted() {
    this.getMembers();
  },

  methods: {
    // search members
    async getMembers(showMore = true) {
      this.loading_users_pages = true;

      try {
        const { items, hasPages } = await this.$axios.$get(
          'api/search/members',
          {
            params: {
              page: showMore ? this.currentPage : 1,
              per_page: 5,
              query: this.searchQuery,
            },
          }
        );
        if (!showMore) {
          this.members = [];
          this.currentPage = 1;
        }

        items.forEach((item) => {
          this.members.push(item);
        });

        this.currentPage += 1;
        this.loading_users_pages = false;
        this.hasPage = hasPages;
      } catch (e) {
      } finally {
        this.loading_users_pages = false;
      }
    },

    showConnectNote(user, i) {
      this.$refs.connectNote.open().then((res) => {
        if (res) {
          this.connect(user, i);
        } else {
          this.connectWithoutNote(user, i);
        }
        return false;
      });
    },
    getConnectionNote(notes) {
      this.connectionNote = notes;
    },
    async connect(user, i) {
      this.index = i;
      this.connecting = true;
      try {
        await this.$axios.$post(`api/connection/request/${user.id}`, {
          connectNote: this.connectionNote,
        });
        this.connecting = false;
        user.connectionStatus = 'pending';
        this.$set(this.members, i, user);
        this.connectionNote = '';
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Connect request successfully sent'
        );
      } catch (e) {}
    },
    cancelConfirm(user, i) {
      this.$refs.confirm
        .open('Cancel Request !', `Are you sure?`, {
          color: 'red',
        })
        .then((res) => {
          if (res) {
            this.removeConnection(user, i);
          }
          return false;
        });
    },
    async removeConnection(user, i) {
      this.index = i;
      this.connecting = true;
      try {
        await this.$axios.$delete(`api/connection/${user.id}`);
        this.connecting = false;
        user.connectionStatus = 'notConnected';
        this.$set(this.members, i, user);

        const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
        updateUser.connectedUsers = updateUser.connectedUsers.filter((id) => {
          return Number(id) !== Number(user.id);
        });
        this.$auth.setUser(updateUser);

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Connection successfully removed'
        );
      } catch (e) {}
    },
    async connectWithoutNote(user, i) {
      this.index = i;
      this.connecting = true;
      try {
        await this.$axios.$post(`api/connection/request/${user.id}`);
        this.connecting = false;
        user.connectionStatus = 'pending';
        this.$set(this.members, i, user);
        this.connectionNote = '';
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Connect request successfully sent'
        );
      } catch (e) {}
    },
    removeConfirm(user, i) {
      this.$refs.confirm
        .open(
          'Disconnect!',
          `Are you sure to remove ${user.name} from your connection list?`,
          { color: 'red' }
        )
        .then((res) => {
          if (res) {
            this.removeConnection(user, i);
          }
          return false;
        });
    },
    async followTaxonomy(subgroupId, unique) {
      this.following = true;
      this.subgroupId = subgroupId;
      // this.test = this.subgroupId;
      try {
        if (this.loggedIn) {
          await this.$axios.$get(`api/follow-taxonomy/${subgroupId}`);
          this.following = false;
          await this.getFollowerTaxonomy(subgroupId);
        } else {
          this.following = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.following = false;
      }
    },
    // get followers of this page
    async getFollowerTaxonomy(subgroupId) {
      this.following_loading = true;
      try {
        const { members } = await this.$axios.$get(
          `api/follower-taxonomy/${16}`
        );
        this.following_loading = false;
        this.taxanomyMembers = members;
      } catch (e) {
        this.following_loading = false;
      }
    },
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
  },
};
</script>


<style scoped>
.no-uppercase {
  text-transform: unset !important;
}
</style>
