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
                <h2 class="font-weight-black">Sub Groups</h2>
              </v-subheader>
            </div>

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
                      class="elevation-2 pt-4"
                      :src="group.image"
                    ></v-img>

                    <v-list-item-title
                      v-if="breakpoint"
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

                    <div class="float-left">
                      <template v-if="group.isFollowing">
                        <v-btn
                          height="32"
                          class="rounded-pill text-capitalize font-12"
                          color="#2CBEE3"
                          outlined
                          depressed
                          :loading="following && group.id === groupID"
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
                          :loading="following && group.id === groupID"
                          @click="followTaxonomy(group)"
                        >
                          Follow
                        </v-btn>
                      </template>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
            </v-list>

            <div v-if="hasPage" class="text-center" @click="getGroups(true)">
              <div v-if="loading_group_pages" class="pb-6 text-center">
                <v-progress-circular width="2" size="20" indeterminate />
              </div>

              <div v-else class="d-flex justify-center">
                <h2
                  class="
                    subtitle-1
                    pt-2
                    text-center
                    pb-2
                    font-weight-bold
                    cursor-pointer
                  "
                >
                  See more
                </h2>
                <v-icon size="28" class="ml-4 seemore-icon mr-4 my-2">
                  {{ mdiChevronDown }}</v-icon
                >
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
  </div>
</template>

<script>
import { mdiChevronDown } from '@mdi/js';
export default {
  name: 'SearchUser',
  data() {
    return {
      mdiChevronDown,
      hasPage: true,
      groups: [],
      following: false,
      groupID: null,
      following_loading: false,
      currentPage: 1,
      isHydrated: false,
      loading_group_pages: false,
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
      return this.$route.query.groups;
    },
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint.smAndUp : false;
    },
  },

  mounted() {
    this.isHydrated = true;
    this.getGroups();
  },

  methods: {
    async getGroups(showMore = true) {
      this.loading_group_pages = true;
      try {
        const { items, hasPages } = await this.$axios.$get(
          'api/search/groups',
          {
            params: {
              page: showMore ? this.currentPage : 1,
              per_page: 5,
              query: this.searchQuery,
            },
          }
        );
        if (!showMore) {
          this.groups = [];
          this.currentPage = 1;
        }
        items.forEach((item) => {
          this.groups.push(item);
        });
        this.currentPage += 1;
        this.hasPage = hasPages;
      } catch (e) {
      } finally {
        this.loading_group_pages = false;
      }
    },

    async followTaxonomy(subgroupId) {
      this.following = true;
      this.groupID = subgroupId.id;
      try {
        if (this.loggedIn) {
          await this.$axios.$get(`api/follow-taxonomy/${subgroupId.id}`);
          this.following = false;
          await this.getFollowerTaxonomy(subgroupId.id);
          const objIndex = this.groups.findIndex(
            (obj) => obj.id === subgroupId.id
          );
          this.groups[objIndex].isFollowing =
            !this.groups[objIndex].isFollowing;
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

    async getFollowerTaxonomy(subgroupId) {
      this.following_loading = true;
      try {
        await this.$axios.$get(`api/follower-taxonomy/${subgroupId}`);
        this.following_loading = false;
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
