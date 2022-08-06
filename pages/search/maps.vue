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
          <v-card class="mx-auto mt-2 rounded-lg" outlined flat>
            <div class="theme--dark">
              <v-subheader>
                <h2 class="font-weight-black">Maps</h2>
              </v-subheader>
            </div>

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
                      class="font-weight-light ml-3 subtitle-1"
                    >
                      {{ map.user.name }}
                    </v-list-item-title>
                  </div>
                  <v-list-item-subtitle
                    class="ml-14 font-weight-black pl-2 caption mt-n3"
                  >
                    {{ subStrText(map.title, 50) }}
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="ml-14 pl-2 caption">
                    {{ subStrText(map.description, 90) }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-card-actions>
                  <template v-if="map.isFollowing">
                    <v-btn
                      height="32"
                      class="rounded-pill text-capitalize font-12"
                      color="#2CBEE3"
                      outlined
                      depressed
                      :loading="following && map.id === mapID"
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
                      :loading="following && map.id === mapID"
                      @click="followMap(map)"
                    >
                      Follow
                    </v-btn>
                  </template>
                </v-card-actions>
              </v-list-item>
              <v-divider inset></v-divider>
            </v-list>

            <div v-if="hasPage" class="text-center" @click="getMaps(true)">
              <div v-if="loading_map_pages" class="pb-5 text-center">
                <v-progress-circular width="2" size="20" indeterminate />
              </div>

              <div v-else class="d-flex justify-center cursor-pointer">
                <h2
                  class="
                    subtitle-1
                    pt-2
                    mt-n1
                    text-center
                    pb-2
                    font-weight-bold
                  "
                >
                  See more
                </h2>
                <v-icon size="28" class="ml-4 seemore-icon mr-4 my-1">
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
      maps: [],
      hasPage: true,
      following: false,
      mapID: null,
      currentPage: 1,
      loading_map_pages: false,
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
      return this.$route.query.maps;
    },
  },

  mounted() {
    this.getMaps();
  },

  methods: {
    // search maps
    async getMaps(showMore = true) {
      this.loading_map_pages = true;
      try {
        const { items, hasPages } = await this.$axios.$get('api/search/maps', {
          params: {
            page: showMore ? this.currentPage : 1,
            per_page: 5,
            query: this.searchQuery,
          },
        });

        if (!showMore) {
          this.maps = [];
          this.currentPage = 1;
        }

        items.forEach((item) => {
          this.maps.push(item);
        });

        this.currentPage += 1;
        this.loading_map_pages = false;

        this.hasPage = hasPages;
      } catch (e) {
      } finally {
        this.loading_map_pages = false;
      }
    },

    async followMap(map) {
      this.following = true;
      this.mapID = map.id;
      try {
        if (this.loggedIn) {
          const { following } = await this.$axios.$get(
            `api/brainstorm/map/follow/${map.id}`
          );
          this.following = false;
          const objIndex = this.maps.findIndex((obj) => obj.id === map.id);

          this.maps[objIndex].isFollowing = !this.maps[objIndex].isFollowing;
          this.$store.commit('map/FOLLOW_MAP', following);
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

    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
  },
};
</script>
