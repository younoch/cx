<template>
  <div id="profile">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="3" class="d-none d-sm-inline-block">
          <div class="w-full sticky-top">
            <ad-card :footer="false" class="mt-2">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
            <!-- START JOURNEY PAGES USER FOLLOW -->
            <!-- <v-card
              class="my-2 overflow-auto rounded-lg custom-scrollbar"
              :style="{ height: jourenyPageHeightAuto }"
              outlined
            >
            </v-card> -->
            <!-- END JOURNEY PAGES USER FOLLOW -->
          </div>
        </v-col>

        <!-- create post section -->
        <v-col cols="12" md="6">
          <v-card class="mx-auto mt-2 rounded-lg" outlined flat>
            <div class="theme--dark">
              <v-subheader>
                <h2 class="font-weight-black">People</h2>
              </v-subheader>
            </div>

            <div v-if="members.length > 0">
              <v-list v-for="(member, idx) in members" :key="idx">
                <v-list-item three-line dense class="cursor-pointer">
                  <v-list-item-content
                    class="mt-n4"
                    @click="$router.push(`/${member.username}`)"
                  >
                    <div class="d-flex" style="height: 30px">
                      <v-list-item-avatar
                        style="margin: 5px"
                        min-width="40"
                        min-height="40"
                        color="grey"
                      >
                        <v-img
                          class="elevation-6 pt-n4"
                          :alt="member.name + 's image'"
                          :src="member.image"
                        ></v-img
                      ></v-list-item-avatar>
                      <v-list-item-title class="subtitle-1 pl-2">
                        {{ member.name }}
                      </v-list-item-title>
                    </div>

                    <v-list-item-subtitle class="ml-15 mt-n8 font-weight-light">
                      {{ subStrText(member.tagline, 70) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-card-actions class="mt-n4">
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
              <NuxtLink
                v-if="members.length >= 3"
                :to="`/search/users?users=${$route.query.query}`"
                ><h2 class="subtitle-1 text-center pb-2 font-weight-bold">
                  See all people results
                </h2></NuxtLink
              >
            </div>
            <div v-else>
              <h2 class="ml-6 pt-3 text-center h5 font-weight-light pb-4">
                No user results found
              </h2>
            </div>
          </v-card>

          <div class="mx-auto rounded-lg mt-2 mb-2">
            <div class="popupBackground">
              <v-subheader>
                <h2 class="font-weight-black">Posts</h2>
              </v-subheader>
            </div>
            <template v-if="loading_post">
              <v-skeleton-loader
                type="list-item-avatar-two-line, actions"
                class="rounded-0 mb-4"
              />
              <v-skeleton-loader
                type="list-item-avatar-two-line,card"
                class="rounded-0"
              />
            </template>

            <div v-if="posts.length > 0">
              <div
                v-for="(post, i) in posts"
                :key="'feed_post_' + post.id"
                class="mb-1"
              >
                <FeedPostCard
                  :post="post"
                  :index="i"
                  @delete-reaction="deleteReaction"
                  @update-reaction="updateReaction"
                  @comments-count-updated="commentsCountUpdated"
                  @toggle-comment-box="toggleCommentBox(post, i)"
                  @post-delete="showConfirmDelete"
                />
              </div>
              <v-card flat class="mt-n4">
                <v-divider class="mt-2"></v-divider>
                <NuxtLink
                  v-if="posts.length >= 3"
                  :to="`/search/posts?posts=${$route.query.query}`"
                  ><h2
                    class="subtitle-1 pt-2 text-center font-weight-bold pb-2"
                  >
                    See all post results
                  </h2></NuxtLink
                >
              </v-card>
            </div>
            <div v-else>
              <v-card flat>
                <h2 class="ml-6 pt-3 text-center h5 font-weight-light pb-4">
                  No post results found
                </h2>
              </v-card>
            </div>
          </div>

          <!-- sub groups section -->
          <v-card class="mx-auto mt-2 rounded-lg" outlined flat>
            <div class="theme--dark">
              <v-subheader>
                <h2 class="font-weight-black">Sub Groups</h2>
              </v-subheader>
            </div>

            <div v-if="groups.length > 0">
              <v-list
                v-for="(group, idx) in groups"
                :key="idx"
                class="cursor-pointer"
              >
                <v-list-item dense>
                  <v-list-item-content>
                    <div class="d-flex align-center">
                      <v-img
                        max-height="50"
                        max-width="50"
                        class="elevation-5 pt-4"
                        :src="group.image"
                      ></v-img>

                      <v-list-item-title
                        v-if="$vuetify.breakpoint.width > 400"
                        class="font-weight-light ml-4 subtitle-2"
                        @click="$router.push(group.slug)"
                      >
                        {{ group.title }}
                      </v-list-item-title>

                      <v-list-item-title
                        v-else
                        class="font-weight-light ml-4"
                        @click="$router.push(group.slug)"
                      >
                        {{ subStrText(group.title, 15) }}
                      </v-list-item-title>

                      <v-card-actions>
                        <template v-if="group.isFollowing">
                          <v-btn
                            height="32"
                            class="rounded-pill text-capitalize font-12"
                            color="#2CBEE3"
                            outlined
                            depressed
                            :loading="
                              groupFollowing.following &&
                              group.id === groupFollowing.groupID
                            "
                            @click="followTaxonomy(group)"
                          >
                            Following
                          </v-btn>
                        </template>
                        <template v-else>
                          <v-btn
                            height="32"
                            class="rounded-pill text-capitalize font-12"
                            outlined
                            color="#2CBEE3"
                            elevation="0"
                            :loading="
                              groupFollowing.following &&
                              group.id === groupFollowing.groupID
                            "
                            @click="followTaxonomy(group)"
                          >
                            Follow
                          </v-btn>
                        </template>
                      </v-card-actions>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-list>
              <NuxtLink
                v-if="groups.length >= 3"
                :to="`/search/groups?groups=${$route.query.query}`"
                ><h2 class="subtitle-1 text-center font-weight-bold pb-2">
                  See all sub group results
                </h2></NuxtLink
              >
            </div>
            <div v-else>
              <h2 class="ml-6 pt-3 text-center h5 font-weight-light pb-4">
                No sub groups found
              </h2>
            </div>
          </v-card>

          <v-card class="mx-auto mt-2 rounded-lg" outlined flat>
            <div class="theme--dark">
              <v-subheader>
                <h2 class="font-weight-black">Maps</h2>
              </v-subheader>
            </div>

            <div v-if="maps.length > 0">
              <v-list
                v-for="(map, idx) in maps"
                :key="idx"
                class="cursor-pointer"
              >
                <v-list-item three-line class="mt-n5">
                  <v-list-item-content
                    @click="
                      $router.push(
                        `/cx-brainstorm/${map.group.slug}/maps/${map.slug}`
                      )
                    "
                  >
                    <div class="d-flex align-center" style="height: 40px">
                      <v-img
                        max-height="50"
                        max-width="50"
                        class="elevation-2 mt-7"
                        :src="map.image"
                      ></v-img>

                      <v-list-item-title
                        class="font-weight-light subtitle-1 ml-4 mt-1"
                      >
                        {{ map.user.name }}
                      </v-list-item-title>
                    </div>
                    <v-list-item-subtitle
                      class="ml-14 pl-3 font-weight-black caption mt-n2"
                    >
                      {{ subStrText(map.title, 50) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="ml-15 pl-2 caption">
                      {{ subStrText(map.description, 90) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-card-actions class="-mt-15">
                    <template v-if="map.isFollowing">
                      <v-btn
                        height="32"
                        class="rounded-pill text-capitalize font-12"
                        color="#2CBEE3"
                        outlined
                        depressed
                        :loading="
                          mapFollowing.following &&
                          map.id === mapFollowing.mapID
                        "
                        @click="followMap(map)"
                      >
                        Following
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn
                        height="32"
                        class="rounded-pill text-capitalize font-12"
                        outlined
                        color="#2CBEE3"
                        elevation="0"
                        :loading="
                          mapFollowing.following &&
                          map.id === mapFollowing.mapID
                        "
                        @click="followMap(map)"
                      >
                        Follow
                      </v-btn>
                    </template>
                  </v-card-actions>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-list>
              <NuxtLink
                v-if="maps.length >= 3"
                :to="`/search/maps?maps=${$route.query.query}`"
                ><h2 class="subtitle-1 text-center font-weight-bold pb-2">
                  See all map results
                </h2></NuxtLink
              >
            </div>
            <div v-else>
              <h2 class="ml-6 pt-3 text-center h5 font-weight-light pb-4">
                No map results found
              </h2>
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
import { mdiPinOutline, mdiPlus } from '@mdi/js';
export default {
  name: 'SearchUser',

  data() {
    return {
      inset: true,
      index: -1,
      current_page: 1,
      loading_post: false,
      connectionNote: '',
      loading: false,
      connecting: false,
      mdiPlus,
      mdiPinOutline,
      posts: [],
      maps: [],
      groups: [],
      members: [],
      taxanomyMembers: [],
      subgroupId: null,
      mapFollowing: {
        following: false,
        following_loading: false,
        mapID: null,
      },
      groupFollowing: {
        following: false,
        following_loading: false,
        groupID: null,
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    // unfollow() {
    //   if (this.loggedIn) {
    //     return this.taxanomyMembers.some((_) => _.id === this.$auth.user.id);
    //   }
    //   return false;
    // },
    searchQuery() {
      return this.$route.query.query;
    },
  },

  watch: {
    searchQuery() {
      this.getMembers();
      this.getPosts();
      this.getMaps();
      this.getSubgroups();
    },
  },

  mounted() {
    this.getMembers();
    this.getPosts();
    this.getMaps();
    this.getSubgroups();
  },

  methods: {
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

    async followTaxonomy(subgroupId) {
      this.groupFollowing.following = true;
      this.groupFollowing.groupID = subgroupId.id;
      try {
        if (this.loggedIn) {
          await this.$axios.$get(`api/follow-taxonomy/${subgroupId.id}`);
          this.groupFollowing.following = false;
          await this.getFollowerTaxonomy(subgroupId.id);
          this.getSubgroups();
        } else {
          this.groupFollowing.following = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.groupFollowing.following = false;
      }
    },
    // get followers of this page
    async getFollowerTaxonomy(subgroupId) {
      this.groupFollowing.following_loading = true;
      try {
        await this.$axios.$get(`api/follower-taxonomy/${subgroupId}`);
        this.groupFollowing.following_loading = false;
        // this.taxanomyMembers = members;
      } catch (e) {
        this.groupFollowing.following_loading = false;
      }
    },

    // search members
    async getMembers() {
      this.loading = true;
      try {
        const { items } = await this.$axios.$get('api/search/members', {
          params: {
            page: 1,
            per_page: 3,
            query: this.searchQuery,
          },
        });
        this.members = items;
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    // search posts
    async getPosts() {
      this.loading_post = true;
      try {
        const { items } = await this.$axios.$get('api/search/posts', {
          params: {
            page: 1,
            per_page: 3,
            query: this.searchQuery,
          },
        });
        this.posts = items;
      } catch (e) {
      } finally {
        this.loading_post = false;
      }
    },

    // search maps
    async getMaps() {
      this.loading_map = true;
      try {
        const { items } = await this.$axios.$get('api/search/maps', {
          params: {
            page: 1,
            per_page: 3,
            query: this.searchQuery,
          },
        });
        this.maps = items;
      } catch (e) {
      } finally {
        this.loading_map = false;
      }
    },

    // search maps
    async getSubgroups() {
      // this.loading_subgroups = true;
      try {
        const { items } = await this.$axios.$get('api/search/groups', {
          params: {
            page: 1,
            per_page: 5,
            query: this.searchQuery,
          },
        });
        this.groups = items;
      } catch (e) {
      } finally {
        this.loading_map = false;
      }
    },

    // follow map
    async followMap(map) {
      this.mapFollowing.following = true;
      this.mapFollowing.mapID = map.id;
      try {
        if (this.loggedIn) {
          const { following } = await this.$axios.$get(
            `api/brainstorm/map/follow/${map.id}`
          );
          this.mapFollowing.following = false;
          this.getMaps();
          this.$store.commit('map/FOLLOW_MAP', following);
        } else {
          this.mapFollowing.following = false;
          this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.mapFollowing.following = false;
      }
    },
    deleteReaction({ post, i, $event }) {
      const index = post.like.findIndex((_) => _.user_id === $event.user_id);
      if (index > -1) {
        post.likes--;
        post.like.splice(index, 1);
      }

      this.$set(this.posts, i, post);
    },
    // toggle comment box
    toggleCommentBox(post, index) {
      post.showComment = !post.showComment;
      this.$set(this.posts, index, post);
    },
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
.not-allowed {
  cursor: not-allowed;
}
</style>
