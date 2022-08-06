<template>
  <div class="width-full">
    <div class="sticky-top-8 z-index-3 background">
      <template v-if="memberHeaderLoading">
        <v-card flat class="border-1" rounded="lg">
          <v-row class="my-1 align-center">
            <v-col class="py-0" cols="12">
              <v-skeleton-loader type="table-heading" />
            </v-col>
          </v-row>
        </v-card>
      </template>
      <template v-else>
        <v-card flat class="py-2 border-1" rounded="lg">
          <v-row class="px-4 my-1 align-center">
            <v-col class="py-0" cols="12" sm="7"
              ><h4 class="font-weight-medium subtitle-1 text--text">
                {{ memberCount }} Members
              </h4></v-col
            >
            <v-col class="py-0" cols="12" sm="5">
              <v-text-field
                v-model="query"
                label="Search by name"
                persistent-hint
                outlined
                dense
                hide-details
                :prepend-inner-icon="mdiMagnify"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </div>
    <v-row class="mt-6">
      <template v-if="loading">
        <v-col
          v-for="(n, i) in 8"
          :key="i"
          cols="12"
          lg="4"
          md="6"
          class="py-0 pb-6"
        >
          <v-skeleton-loader type="card" />
        </v-col>
      </template>
      <template v-else>
        <template v-if="members.length > 0">
          <v-col
            v-for="(user, i) in members"
            :key="i"
            cols="12"
            lg="4"
            md="6"
            class="py-0 pb-6"
          >
            <v-card outlined class="rounded-lg">
              <div class="avatar">
                <v-img
                  class="rounded-t-lg"
                  height="80"
                  :src="user.cover_image"
                />
                <v-avatar class="profile" size="100">
                   <img :src="user && user.image? user.image : $store.state.defaultProfileImage" alt="John" />
                </v-avatar>
              </div>
              <div class="avatar-spacer" />
              <v-card-title class="justify-center py-0">
                <n-link
                  class="
                    title--text
                    h6
                    font-weight-bold
                    mambers-name
                    subtitle-1
                  "
                  :to="`/${user.username}`"
                >
                  {{
                    user.name && user.name.length > 20
                      ? user.name.substr(0, 20) + '...'
                      : user.name
                  }}
                </n-link>
              </v-card-title>
              <v-card-subtitle
                class="
                  text-center
                  title--text
                  font-weight-light
                  user-designation
                  pt-3
                  caption
                  pb-1
                "
                :class="[
                  user.tagline && user.tagline.length > 0 ? '' : 'height-36',
                ]"
              >
                {{
                  user.tagline && user.tagline.length > 30
                    ? user.tagline.substr(0, 30) + '...'
                    : user.tagline
                }}
              </v-card-subtitle>
              <v-card-subtitle class="text-center pb-3 pt-0">
                <strong class="caption font-weight-bold">Joined: </strong>
                <span class="caption">{{
                  user.created_at | humanReadable
                }}</span>
              </v-card-subtitle>
              <v-divider class="mx-5"></v-divider>

              <v-card-actions
                v-if="loggedIn && user.id !== authUser.id"
                class="justify-center py-2"
              >
                <template v-if="user.connectionStatus !== 'blocked'">
                  <v-btn
                    v-if="user.connectionStatus === 'notConnected'"
                    class="text-capitalize rounded-pill px-4 text--text"
                    outlined
                    :loading="connecting && i === index"
                    @click="showConnectNote(user, i)"
                  >
                    <v-icon left>{{ mdiPlus }}</v-icon> Connect
                  </v-btn>
                  <v-btn
                    v-if="user.connectionStatus === 'connected'"
                    class="text-capitalize rounded-pill px-4"
                    color="primary"
                    outlined
                    :loading="connecting && i === index"
                    @click="removeConfirm(user, i)"
                  >
                    Connected
                  </v-btn>
                  <v-btn
                    v-if="user.connectionStatus === 'pending'"
                    class="text-capitalize rounded-pill px-2"
                    color="error"
                    outlined
                    :loading="connecting && i === index"
                    @click="cancelConfirm(user, i)"
                  >
                    Cancel Request
                  </v-btn>
                  <template v-if="user.connectionStatus === 'requested'">
                    <v-menu top rounded="lg">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          class="text-capitalize rounded-pill px-4"
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          Requested
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-btn
                            class="text-capitalize rounded-pill"
                            color="warning"
                            outlined
                            :loading="ignoring && i === index"
                            @click.stop="updateConnection(user, i, 'ignore')"
                          >
                            Ignore
                          </v-btn>
                        </v-list-item>
                        <v-list-item>
                          <v-btn
                            class="text-capitalize rounded-pill"
                            color="primary"
                            :loading="connecting && i === index"
                            @click.stop="updateConnection(user, i, 'connect')"
                          >
                            Accept
                          </v-btn>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>

                  <template v-if="user.isFollowing">
                    <v-btn
                      class="text-capitalize rounded-pill px-4"
                      color="primary"
                      outlined
                      :loading="following && i === index"
                      @click="followMember(user, i)"
                    >
                      Following
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      class="text-capitalize rounded-pill px-6"
                      color="primary"
                      outlined
                      :loading="following && i === index"
                      @click="followMember(user, i)"
                    >
                      Follow
                    </v-btn>
                  </template>
                </template>
                <template v-else>
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <v-chip
                        class="text-capitalize rounded-pill px-6"
                        outlined
                        v-on="on"
                      >
                        {{ user.remainingTime | remainDays }}
                      </v-chip>
                    </template>
                    <span>{{ user.remainingTime | remainDays }}</span>
                  </v-tooltip>
                </template>
              </v-card-actions>
              <v-card-actions v-else class="justify-center py-2">
                <v-btn
                  class="text-capitalize rounded-pill px-6"
                  color="primary"
                  outlined
                  nuxt
                  :to="`/${user.username}`"
                >
                  Profile
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <div class="d-flex align-center justify-center">
              <p class="text-h5 title--text opacity-08">No members found</p>
            </div>
          </v-col>
        </template>
      </template>
      <Confirm ref="confirm" />
      <!-- connection note popup -->
      <ConnectionNotePopUp
        ref="connectNote"
        @emitGetConnectionNote="getConnectionNote($event)"
      />
    </v-row>
  </div>
</template>
<script>
import { mdiPlus, mdiMagnify } from '@mdi/js';
import * as debounce from 'lodash.debounce';
import { parseISO, formatDistanceStrict, addWeeks, format } from 'date-fns';

export default {
  name: 'MyMembers',
  filters: {
    remainDays(value) {
      const date = new Date();
      const week = addWeeks(parseISO(value), 3);
      const toDayDate = format(date, 'MM-dd-yyy, H:i:s');
      const addWeekdate = format(week, 'MM-dd-yyy, H:i:s');
      if (toDayDate < addWeekdate) {
        return formatDistanceStrict(date, week);
      } else {
        return 0;
      }
    },
  },
  props: {
    memberCount: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    loading: false,
    members: [],
    following: false,
    index: -1,
    connecting: false,
    ignoring: false,
    current_page: 1,
    last_page: 0,
    load_more: false,
    connectionNote: '',
    mdiPlus,
    mdiMagnify,
    query: '',
    memberHeaderLoading: true,
  }),
  head: {
    title: 'Members',
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
  },
  watch: {
    query: debounce(function () {
      this.index = -1;
      this.current_page = 1;
      this.last_page = 0;
      this.getMembers(this.query);
    }, 500),
  },
  async mounted() {
    await this.getMembers();
    this.memberHeaderLoading = false;
    // auto scroll pagination
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // handle scroll pagination
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.current_page < this.last_page) {
          if (!this.load_more) {
            this.current_page++;
            this.loadMore();
          }
        }
      }
    },
    // get members
    async getMembers(query = '') {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/get-users?query=${query}`,
          {
            params: { page: 1, limit: 16 },
          }
        );

        this.loading = false;
        this.members = data;
        this.last_page = meta.last_page;
      } catch (e) {
        this.loading = false;
      }
    },

    getConnectionNote(notes) {
      this.connectionNote = notes;
    },
    // show connection note popup
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
    // send connect request
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
    // send connect request
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
    // update connection, connect or ignore
    async updateConnection(user, i, action) {
      this.index = i;
      action === 'connect' ? (this.connecting = true) : (this.ignoring = true);
      try {
        await this.$axios.$post(`api/connection/${user.id}/${action}`);
        action === 'connect'
          ? (this.connecting = false)
          : (this.ignoring = false);
        let notifyMessage = '';

        if (action === 'connect') {
          user.connectionStatus = 'connected';

          const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
          updateUser.connectedUsers = updateUser.connectedUsers.push(user.id);
          this.$auth.setUser(updateUser);

          notifyMessage = 'Connect successfully accepted';
        } else {
          user.connectionStatus = 'notConnected';
          notifyMessage = 'Connect successfully ignored';
        }
        this.$set(this.members, i, user);
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', notifyMessage);
      } catch (e) {
        action === 'connect'
          ? (this.connecting = false)
          : (this.ignoring = false);
      }
    },
    // remove confirm
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
    // cancel confirm
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
    // remove connection
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
    // follow member
    async followMember(user, i) {
      this.index = i;
      this.following = true;
      try {
        const { following } = await this.$axios.$get(
          `api/user/follow/${user.id}`
        );
        this.following = false;
        user.isFollowing = following;
        this.$set(this.members, i, user);

        const updateUser = JSON.parse(JSON.stringify(this.$auth.user));

        if (following) {
          this.$emit('addFollowingCount');
          updateUser.peopleIFollow.push(user.id);
        } else {
          this.$emit('removefollowCount');
          updateUser.peopleIFollow = updateUser.peopleIFollow.filter((id) => {
            return Number(id) !== Number(user.id);
          });
        }

        this.$auth.setUser(updateUser);

        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          following ? 'Successfully followed' : 'Successfully unfollowed'
        );
      } catch (e) {}
    },
    // load more
    async loadMore() {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get('api/get-users', {
          params: {
            page: this.current_page,
            limit: 16,
          },
        });
        this.members = this.members.concat(data);
        this.load_more = false;
      } catch (e) {
        this.load_more = false;
      }
    },
  },
};
</script>
<style scoped>
.sticky-top-8 {
  position: sticky !important;
  top: 7rem !important;
}

@media only screen and (max-width: 960px) {
  .sticky-top-8 {
    top: 6.5rem !important;
  }
}
</style>
