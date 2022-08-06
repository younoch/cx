<template>
  <div>
    <v-card
      v-if="post"
      :class="$route.name === 'feed' ? 'mb-2' : 'mb-2 rounded-t-0'"
      flat
      :outlined="isOutlined"
    >
      <!-- header -->
      <v-list-item class="pb-3 pt-4 pr-0">
        <v-list-item-avatar color="grey" size="42" class="my-0">
          <v-img
            :src="
              post && post.user.image
                ? post.user.image
                : $store.state.defaultProfileImage
            "
          />
        </v-list-item-avatar>
        <v-list-item-content class="py-0">
          <v-list-item-title class="subtitle-1 font-weight-regular">
            <v-menu :close-on-content-click="false" open-on-hover left offset-x>
              <template #activator="{ on, attrs }">
                <div class="d-inline" v-bind="attrs" v-on="on">
                  <n-link
                    :to="`/${post.user.username}`"
                    class="heading--text font-weight-medium"
                  >
                    {{ subStrText(post.user.name, 30) }}
                  </n-link>
                </div>
              </template>
              <UserCard
                set-width="300"
                :logged-in="loggedIn"
                :user="post.user"
              />
            </v-menu>
          </v-list-item-title>
          <v-list-item-subtitle class="caption">
            @{{ post.user.username }}
            <p class="pt-0 mb-0">
              <small>
                {{ post.datetime | datetime }}
                <v-icon x-small>{{ mdiCircleMedium }}</v-icon>
                <PostPrivacy :type="post.type" />
              </small>
            </p>
          </v-list-item-subtitle>
        </v-list-item-content>
        <!-- right actions -->
        <v-list-item-icon class="my-0">
          <v-menu
            transition="slide-x-transition"
            left
            offset-y
            :nudge-width="140"
            :max-width="300"
            z-index="2"
          >
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-on="on">
                  {{ mdiDotsVertical }}
                </v-icon>
              </v-btn>
            </template>
            <v-card
              class="rounded-lg overflow-hidden"
              flat
              outlined
              elevation="10"
            >
              <v-list dense class="py-0">
                <v-list-item-group color="primary">
                  <v-list-item
                    v-if="loggedIn && post.user.id === user.id"
                    :to="getEditUrl(post)"
                    nuxt
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon size="20">
                        {{ mdiPencilOutline }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="body-2 font-weight-regular">
                        Edit post
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="loggedIn && post.user.id === user.id"
                    @click="showConfirmDelete(post.id)"
                  >
                    <v-list-item-icon class="mr-3">
                      <v-icon size="20">
                        {{ mdiTrashCanOutline }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="body-2 font-weight-regular">
                        Delete post
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon class="mr-3">
                      <v-icon size="20">
                        {{ mdiLinkVariant }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="body-2 font-weight-regular"
                        @click="copyLink(post)"
                      >
                        Copy link to post
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-item-icon>
      </v-list-item>

      <!-- body -->
      <v-card-text class="pa-0">
        <!-- showing feed post -->
        <template v-if="post.type === 'public' || post.type === 'private'">
          <v-card-subtitle class="pt-0 pb-1 font-16 font-weight-bold">
            {{ post.title }}
          </v-card-subtitle>

          <!-- post Contents -->
          <div class="text--text font-weight-normal px-4">
            <p class="mb-1 pt-1">
              {{
                subStrText(
                  post.content,
                  seeMoreContent ? post.content.length : 140
                )
              }}
              <span
                v-if="
                  post.content && post.content.length > 140 && !seeMoreContent
                "
                class="primary--text cursor-pointer"
                @click="seeMoreContent = true"
                >see more</span
              >
            </p>
          </div>
          <template v-if="post.type === 'public' || post.type === 'private'">
            <v-spacer />

            <!-- link preview -->
            <link-preview
              v-if="post.preview === 1 && findUrl(post.content)"
              :url="findUrl(post.content)"
              class="feed__link-preview"
              :view-close-icon="false"
            />

            <!-- showing images -->
            <div class="d-flex justify-center flex-wrap h-100">
              <template v-if="post.data.images.length > 0">
                <div
                  v-for="(feature, imageIndex) in post.data.images.slice(0, 5)"
                  :key="'image_' + feature.id"
                  class="align-center d-flex justify-center"
                  :class="imageIndex < 2 ? 'column-2' : 'column-3'"
                  @click="openPostDialog(imageIndex)"
                >
                  <v-img
                    v-if="feature.type === 'image'"
                    :src="feature.data"
                    class="hover-border"
                    aspect-ratio="1.78"
                  >
                  </v-img>
                  <v-overlay
                    v-if="imageIndex === 4"
                    z-index="0"
                    class="w-100 h-100"
                    style="position: absolute"
                  >
                    <p
                      class="font-30 font-weight-regular letter-spacing-2 mb-0"
                    >
                      {{ `+${post.data.images.length - 4}` }}
                    </p>
                  </v-overlay>
                </div>
              </template>
              <!-- showing videos -->
              <template v-if="post.data.videos.length > 0">
                <div
                  v-for="(feature, videoIndex) in post.data.videos"
                  :key="'video_' + videoIndex"
                  class="align-center d-flex justify-center"
                  :class="videoIndex < 2 ? 'column-2' : 'column-3'"
                >
                  <template v-if="feature.type === 'video'">
                    <client-only>
                      <video-embed
                        class="w-100"
                        :src="feature.data"
                      ></video-embed>
                    </client-only>
                  </template>
                </div>
              </template>
              <!-- showing documents -->
              <template v-if="post.data.documents.length > 0">
                <div
                  v-for="(feature, docIndex) in post.data.documents"
                  :key="'doc_' + docIndex + feature.id"
                  class="align-center d-flex justify-center column-2"
                  @click="openPostDialog(docIndex)"
                >
                  <div v-if="feature.type === 'document'" class="w-100">
                    <v-card-text class="message__file-inner pa-0">
                      <div class="message__file">
                        <div
                          class="message__file-ext"
                          :class="'file-' + getFileExtension(feature.name)"
                        >
                          <span>{{ getFileExtension(feature.name) }}</span>
                        </div>
                        <div class="message__file-name">
                          <span>{{ feature.name }}</span>
                        </div>
                      </div>
                      <!-- download button -->
                      <v-btn
                        type="button"
                        height="100%"
                        class="message__file-download"
                      >
                        <v-icon>{{ mdiEye }}</v-icon>
                        Show
                      </v-btn>
                    </v-card-text>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
        <!-- Showing Discussion post -->
        <template v-else>
          <template v-if="!post.image">
            <v-card-subtitle class="pt-0 pb-1 font-16 font-weight-bold">
              {{ post.title }}
            </v-card-subtitle>

            <v-card-text class="discussion__content pb-0" v-html="post.content">
            </v-card-text>
          </template>
          <v-card v-else flat @click.prevent="gotoDetailPage(post)">
            <v-img
              :src="post.image"
              class="white--text align-end rounded-0"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              aspect-ratio="3"
            >
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
              <v-card-title class="line-height-24" v-html="post.title">
              </v-card-title>
            </v-img>
          </v-card>
        </template>
        <!-- showing reaction & comments count -->
        <template v-if="post.likes || post.comments_count">
          <post-reacted-icons
            class="px-3"
            :index="index"
            :post="post"
            @show-comments="toggleCommentBox"
          />
        </template>
      </v-card-text>

      <v-divider />
      <!-- Reactions, comment, share & send actions -->
      <v-card-actions class="justify-space-between">
        <!-- Reactions actions -->
        <Reaction
          :post-id="post.id"
          :like="post.like"
          :like-icon="mdiThumbUpOutline"
          @update="updateReaction(post, index, $event)"
          @delete="deleteReaction(post, index, $event)"
        />
        <v-btn text @click="toggleCommentBox">
          <v-icon left>
            {{ mdiCommentTextOutline }}
          </v-icon>
          <span class="d-none d-lg-inline">Comment</span>
        </v-btn>
        <share-buttons
          :url="`${$config.appURL}/posts/${post.slug}`"
          :title="post.title"
          :excerpt="post.title"
          :send-btn-visible="inArray(post.user.id, user.connectedUsers)"
        />
        <v-btn
          v-if="inArray(post.user.id, user.connectedUsers)"
          text
          @click="openChatWindow(post.user)"
        >
          <v-icon left>
            {{ mdiChatProcessingOutline }}
          </v-icon>
          <span class="d-none d-lg-inline">Chat</span>
        </v-btn>
      </v-card-actions>
      <!-- Showing Comments list -->
      <transition name="fade">
        <comment-list
          v-if="post.showComment"
          :post-id="post.id"
          :post-user-id="post.user.id"
          :post-index="index"
          @comments-count-updated="commentsCountUpdated"
        />
      </transition>
    </v-card>

    <!-- Feed image type post show dialog -->
    <v-dialog
      v-model="isOpenImage"
      transition="dialog-bottom-transition"
      width="1200"
      max-width="1200"
    >
      <v-card>
        <v-card-text class="pa-0">
          <v-row no-gutters>
            <!-- Images carousel -->
            <v-col cols="12" sm="6" md="7">
              <v-carousel v-model="activeSlide" hide-delimiters>
                <template v-if="post.data.images.length > 0">
                  <v-carousel-item
                    v-for="(carousel, carouselIndex) in post.data.images"
                    :key="carouselIndex"
                    contain
                    :src="carousel.data"
                    height="800"
                  ></v-carousel-item>
                </template>
                <template v-else-if="post.data.documents.length > 0">
                  <v-carousel-item
                    v-for="(feature, docIndex) in post.data.documents"
                    :key="docIndex"
                    contain
                    height="800"
                  >
                    <iframe
                      :src="`https://docs.google.com/viewer?embedded=true&url=${feature.data}`"
                      style="width: 100%; height: 100%"
                      frameborder="0"
                      allowfullscreen
                    >
                    </iframe>
                  </v-carousel-item>
                </template>
              </v-carousel>
            </v-col>
            <!-- Post contents with Reaction & comment -->
            <v-col cols="12" sm="6" md="5">
              <div class="popup_dialog custom-scrollbar">
                <!-- card header (user info) -->
                <v-list-item
                  class="pb-3 pt-4 pr-0 sticky-top-0 z-index-5 popupBackground"
                >
                  <v-list-item-avatar color="grey" size="42" class="my-0">
                    <v-img :src="post && post.user && post.user.image ? post.user.image : $store.state.defaultProfileImage" />
                  </v-list-item-avatar>
                  <v-list-item-content class="py-0">
                    <v-list-item-title class="subtitle-1 font-weight-regular">
                      <v-menu
                        :close-on-content-click="false"
                        open-on-hover
                        left
                        offset-x
                      >
                        <template #activator="{ on, attrs }">
                          <div class="d-inline" v-bind="attrs" v-on="on">
                            <n-link
                              :to="`/${post.user.username}`"
                              class="heading--text font-weight-medium"
                            >
                              {{ subStrText(post.user.name, 30) }}
                            </n-link>
                          </div>
                        </template>
                        <UserCard
                          set-width="300"
                          :logged-in="loggedIn"
                          :user="post.user"
                        />
                      </v-menu>
                    </v-list-item-title>
                    <v-list-item-subtitle class="caption">
                      @{{ post.user.username }}
                      <p class="pt-0 mb-0">
                        <small>
                          {{ post.datetime | datetime }}
                          <v-icon x-small>{{ mdiCircleMedium }}</v-icon>
                          <PostPrivacy :type="post.type" />
                        </small>
                      </p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <!-- right actions -->
                  <v-list-item-icon class="my-0">
                    <v-menu
                      transition="slide-x-transition"
                      left
                      offset-y
                      :nudge-width="140"
                      :max-width="300"
                      z-index="2"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon v-on="on">
                            {{ mdiDotsVertical }}
                          </v-icon>
                        </v-btn>
                      </template>
                      <v-card
                        class="rounded-lg overflow-hidden"
                        flat
                        outlined
                        elevation="10"
                      >
                        <v-list dense class="py-0">
                          <v-list-item-group color="primary">
                            <v-list-item
                              v-if="loggedIn && post.user.id === user.id"
                              :to="getEditUrl(post)"
                              nuxt
                            >
                              <v-list-item-icon class="mr-3">
                                <v-icon size="20">
                                  {{ mdiPencilOutline }}
                                </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="body-2 font-weight-regular"
                                >
                                  Edit post
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item
                              v-if="loggedIn && post.user.id === user.id"
                              @click="showConfirmDelete(post.id)"
                            >
                              <v-list-item-icon class="mr-3">
                                <v-icon size="20">
                                  {{ mdiTrashCanOutline }}
                                </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="body-2 font-weight-regular"
                                >
                                  Delete post
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-icon class="mr-3">
                                <v-icon size="20">
                                  {{ mdiLinkVariant }}
                                </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  class="body-2 font-weight-regular"
                                  @click="copyLink(post)"
                                >
                                  Copy link to post
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-list-item-icon>
                </v-list-item>

                <!-- Post content -->
                <div
                  class="px-4"
                  :class="[
                    post.likes > 0 || post.comments_count > 0 ? '' : 'pb-2',
                  ]"
                >
                  <v-card-subtitle class="pa-0 pb-1 font-16 font-weight-bold">
                    {{ post.title }}
                  </v-card-subtitle>
                  <template v-if="post.content">
                    <p class="mb-1 text--text">
                      {{
                        subStrText(
                          post.content,
                          modalSeeMoreContent ? post.content.length : 140
                        )
                      }}
                      <span
                        v-if="
                          post.content &&
                          post.content.length > 140 &&
                          !modalSeeMoreContent
                        "
                        class="primary--text cursor-pointer"
                        @click="modalSeeMoreContent = true"
                        >see more</span
                      >
                    </p>
                  </template>
                  <!-- showing reaction & comments count -->
                  <template v-if="post.likes || post.comments_count">
                    <post-reacted-icons
                      class="py-0 pl-0"
                      :post="post"
                      @show-comments="toggleCommentBox"
                    />
                  </template>
                </div>
                <v-divider />
                <v-card-actions class="justify-space-between">
                  <!-- Reactions actions -->
                  <Reaction
                    :add-class="true"
                    :post-id="post.id"
                    :like="post.like"
                    :like-icon="mdiThumbUpOutline"
                    @update="updateReaction(post, index, $event)"
                    @delete="deleteReaction(post, index, $event)"
                  />
                  <v-btn
                    class="post-features_action mt-lg-0 mt-sm-2"
                    text
                    @click="toggleCommentBox"
                  >
                    <v-icon left>{{ mdiCommentTextOutline }}</v-icon>
                    <span class="d-none d-lg-inline-block mt-lg-0 mt-sm-3"
                      >Comment</span
                    >
                  </v-btn>
                  <share-buttons
                    :add-class="true"
                    :url="`${$config.appURL}/posts/${post.slug}`"
                    :title="post.title"
                    :excerpt="post.title"
                    :send-btn-visible="
                      inArray(post.user.id, user.connectedUsers)
                    "
                  />
                  <v-btn
                    v-if="inArray(post.user.id, user.connectedUsers)"
                    class="post-features_action mt-lg-0 mt-sm-2"
                    text
                    @click="openChatWindow(post.user), (isOpenImage = false)"
                  >
                    <v-icon left>
                      {{ mdiChatProcessingOutline }}
                    </v-icon>
                    <span class="d-none d-lg-inline-block mt-lg-0 mt-sm-3"
                      >Chat</span
                    >
                  </v-btn>
                </v-card-actions>
                <!-- Showing Comments list -->
                <transition name="fade">
                  <comment-list
                    v-if="post.showComment"
                    :post-id="post.id"
                    :post-index="index"
                    :post-user-id="post.user.id"
                    @comments-count-updated="commentsCountUpdated"
                  />
                </transition>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiCommentTextOutline,
  mdiThumbUpOutline,
  mdiChatProcessingOutline,
  mdiCircleMedium,
  mdiDotsVertical,
  mdiDelete,
  mdiPencil,
  mdiLinkVariant,
  mdiXml,
  mdiFlagOutline,
  mdiEyeOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiEye,
} from '@mdi/js';
import CommentList from '~/components/comment/List.vue';

export default {
  name: 'FeedPostCard',

  components: { CommentList },

  props: {
    post: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    showAnotherPage: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isOpenImage: false,
      activeSlide: 0,
      seeMoreContent: false,
      modalSeeMoreContent: false,
      mdiCommentTextOutline,
      mdiThumbUpOutline,
      mdiChatProcessingOutline,
      mdiCircleMedium,
      mdiDotsVertical,
      mdiDelete,
      mdiPencil,
      mdiLinkVariant,
      mdiXml,
      mdiFlagOutline,
      mdiEyeOutline,
      mdiPencilOutline,
      mdiTrashCanOutline,
      mdiEye,
    };
  },

  computed: {
    user() {
      return this.$auth.user;
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },
    isOutlined() {
      return ['feed', 'topics-slug'].includes(this.$route.name);
    },
  },

  methods: {
    // helper to truncate text
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
    // to find url
    findUrl(string) {
      if (string) {
        const findUrl = string.match(
          /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/
        );

        if (findUrl) {
          return findUrl[0];
        } else {
          return findUrl;
        }
      }
    },
    updateReaction(post, i, $event) {
      this.$emit('update-reaction', { post, i, $event });
    },
    deleteReaction(post, i, $event) {
      this.$emit('delete-reaction', { post, i, $event });
    },
    openPostDialog(index = 0) {
      this.activeSlide = index;
      this.isOpenImage = true;
    },
    // update comments count
    commentsCountUpdated(payload) {
      this.$emit('comments-count-updated', payload);
    },

    // select user to open chatbox
    async openChatWindow(user) {
      if (this.$vuetify && this.$vuetify.breakpoint.mobile) {
        // load mobile chat
        await this.$store.commit('chat/USER_SELECTED_IN_MOBILE', user);
        await this.$router.push('/messaging');
      } else {
        await this.$store.commit('chat/USER_SELECTED', user);
      }
    },
    // toggle comment box
    toggleCommentBox() {
      this.$emit('toggle-comment-box', {
        showComment: !this.post.showComment,
        index: this.index,
      });
    },
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

    async copyLink(post) {
      let link = '';
      switch (post.type) {
        case 'public':
          link = `/posts/${post.slug}`;
          break;
        case 'private':
          link = `/posts/${post.slug}`;
          break;
        default:
          link = `/posts/${post.slug}`;
      }

      const copyText = `${this.$config.appURL}` + link;

      try {
        await navigator.clipboard.writeText(copyText);
        this.$store.commit(
          'CRUD_SUCCESS_NO_ACTION',
          'Post successfully copied !'
        );
      } catch ($e) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          'something is wrong please try another browser'
        );
      }
    },

    showConfirmDelete(postId) {
      this.$emit('post-delete', postId);
    },
    gotoDetailPage(post) {
      if (this.showAnotherPage) {
        this.$router.push(`/posts/${post.slug}`);
      } else {
        this.$emit('post-details-show', `${post.slug}`);
      }
    },
    inArray(needle, expectArr) {
      const length = expectArr.length;
      for (let i = 0; i < length; i++) {
        if (Number(expectArr[i]) === Number(needle)) return true;
      }
      return false;
    },
    getFileExtension(filename) {
      const extension = filename.split('.');
      return extension[extension.length - 1];
    },
  },
};
</script>

<style scoped>
.sticky-top-0 {
  position: sticky !important;
  top: 0rem !important;
}
.line-break {
  white-space: pre-line;
}
</style>
