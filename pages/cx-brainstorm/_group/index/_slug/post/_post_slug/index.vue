<template>
  <div id="post">
    <v-container v-if="post" class="pt-0 px-0">
      <v-row>
        <v-col cols="12" md="12">
          <v-card outlined>
            <v-card-title class="text-h6 cx-title line-height-26 pt-3 pb-2">
              {{ post.title }}
            </v-card-title>
            <!-- post user info -->
            <v-list-item class="pb-3">
              <v-list-item-avatar class="mr-4 my-0" color="grey" size="40">
                <v-img :src="user && user.image ? user.image : $store.state.defaultProfileImage"/>
              </v-list-item-avatar>
              <v-list-item-content class="py-1">
                <v-list-item-title class="font-16 font-weight-bold">
                  <n-link :to="`/${user.username}`" class="heading--text">
                    {{ user.name }}
                  </n-link>
                </v-list-item-title>
                <v-list-item-subtitle
                  color="text--text"
                  class="font-14 font-weight-regular"
                >
                  {{ post.created_at | datetime }} ago
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card flat class="rounded-0">
              <v-img :src="post.image" class="flex-grow-1">
                <template #placeholder>
                  <v-skeleton-loader type="image" />
                </template> </v-img
            ></v-card>

            <v-divider />
            <v-card-text
              class="content tinnymc__content"
              v-html="post.content"
            />

            <!-- cover photo was here before -->

            <template v-if="post.type === 'public' || post.type === 'private'">
              <v-spacer />
              <template v-if="post.data.images.length">
                <PostFeatures
                  id="postFeatures"
                  :post-features="post.data.images"
                  :post-editable="false"
                  :user-info="post"
                />
              </template>
              <template v-if="post.data.documents.length">
                <PostFeatures
                  id="postFeatures"
                  :post-features="post.data.documents"
                  :post-editable="false"
                  :user-info="post"
                />
              </template>
              <template v-if="post.data.videos.length">
                <PostFeatures
                  id="postFeatures"
                  :post-features="post.data.videos"
                  :post-editable="false"
                  :user-info="post"
                />
              </template>
            </template>
            <!-- <comment-list class="" :post-id="post.id" :post-index="0" /> -->
            <!-- showing reaction count -->
            <template v-if="post.likes || post.comments_count">
              <post-reacted-icons class="px-3" :post="post" />
            </template>
            <v-divider></v-divider>
            <!-- comment & reaction -->
            <template v-if="loggedIn">
              <v-card-actions class="py-1 justify-space-between">
                <!-- Reactions actions -->
                <Reaction
                  :post-id="post.id"
                  :like="post.like"
                  :like-icon="mdiThumbUpOutline"
                  @update="updateReaction($event)"
                  @delete="deleteReaction($event)"
                />
              </v-card-actions>
              <comment-list
                :post-id="post.id"
                :post-index="0"
                @comments-count-updated="commentsCountUpdated"
              />
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mdiThumbUpOutline } from '@mdi/js';
import CommentList from '~/components/comment/List.vue';

export default {
  name: 'BrainstormPost',

  components: { CommentList },

  async asyncData({ app, params, redirect }) {
    try {
      const data = await app.$axios.$get(`api/get-post/${params.post_slug}`);
      return {
        post: data,
        user: data.user,
        group: data.group,
      };
    } catch (e) {
      redirect('/cx-brainstorm');
    }
  },
  data() {
    return {
      mdiThumbUpOutline,
    };
  },
  head() {
    return {
      title: this.post.title,
      meta: [
        // facebook meta tags
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.post.excerpt,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${
            this.post.meta_image
              ? this.post.meta_image
              : this.post.feature_image
          }`,
        },
        {
          hid: 'og:image.alt',
          property: 'og:image.alt',
          content: this.post.title,
        },
        // twitter meta tags
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.post.title,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `${this.post.feature_image}`,
        },
        {
          hid: 'twitter:image.alt',
          name: 'twitter:image.alt',
          content: this.post.title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.post.excerpt,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.appURL}/posts/${this.post.slug}`,
        },
      ],
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    breadcrumbs() {
      const data = [];
      if (this.group) {
        if (this.group.type === 'subgroup') {
          data.push({
            text: this.group.title,
            to: `/cx-brainstorm/${this.group.slug}`,
            disabled: false,
            icon: false,
            exact: true,
          });
        } else {
          data.push({
            text: this.group.title,
            to: `/topics/${this.group.slug}`,
            disabled: false,
            icon: false,
            exact: true,
          });
        }
      }
      if (this.post) {
        data.push({
          text: this.post.title,
          to: `/`,
          disabled: true,
          icon: false,
          exact: true,
        });
      }
      return data;
    },
    getUrl() {
      if (this.group) {
        if (this.group.type === 'subgroup') {
          return `/cx-brainstorm/${this.group.slug}`;
        } else {
          return `/topics/${this.group.slug}`;
        }
      }
      return '/';
    },
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    updateReaction($event) {
      const index = this.post.like.findIndex(
        (_) => _.user_id === $event.user_id
      );
      if (index > -1) {
        this.post.like.splice(index, 1, {
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      } else {
        this.post.likes++;
        this.post.like.push({
          post_id: $event.postId,
          reaction: $event.reaction,
          user_id: $event.user_id,
        });
      }
    },
    deleteReaction($event) {
      const index = this.post.like.findIndex(
        (_) => _.user_id === $event.user_id
      );
      if (index > -1) {
        this.post.likes--;
        this.post.like.splice(index, 1);
      }
    },
    commentsCountUpdated($event) {
      if ($event.postId === this.post.id) {
        this.post.comments_count = this.post.comments_count + $event.count;
      }
    },
  },
};
</script>
