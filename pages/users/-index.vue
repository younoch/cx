<template>
  <div id="profile">
    <v-container v-if="user">
      <v-row justify="center">
        <v-col cols="12" md="3">
          <user-profile-card
            :card-data="user"
            :show-edit="true"
            @updateUserProfile="updateUserProfile"
          />

          <v-card class="overflow-hidden rounded-lg" outlined>
            <v-subheader
              class="flex flex-row align-center justify-space-between"
            >
              <p class="mb-0">Bio</p>
              <template v-if="authUser.username !== user.username">
                <div v-if="user.connection === 'requested'">
                  <v-btn
                    class="rounded-pill text-capitalize"
                    color="warning"
                    outlined
                    dark
                    small
                    :loading="ignoring"
                    @click.stop="updateConnection(user, 'ignore')"
                  >
                    Ignore
                  </v-btn>
                  <v-btn
                    class="rounded-pill text-capitalize"
                    color="primary"
                    dark
                    small
                    :loading="connecting"
                    @click.stop="updateConnection(user, 'connect')"
                  >
                    Accept
                  </v-btn>
                </div>
                <v-btn
                  v-if="user.connection === 'pending'"
                  class="text-capitalize rounded-pill px-2"
                  color="error"
                  outlined
                  small
                  :loading="connecting"
                  @click="cancelConfirm(user)"
                >
                  Cancel Request
                </v-btn>

                <v-btn
                  v-if="user.connection === 'connected'"
                  class="text-capitalize rounded-pill px-6"
                  color="primary"
                  small
                  outlined
                  @click="selectUser(user)"
                >
                  Message
                </v-btn>

                <v-btn
                  v-if="user.connection === 'notConnected'"
                  class="rounded-pill text-capitalize"
                  color="primary"
                  dark
                  small
                  @click="showConnectNote(user)"
                >
                  Connect
                </v-btn>
              </template>
            </v-subheader>
            <v-divider />
            <v-card-subtitle>
              {{ user.bio ? user.bio : 'No Data Found!' }}
            </v-card-subtitle>
          </v-card>

          <div class="sticky-top">
            <v-card
              class="my-2 overflow-auto rounded-lg custom-scrollbar"
              outlined
              :style="{ height: getTotalMenusAutoHeight }"
            >
              <v-list tile class="py-0">
                <v-subheader>My Content </v-subheader>
                <v-divider />
                <v-list-item-group v-model="menu" color="primary">
                  <v-list-item v-for="(item, i) in menus" :key="i">
                    <v-list-item-icon v-if="item.icon !== null">
                      <v-icon v-text="item.icon" />
                    </v-list-item-icon>
                    <v-list-item-icon v-else class="mr-2 mt-6">
                      <div class="cx__icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g id="Layer_2" data-name="Layer 2">
                            <g id="Layer_1-2" data-name="Layer 1">
                              <rect
                                class="cx__icon-cls-1"
                                width="24"
                                height="24"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M6.82,15.72c2,0,3.88,0,5.77,0a6.78,6.78,0,0,0,4.88-2,7.21,7.21,0,0,0,2-7.1,4.09,4.09,0,0,1,1.42.51,5.62,5.62,0,0,1,3,5c.06,3.86,0,7.71,0,11.57,0,.05,0,.11,0,.26l-1.82-2c-1-1.15-2-2.28-3-3.44a1,1,0,0,0-.83-.38c-2.26,0-4.53,0-6.79,0A5.86,5.86,0,0,1,6.82,15.72Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M13.46,9.35c-.74,0-.71,0-.76-.73a1.41,1.41,0,0,1,.48-1.18q2.58-2.52,5.1-5.09c.32-.33.49-.3.75,0a7.55,7.55,0,0,0,.8.8c.16.15.21.25,0,.44C18,5.45,16.14,7.3,14.3,9.17,14,9.45,13.71,9.29,13.46,9.35Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M22,1.43a2.16,2.16,0,0,1-.25.27c-.68.7-.69.7-1.36,0S19.58.94,20.44.2c.12-.11.2-.15.34,0l1.08,1.09A.61.61,0,0,1,22,1.43Z"
                              />
                              <path
                                class="cx__icon-cls-2"
                                d="M18.08,7.36l-.38.35L14.94,10.5a.69.69,0,0,1-.52.26c-.92,0-1.84,0-2.76,0-.27,0-.35-.08-.35-.34,0-.88,0-1.75,0-2.63a.81.81,0,0,1,.27-.69C12.71,6,13.83,4.81,15,3.69c.32-.31.22-.4-.11-.54a5.7,5.7,0,0,0-2.36-.51c-2.25,0-4.5-.06-6.74,0A5.71,5.71,0,0,0,.53,6.05c-.25.49-.3,1-.53,1.52V20.13a2.5,2.5,0,0,0,.24-.22q2.35-2.62,4.7-5.28a.84.84,0,0,1,.71-.32c2.3,0,4.59,0,6.88,0A5.85,5.85,0,0,0,18.24,9.4,3.5,3.5,0,0,0,18.08,7.36ZM7.59,10.29c0,.2,0,.28-.26.28a19.42,19.42,0,0,1-2.29,0c-.59-.07-.14-.63-.25-.95,0-.17-.11-.46.27-.43s.78,0,1.17,0h.33C7.68,9.16,7.67,9.16,7.59,10.29ZM8,7.75H5.12c-.25,0-.34-.06-.35-.33,0-1.08,0-1.08,1.05-1.08H6.9c.57,0,1.15,0,1.73,0,.27,0,.37,0,.37.36C9,7.75,9,7.75,8,7.75Z"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </v-list-item-icon>

                    <v-list-item-content v-if="item.icon !== null">
                      <v-list-item-title v-text="item.text" />
                    </v-list-item-content>

                    <v-list-item-content v-else class="ml-6">
                      <v-list-item-title v-text="item.text" />
                    </v-list-item-content>
                  </v-list-item>
                  <!-- <v-list-item>
                    <v-list-item-icon class="seemore-icon mr-4 my-2">
                      <v-icon size="28"> {{ mdiChevronDown }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content
                      class="font-14 font-weight-regular text--text"
                      >See more</v-list-item-content
                    >
                  </v-list-item> -->
                </v-list-item-group>
              </v-list>
            </v-card>
            <ad-card v-if="breakpoint.mdAndUp" :footer="true" class="sticky-top">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader
            v-if="loading_post"
            type="list-item-avatar-two-line,card"
            elevation="2"
          />
          <v-fade-transition v-else group>
            <div v-for="(post, i) in posts" :key="'profile_post' + post.id">
              <template v-if="type === 'map_journey'">
                <v-card-text :key="i">
                  <n-link
                    :to="`/cx-brainstorm/${post.group.slug}/maps/${post.slug}`"
                  >
                    <v-img
                      :src="post.image"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      aspect-ratio="3"
                    >
                      <template #placeholder>
                        <v-skeleton-loader type="image" />
                      </template>
                      <v-card-title>
                        {{ post.title }}
                      </v-card-title>
                    </v-img>
                  </n-link>
                  <v-card-actions>
                    <share-buttons
                      :url="`${$config.appURL}/posts/${post.slug}`"
                      :title="post.title"
                      :excerpt="post.title"
                    />
                  </v-card-actions>
                </v-card-text>
              </template>
              <template v-else>
                <FeedPostCard
                  :post="post"
                  :index="i"
                  @delete-reaction="deleteReaction"
                  @update-reaction="updateReaction"
                  @comments-count-updated="commentsCountUpdated"
                  @toggle-comment-box="toggleCommentBox(post, i)"
                  @post-delete="showConfirmDelete"
                />
              </template>
            </div>
          </v-fade-transition>
        </v-col>
      </v-row>
      <ad-card v-if="breakpoint.smAndDown" :footer="true" class="sticky-top">
        <adsbygoogle ad-slot="6757125591" ad-format="auto" />
      </ad-card>
    </v-container>
    <Confirm ref="confirm" />
    <ConnectionNotePopUp
      ref="connectNote"
      @emitGetConnectionNote="getConnectionNote($event)"
    />
  </div>
</template>

<script>
import {
  mdiAccountArrowLeft,
  mdiAccountArrowRight,
  mdiBookOpenVariant,
  mdiAccountQuestion,
  mdiHeadLightbulb,
  mdiShareVariant,
  mdiThumbUpOutline,
  mdiCommentTextOutline,
  mdiAccountEdit,
  mdiDelete,
  mdiDotsVertical,
  mdiPencil,
  mdiCircleMedium,
  mdiChevronDown,
  mdiMap,
} from '@mdi/js';

export default {
  name: 'MyProfile',

  async asyncData({ app, params, store, redirect, from }) {
    try {
      const { data } = await app.$axios.$get(`api/get-user/${params.username}`);
      return {
        user: data,
      };
    } catch (e) {
      if (e.response.status === 404) {
        store.commit('APP_NETWORK_ERROR', 'The Query result not found');
        return redirect(from.path);
      }
    }
  },
  data: () => ({
    isHydrated: false,
    menu: 0,
    menus: [
      {
        text: 'Posts',
        icon: mdiBookOpenVariant,
      },
      {
        text: 'Discussions',
        icon: null,
      },
      {
        text: 'Questions',
        icon: mdiAccountQuestion,
      },
      {
        text: 'Ideas',
        icon: mdiHeadLightbulb,
      },
      {
        text: 'Map Journeys',
        icon: mdiMap,
      },
    ],
    journeyMenus: [],
    url: 'posts',
    posts: [],
    type: '',
    loading_post: false,
    current_page: 1,
    last_page: 0,
    load_more: false,
    connecting: false,
    ignoring: false,
    connectNote: '',
    mdiAccountArrowLeft,
    mdiAccountArrowRight,
    mdiShareVariant,
    mdiThumbUpOutline,
    mdiCommentTextOutline,
    mdiAccountEdit,
    mdiDelete,
    mdiPencil,
    mdiDotsVertical,
    mdiCircleMedium,
    mdiChevronDown,
    widowHeight: 0,
  }),
  head() {
    return {
      title: 'Profile',
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
    username() {
      return this.$route.params.username;
    },
    menusHeightAuto() {
      return this.menus.length * 56 + 48 + 8;
    },
    journeyMenusHeight() {
      return this.journeyMenus.length * 56;
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { smAndUp: true, xsOnly: false };
    },
    getTotalMenusAutoHeight() {
      return this.menusHeightAuto + this.journeyMenusHeight > this.widowHeight
        ? this.widowHeight + 'px'
        : this.menusHeightAuto + this.journeyMenusHeight + 'px';
    },
  },

  watch: {
    menu(val) {
      switch (val) {
        case 0:
          this.type = '';
          break;
        case 1:
          this.type = 'discussion';
          break;
        case 2:
          this.type = 'question';
          break;
        case 3:
          this.type = 'idea';
          break;
        case 4:
          this.current_page = 1;
          this.type = 'map_journey';
          break;
        default:
          this.url = 'posts';
          this.type = '';
      }
      if (val) {
        if (this.type === 'open_journey') {
          this.getUserOpenJourneys();
        } else if (this.type === 'map_journey') {
          this.getUserMapJourneys();
        } else {
          this.url = 'posts';
          this.getUserPosts(this.type);
        }
      } else {
        this.url = 'posts';
        this.getUserPosts(this.type);
      }
    },
  },

  async mounted() {
    this.isHydrated = true;
    this.widowHeight = (window.innerHeight * 500) / 576;

    await this.getUserPosts();
    // auto scroll pagination
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    updateUserProfile(userData) {
      this.user.image = userData.image;
      this.user.cover_image = userData.cover_image;
      this.posts.map((item) => {
        item.user.image = userData.image;
        item.user.cover_image = userData.cover_image;
        item.user = userData;
        return item;
      });
    },
    // get edit page url
    getEditUrl(post) {
      switch (post.type) {
        case 'public':
          return `/feed/${post.slug}`;
        case 'private':
          return `/feed/${post.slug}`;
        default:
          return `/posts/${post.slug}/edit`;
      }
    },
    // handle scroll pagination
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.current_page < this.last_page) {
          if (!this.load_more) {
            this.current_page++;
            this.loadMore(this.type);
          }
        }
      }
    },
    // get user posts
    async getUserPosts(type) {
      this.loading_post = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/user/posts/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 6,
              type,
            },
          }
        );
        this.loading_post = false;
        data.forEach((item) => (item.seeMore = false));
        this.posts = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },
    // get user open journey
    async getUserOpenJourneys() {
      this.loading_post = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/openjourney/maps/user/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 6,
            },
          }
        );
        this.loading_post = false;
        this.posts = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },
    // get user map journey
    async getUserMapJourneys() {
      this.loading_post = true;
      try {
        const { data, meta } = await this.$axios.$get(
          `api/brainstorm/maps/user/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 6,
            },
          }
        );
        this.loading_post = false;
        this.posts = data;
        this.last_page = meta.last_page;
      } catch (e) {}
    },
    // load more
    async loadMore(type) {
      this.load_more = true;
      try {
        const { data } = await this.$axios.$get(
          `api/user/posts/${this.username}`,
          {
            params: {
              page: this.current_page,
              limit: 6,
              type,
            },
          }
        );
        this.load_more = false;
        data.forEach((item) => this.posts.push(item));
      } catch (e) {}
    },
    // delete message
    showConfirmDelete(postId) {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deletePost(postId);
          }
          return false;
        });
    },
    // delete post
    async deletePost(postId) {
      try {
        await this.$axios.$delete(`api/feed/post/${postId}`);
        await this.getUserPosts();
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Post successfully deleted'
        );
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
    // toggle comment box
    toggleCommentBox(post, index) {
      post.showComment = !post.showComment;
      this.$set(this.posts, index, post);
    },
    // update comments count
    commentsCountUpdated({ postId, postIndex, count }) {
      // find post
      const post = this.posts.find((_) => _.id === postId);
      if (post) {
        post.comments_count = post.comments_count + count;

        this.$set(this.posts, postIndex, post);
      }
    },
    updateReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.like.splice(index, 1, {
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      } else {
        post.likes++;
        post.like.push({
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      }

      this.$set(this.posts, i, post);
    },
    deleteReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }

      this.$set(this.posts, i, post);
    },
    // select user to open chatbox
    selectUser(user) {
      if (this.$vuetify && this.$vuetify.breakpoint.mobile) {
        // load mobile chat
        this.$store.commit('chat/USER_SELECTED_IN_MOBILE', user);
        this.$router.push('/messaging');
      } else {
        this.$store.commit('chat/USER_SELECTED', user);
      }
    },
    // update connection, connect or ignore
    async updateConnection(user, action) {
      action === 'connect' ? (this.connecting = true) : (this.ignoring = true);
      try {
        await this.$axios.$post(`api/connection/${user.id}/${action}`);
        action === 'connect'
          ? (this.connecting = false)
          : (this.ignoring = false);
        let notifyMessage = '';

        if (action === 'connect') {
          this.$set(this.user, 'connection', 'connected');

          const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
          updateUser.connectedUsers = updateUser.connectedUsers.push(user.id);
          this.$auth.setUser(updateUser);

          notifyMessage = 'Connect successfully accepted';
        } else {
          this.$set(this.user, 'connection', 'notConnected');
          notifyMessage = 'Connect successfully ignored';
        }
        this.$store.commit('CRUD_SUCCESS_NO_ACTION', notifyMessage);
      } catch (e) {
        action === 'connect'
          ? (this.connecting = false)
          : (this.ignoring = false);
      }
    },
    // cancel confirm
    cancelConfirm(user) {
      this.$refs.confirm
        .open('Cancel Request !', `Are you sure?`, {
          color: 'red',
        })
        .then((res) => {
          if (res) {
            this.removeConnection(user);
          }
          return false;
        });
    },
    // remove connection
    async removeConnection(user) {
      this.connecting = true;
      try {
        await this.$axios.$delete(`api/connection/${user.id}`);
        this.connecting = false;
        this.user.connection = 'notConnected';

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
    postSeeMore(postIndex) {
      this.posts[postIndex].seeMore = !this.posts[postIndex].seeMore;
    },
    showConnectNote(user) {
      this.$refs.connectNote.open().then((res) => {
        if (res) {
          this.connect(user, this.connectNote);
        } else {
          this.connect(user);
        }
        return false;
      });
    },
    // send connect request
    async connect(user, connectNote = '') {
      this.connecting = true;
      try {
        await this.$axios.$post(`api/connection/request/${user.id}`, {
          connectNote,
        });
        this.connecting = false;
        this.connectNote = '';
        this.$set(this.user, 'connection', 'pending');
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Connection request successfully sent'
        );
      } catch (e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          'You have already sent connection request to this user'
        );
      }
    },
    getConnectionNote(notes) {
      this.connectNote = notes;
    },
  },
};
</script>
