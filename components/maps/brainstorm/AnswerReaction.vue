<template>
  <v-menu
    content-class="reaction"
    rounded="pill"
    open-on-hover
    top
    offset-y
    :nudge-left="30"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        :class="addClass ? 'post-features_action' : ''"
        text
        v-bind="attrs"
        v-on="on"
        @click="updateReaction(reaction ? reaction.action : 'like')"
      >
        <template v-if="reaction">
          <img
            :src="`/reactions/${reaction.icon}.png`"
            class="mr-2 d-inline-block"
            :class="addClass ? 'mt-lg-0 mt-sm-2' : ''"
            width="24"
            height="24"
            alt=""
          />
          <span
            class="d-none d-sm-inline-block pb-"
            :class="[addClass ? 'mt-lg-0 mt-sm-3' : '', reaction.action]"
            >{{ reaction.text }}</span
          >
        </template>
        <template v-else>
          <svg
            :class="addClass ? 'mt-lg-0 mt-sm-2' : ''"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 58.53 56.07"
          >
            <defs>
              <style>
                .cls-like-black-1 {
                  fill: #101010;
                }
                .cls-like-black-2 {
                  fill: #ebeef0;
                }
              </style>
            </defs>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <path
                  class="cls-like-black-1"
                  d="M58.53,26.55V24.83c-.1-.36-.19-.73-.3-1.08a6.13,6.13,0,0,0-6-4.26H37.73c-.66,0-.67,0-.46-.65A36.18,36.18,0,0,0,38.91,11a10.69,10.69,0,0,0-4.22-9.76A4.81,4.81,0,0,0,30.31.15a9.37,9.37,0,0,0-2.63,1.06,1.62,1.62,0,0,0-.86,1.54c0,2.49,0,5,0,7.48a2,2,0,0,1-.18.83L20,25.54c-.08.18-.1.44-.39.43-.29-1.43-.5-1.59-2-1.59H1.6C.45,24.38,0,24.81,0,26V54.52c0,1.13.42,1.55,1.56,1.55H18c1.11,0,1.55-.44,1.56-1.56V52.24a.64.64,0,0,1,.41.11,12.7,12.7,0,0,0,5.4,1.27c7.6,0,15.2.06,22.8,0a5.45,5.45,0,0,0,5.1-7.52c-.13-.33,0-.45.23-.62a5.37,5.37,0,0,0,2.22-6.65c-.15-.38-.06-.53.26-.7a4.42,4.42,0,0,0,1.25-1.07,6.19,6.19,0,0,0,1.34-3V32.72A4.57,4.57,0,0,0,57.35,30a.39.39,0,0,1,0-.59A5.29,5.29,0,0,0,58.53,26.55Z"
                />
                <path
                  class="cls-like-black-2"
                  d="M36.87,52.41H26.3a13.22,13.22,0,0,1-6.36-1.56.67.67,0,0,1-.43-.69q0-9.85,0-19.71c0-.36.09-.58.44-.69a4.16,4.16,0,0,0,2.55-2.61c2.1-4.72,4.3-9.4,6.47-14.09a3,3,0,0,0,.3-1.32c0-2.32,0-4.64,0-7a.66.66,0,0,1,.48-.71,3.13,3.13,0,0,1,3.77.53,9,9,0,0,1,3,5.66,16.9,16.9,0,0,1-.46,4.47,40.32,40.32,0,0,1-1.78,6.59c-.29.84,0,1.54.69,1.73a3.36,3.36,0,0,0,.9.1H52.11a4,4,0,0,1,2.5.77,3.63,3.63,0,0,1,0,5.73l-.13.11c-1.06.81-1,1.65.08,2.39a3,3,0,0,1,1.31,1.67,3,3,0,0,1-2.27,3.86,1.74,1.74,0,0,0-1,.46c-.46.51-.4,1.15.18,1.83A3,3,0,0,1,51.08,45a1.23,1.23,0,0,0-.77,2.19,2.93,2.93,0,0,1,.59,3.42,3.07,3.07,0,0,1-3.06,1.78Z"
                />
              </g>
            </g>
          </svg>

          <span
            class="ml-2 d-none d-sm-inline"
            :class="addClass ? 'mt-lg-0 mt-sm-3' : ''"
          >
            Like</span
          >
        </template>
      </v-btn>
    </template>
    <div class="like-buttons">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-img
            class="d-inline-block cursor-pointer"
            v-bind="attrs"
            src="/reactions/like.png"
            width="32"
            v-on="on"
            @click="updateReaction('like')"
          />
        </template>
        <span>Like</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-img
            class="love-btn d-inline-block cursor-pointer ml-3"
            v-bind="attrs"
            src="/reactions/love.png"
            width="32"
            v-on="on"
            @click="updateReaction('love')"
          />
        </template>
        <span>Love</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-img
            class="clap-btn d-inline-block cursor-pointer ml-3"
            v-bind="attrs"
            src="/reactions/clap.png"
            width="32"
            v-on="on"
            @click="updateReaction('clap')"
          />
        </template>
        <span>Clap</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-img
            class="idea-btn d-inline-block cursor-pointer ml-3"
            v-bind="attrs"
            src="/reactions/idea.png"
            width="32"
            v-on="on"
            @click="updateReaction('idea')"
          />
        </template>
        <span>Idea</span>
      </v-tooltip>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-img
            class="curious-btn d-inline-block cursor-pointer ml-3"
            v-bind="attrs"
            src="/reactions/curious.png"
            width="32"
            v-on="on"
            @click="updateReaction('curious')"
          />
        </template>
        <span>Curious</span>
      </v-tooltip>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'AnswerReaction',
  props: {
    activeAnswer: {
      type: Object,
      default() {
        return null;
      },
    },
    reactIcon: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: 'api/openjourney/map/steps/answers',
    },
    addClass: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    reaction: null,
  }),
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
  },
  mounted() {
    if (this.activeAnswer.reactions_count) {
      this.getReaction(this.activeAnswer.reaction.type);
    }
  },
  methods: {
    // update reaction of post
    async updateReaction(reaction) {
      try {
        if (this.loggedIn) {
          const { deleted } = await this.$axios.$get(
            `${this.url}/reaction/${this.activeAnswer.id}/${reaction}`
          );
          if (deleted) {
            this.reaction = null;
            this.$emit('delete', {
              answerId: this.activeAnswer.id,
              reaction,
              user_id: this.user.id,
            });
          } else {
            this.getReaction(reaction);
            this.$emit('update', {
              answerId: this.activeAnswer.id,
              reaction,
              user_id: this.user.id,
            });
          }
        } else {
          await this.$store.commit(
            'APP_NETWORK_ERROR',
            'You must login to perform this action.'
          );
        }
      } catch (e) {}
    },
    // get image and text
    getReaction(reaction) {
      switch (reaction) {
        case 'like':
          this.reaction = {
            action: reaction,
            icon: 'like',
            text: 'Like',
          };
          break;
        case 'love':
          this.reaction = {
            action: reaction,
            icon: 'love',
            text: 'Love',
          };
          break;
        case 'clap':
          this.reaction = {
            action: reaction,
            icon: 'clap',
            text: 'Clap',
          };
          break;
        case 'idea':
          this.reaction = {
            action: reaction,
            icon: 'idea',
            text: 'Idea',
          };
          break;
        case 'curious':
          this.reaction = {
            action: reaction,
            icon: 'curious',
            text: 'Curious',
          };
          break;
      }
    },
  },
};
</script>
