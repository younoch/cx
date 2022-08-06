<template>
  <div>
    <!-- showing pin map -->
    <template v-if="pinnedMap">
      <v-skeleton-loader
        v-if="pinnedMapLoading"
        type="list-item-avatar,card"
        class="mb-4"
        elevation="1"
      />
      <v-card v-else outlined class="overflow-hidden rounded-lg mb-2">
        <!-- pin badge -->
        <span class="pin__badge">
          <v-icon size="20" color="primary">{{ mdiPinOutline }}</v-icon>
        </span>
        <v-list-item
          class="pl-3 pr-2 py-2"
          :style="getMapColor(pinnedMap.color)"
        >
          <v-list-item-avatar color="grey" size="42" class="my-0">
            <v-img :src="pinnedMap && pinnedMap.user && pinnedMap.user.image? pinnedMap.user.image : $store.state.defaultProfileImage" />
          </v-list-item-avatar>
          <v-list-item-content class="pt-1 pb-1">
            <v-list-item-title class="subtitle-1 mb-0 font-weight-regular">
              <n-link
                :to="`/${pinnedMap.user.username}`"
                class="heading--text font-weight-medium"
              >
                {{ pinnedMap.user.name }}
              </n-link>
            </v-list-item-title>
            <v-list-item-subtitle class="caption">
              @{{ pinnedMap.user.username }}
              <p class="pt-0 mb-0">
                <small>
                  {{ pinnedMap.datetime | datetime }}
                </small>
              </p>
            </v-list-item-subtitle>
          </v-list-item-content>

          <!-- map actions -->
          <v-list-item-icon v-if="user.role !== 'subscriber'">
            <v-menu
              transition="slide-x-transition"
              offset-y
              left
              :max-width="170"
              :allow-overflow="true"
            >
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ mdiDotsVertical }}
                </v-icon>
              </template>
              <v-list class="pa-0">
                <v-list-item ripple @click.stop="unpinMap(pinnedMap.id)">
                  <v-list-item-action class="mr-3">
                    <v-icon size="20">
                      {{ mdiPinOutline }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="font-14">
                      Unpin
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-icon>
        </v-list-item>

        <nuxt-link
          :to="`/cx-brainstorm/${subgroup.slug}/maps/${pinnedMap.slug}`"
        >
          <v-img
            :src="pinnedMap.image"
            class="white--text align-end v-card--link"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            :aspect-ratio="3"
          >
            <template #placeholder>
              <v-skeleton-loader type="image" />
            </template>
            <v-card-title class="word-break-normal line-height-1-4 mb-1">
              {{ pinnedMap.title }}
            </v-card-title>
          </v-img>
        </nuxt-link>
      </v-card>
    </template>

    <!-- show posts -->
    <v-skeleton-loader
      v-if="loading"
      type="list-item-avatar,card"
      elevation="1"
    />
    <v-fade-transition v-else group>
      <div v-for="(post, i) in posts" :key="'cx_post_' + post.id">
        <FeedPostCard
          class="width-full"
          :post="post"
          :index="i"
          :show-another-page="false"
          @delete-reaction="deleteReaction"
          @update-reaction="updateReaction"
          @comments-count-updated="commentsCountUpdated"
          @toggle-comment-box="toggleCommentBox"
          @post-delete="showConfirmDelete"
          @post-details-show="postDetailsShowEvent"
        />
      </div>
    </v-fade-transition>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import {
  mdiPinOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiDotsVertical,
} from '@mdi/js';
export default {
  name: 'BrainstormPost',
  props: {
    subgroup: {
      type: Object,
      default: null,
    },
    sharedGroups: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: null,
    },
    sort: {
      type: String,
      default: 'latest',
    },
    type: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isHydrated: false,
      loading: false,
      page: 1,
      lastPage: null,
      posts: [],
      pinnedMap: null,
      pinnedMapLoading: true,
      mdiPinOutline,
      mdiPencilOutline,
      mdiTrashCanOutline,
      mdiDotsVertical,
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { mdAndUp: true, sm: true, xs: false };
    },
  },
  watch: {
    async subgroup(val) {
      if (val) {
        await this.getPinnedMap();
      }
    },
    async sort() {
      this.page = 1;
      await this.getPosts();
    },
    async type() {
      this.page = 1;
      await this.getPosts();
    },
    sharedGroups(val) {
      this.page = 1;
      this.getPosts();
    },
  },
  async mounted() {
    this.isHydrated = true;
    await this.getPosts();
    if (this.subgroup) {
      await this.getPinnedMap();
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    getMapColor(color) {
      return color && color.toLowerCase() !== '#ffffff'
        ? { backgroundColor: color }
        : '';
    },
    async getPinnedMap() {
      try {
        const { data } = await this.$axios.$get('api/brainstorm/map/pinned', {
          params: {
            group_id: this.subgroup.id,
          },
        });

        this.pinnedMapLoading = false;
        this.pinnedMap = data;
      } catch (error) {}
    },
    async unpinMap(mapId) {
      try {
        await this.$axios.$get(`api/brainstorm/map/pin/${mapId}`);
        this.pinnedMap = null;
        this.pinnedMapLoading = false;
      } catch (e) {}
    },
    // handle scroll pagination
    handleScroll() {
      const bottom = document.documentElement.getBoundingClientRect().bottom;
      const height = document.documentElement.clientHeight;

      if (bottom < height + 200) {
        // let's add more data
        if (this.page < this.lastPage) {
          if (!this.load_more) {
            this.page++;
            this.loadMore();
          }
        }
      }
    },
    // load more
    async loadMore() {
      try {
        const { data } = await this.$axios.$get('api/get-posts', {
          params: {
            page: this.page,
            limit: 3,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
            sharedGroups: this.sharedGroups,
            sort: this.sort,
            type: this.type,
          },
        });
        data.forEach((item) => this.posts.push(item));
      } catch (e) {}
    },

    // get posts
    async getPosts() {
      this.loading = true;
      try {
        const { data, meta } = await this.$axios.$get('api/get-posts', {
          params: {
            page: this.page,
            group: this.$route.params.group,
            subgroup: this.$route.params.slug,
            sharedGroups: this.sharedGroups,
            sort: this.sort,
            type: this.type,
          },
        });
        this.loading = false;
        this.posts = data;
        this.lastPage = meta.last_page;
      } catch (e) {
        this.loading = false;
      }
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

    async deletePost(postId) {
      try {
        await this.$axios.$delete(`api/user/post/delete/${postId}`);
        this.posts = this.posts.filter((item) => {
          return Number(postId) !== Number(item.id);
        });
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
    toggleCommentBox(event) {
      const { showComment, index } = event;
      const post = this.posts[index];
      post.showComment = showComment;
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
    // update post reaction
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

    postDetailsShowEvent(url) {
      this.$router.push(
        `/cx-brainstorm/${this.$route.params.group}/${this.$route.params.slug}/post/${url}`
      );
    },
  },
};
</script>
