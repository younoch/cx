<template>
  <v-card
    v-if="user"
    outlined
    class="overflow-hidden"
    :class="rounded"
    :width="setWidth"
  >
    <div class="avatar">
      <v-img height="102" :src="user.cover_image" />
      <v-avatar class="profile" color="grey" size="120">
        <v-img
          :src="
            user && user.image ? user.image : $store.state.defaultProfileImage
          "
        />
      </v-avatar>
    </div>
    <div class="avatar-spacer" />
    <v-card-title class="justify-center py-0 mt-3 line-height-24">
      <n-link :to="`/${user.username}`" class="text-truncate">
        {{ user.name }}
      </n-link>
    </v-card-title>
    <v-card-subtitle class="text-center py-0 mt-1 mb-2 line-height-24">
      <strong>Joined: </strong> {{ user.created_at | datetime }} ago
    </v-card-subtitle>
    <v-divider />

    <v-card-actions class="justify-center pb-4">
      <template v-if="userFollowing && loggedIn && authUser.id !== user.id">
        <v-btn
          color="primary"
          class="rounded-pill px-5"
          outlined
          :loading="following"
          @click="followMember"
        >
          Following
        </v-btn>
      </template>
      <template v-else-if="loggedIn && authUser.id !== user.id">
        <v-btn
          color="primary"
          class="rounded-pill px-5"
          :loading="following"
          @click="followMember"
        >
          <v-icon left class="mx-0">
            {{ mdiPlus }}
          </v-icon>
          Follow
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          class="text-capitalize rounded-pill px-6"
          color="primary"
          outlined
          nuxt
          :to="`/${user.username}`"
        >
          Profile
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiPlus } from '@mdi/js';
export default {
  name: 'UserCard',
  props: {
    user: {
      type: [Object, Boolean],
      default: null || false,
    },
    setWidth: {
      type: String,
      default: 'auto',
    },
    rounded: {
      type: String,
      default: 'rounded-lg',
    },
  },
  data: () => ({
    following: false,
    userFollowing: false,
    mdiPlus,
  }),
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    authUser() {
      return this.$auth.user;
    },
  },
  mounted() {
    this.userFollowing = this.inArray(
      this.user.id,
      this.authUser.peopleIFollow
    );
  },
  methods: {
    // follow member
    async followMember() {
      this.following = true;
      try {
        if (this.loggedIn) {
          const { following } = await this.$axios.$get(
            `api/user/follow/${this.user.id}`
          );
          this.following = false;
          this.userFollowing = following;

          const updateUser = JSON.parse(JSON.stringify(this.$auth.user));
          if (following) {
            updateUser.peopleIFollow.push(this.user.id);
          } else {
            updateUser.peopleIFollow = updateUser.peopleIFollow.filter((id) => {
              return Number(id) !== Number(this.user.id);
            });
          }
          this.$auth.setUser(updateUser);

          const message = following
            ? 'Successfully followed'
            : 'Successfully unfollowed';
          this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
        } else {
          this.following = false;
          await this.$store.commit(
            'APP_NETWORK_ERROR',
            'Please sign in to use this service.'
          );
        }
      } catch (e) {
        this.following = false;
      }
    },
    inArray(needle, expectArr) {
      const length = expectArr.length;
      for (let i = 0; i < length; i++) {
        if (Number(expectArr[i]) === Number(needle)) return true;
      }
      return false;
    },
  },
};
</script>
