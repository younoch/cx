<template>
  <div id="post">
    <v-container class="py-0">
      <v-row>
        <v-col cols="12" md="9" class="pb-0">
          <page-breadcrumb :paths="breadcrumbs" />
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="post" class="pt-0">
      <v-row>
        <v-col cols="12" md="9">
          <v-card flat outlined rounded="lg">
            <v-card-title class="flex-column pt-4 pb-0 align-start">
              <h1 class="text-h4 cx-title">
                {{ post.title }}
              </h1>
            </v-card-title>

            <!-- post user info -->
            <v-list-item class="pb-1">
              <v-list-item-avatar class="mr-4" color="grey" size="40">
                <v-img :src="post && post.user && post.user.image? post.user.image : $store.state.defaultProfileImage" :alt="post.user.name" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-16 font-weight-bold">
                  <n-link :to="`/${post.user.username}`" class="heading--text">
                    {{ post.user.name }}
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
              <!-- Showing images -->
              <v-carousel
                v-if="carousel"
                hide-delimiters
                :show-arrows="false"
                class="post-features h-100 w-100"
              >
                <div
                  class="absolute"
                  style="right: 10px; top: 10px; z-index: 100"
                >
                  <v-btn
                    icon
                    dark
                    :ripple="false"
                    class="ma-0 remove transparent"
                    style="curson: pointer"
                    @click.stop="carousel = false"
                  >
                    <v-icon>{{ mdiArrowRight }}</v-icon>
                  </v-btn>
                </div>
                <v-carousel-item :src="post.image"> </v-carousel-item>
              </v-carousel>
              <template v-else>
                <v-img
                  v-if="post.image"
                  :src="post.image"
                  :aspect-ratio="16 / 9"
                  @click="carousel = true"
                >
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                </v-img>
              </template>
            </v-card>

            <v-divider />

            <v-card-text
              class="content tinnymc__content"
              v-html="post.content"
            />

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
            <v-card-text
              v-if="post.likes || post.comments_count"
              class="py-1 px-0"
            >
              <template v-if="post.likes || post.comments_count">
                <post-reacted-icons class="px-3" :post="post" />
              </template>
            </v-card-text>
            <v-divider></v-divider>
            <!-- raction and comment -->
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
                class="white-background pb-1"
                :post-id="post.id"
                :post-index="0"
                :post-user-id="post.user.id"
                @comments-count-updated="commentsCountUpdated"
              />
            </template>
          </v-card>
        </v-col>

        <!-- right sidebar -->
        <v-col v-if="!breakpoint.xs && !breakpoint.sm" cols="12" md="3">
          <v-card v-if="user" outlined class="rounded-lg overflow-hidden">
            <div class="avatar">
              <v-img height="102" :src="user.cover_image" />
              <v-avatar class="profile" color="grey" size="120">
                <v-img :src="user && user.image? user.image : $store.state.defaultProfileImage" />
              </v-avatar>
            </div>
            <div class="avatar-spacer" />
            <nuxt-link :to="`/${user.username}`">
              <v-card-title class="justify-center pb-0">
                {{ user.name }}
              </v-card-title>
            </nuxt-link>
            <p class="text-center h5 mb-0">
              {{ user.tagline }}
            </p>
            <v-card-subtitle class="text-center pt-1">
              <strong>Joined: </strong> {{ user.created_at | datetime }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {
  mdiArrowRight,
  mdiCommentTextOutline,
  mdiNearMe,
  mdiThumbUpOutline,
} from '@mdi/js';
import CommentList from '~/components/comment/List.vue';

export default {
  name: 'PublicPost',

  auth: false,

  components: { CommentList },

  async asyncData({ app, params, redirect }) {
    try {
      const data = await app.$axios.$get(`api/get-post/${params.slug}`);
      return {
        post: data,
        user: data.user,
        group: data.group,
      };
    } catch (e) {
      redirect('/');
    }
  },
  data() {
    return {
      isHydrated: false,
      carousel: false,
      mdiArrowRight,
      mdiCommentTextOutline,
      mdiNearMe,
      mdiThumbUpOutline,
    };
  },

  head() {
    const image =
      this.post.image ||
      (this.post.data.images[0] && this.post.data.images[0].data);
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
          content: image,
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
          content: image,
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
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { xs: false, sm: false };
    },
  },
  mounted() {
    this.isHydrated = true;
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
