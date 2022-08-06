<template>
  <div>
    <div class="sticky-top-4 z-index-5 background">
      <v-container class="py-0">
        <page-header class="py-3" />
      </v-container>
    </div>
    <v-container class="pt-0">
      <v-row>
        <v-col
          v-if="!($vuetify.breakpoint.xs && $route.path !== '/my-network')"
          cols="12"
          sm="4"
          md="3"
        >
          <div class="sticky-top-7">
            <v-card outlined class="py-1 rounded-lg text--text">
              <v-list class="py-0">
                <v-subheader class="body-1 subtitle-1 font-weight-bold p-0"
                  >Manage my network
                </v-subheader>
                <v-list-item
                  v-for="network in manageMyNetwork"
                  :key="network.title"
                  :to="network.link"
                  min-width="36"
                  nuxt
                >
                  <v-list-item-action class="my-1 mr-2">
                    <v-icon> {{ network.icon }} </v-icon>
                  </v-list-item-action>
                  <v-list-item-content class="py-0">
                    <v-list-item-title
                      class="body-2 d-flex justify-space-between align-center"
                    >
                      <p class="mb-0">{{ network.title }}</p>
                      <p class="mb-0 primary--text">{{ network.number }}</p>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <ad-card :footer="true" class="mt-2 m-0 d-none d-sm-block">
              <adsbygoogle ad-slot="6757125591" ad-format="auto" />
            </ad-card>
          </div>
        </v-col>

        <v-col cols="12" sm="8" md="9" class="py-3">
          <nuxt-child
            :connection-count="connectionCount"
            :member-count="memberCount"
            :contact-count="contactCount"
            :following-count="followingCount"
            @removeConnectionCount="removeConnectionCountEvent"
            @addConnectionCount="addConnectionCountEvent"
            @removefollowCount="removefollowCountEvent"
            @addFollowingCount="addFollowingCountEvent"
          />
        </v-col>
      </v-row>
      <ad-card :footer="true" class="mt-3 m-0 d-sm-none">
        <adsbygoogle ad-slot="6757125591" ad-format="auto" />
      </ad-card>
    </v-container>
  </div>
</template>

<script>
import {
  mdiChartTimelineVariant,
  mdiAccountGroupOutline,
  mdiAccountCircleOutline,
  mdiNotebookOutline,
} from '@mdi/js';
export default {
  name: 'MyNetwork',
  middleware: 'auth',
  data() {
    return {
      manageMyNetwork: [
        {
          link: `/my-network/connections`,
          icon: mdiChartTimelineVariant,
          title: `Connections`,
          number: 0,
        },
        {
          link: `/my-network/members`,
          icon: mdiAccountGroupOutline,
          title: `Members`,
          number: 0,
        },
        {
          link: `/my-network/contacts`,
          icon: mdiNotebookOutline,
          title: `Contacts`,
          number: 0,
        },
        {
          link: `/my-network/following`,
          icon: mdiAccountCircleOutline,
          title: `People I Follow`,
          number: 0,
        },
      ],
      manageNetworkCountObj: {},
    };
  },
  head: {
    title: 'My Network',
  },
  computed: {
    connectionCount() {
      return this.manageMyNetwork[0].number;
    },
    memberCount() {
      return this.manageMyNetwork[1].number;
    },

    contactCount() {
      return this.manageMyNetwork[2].number;
    },

    followingCount() {
      return this.manageMyNetwork[3].number;
    },
  },
  mounted() {
    this.getAllCountingList();
  },
  methods: {
    removeConnectionCountEvent() {
      this.$set(
        this.manageMyNetwork[0],
        'number',
        (this.manageNetworkCountObj.connectionCount =
          this.manageNetworkCountObj.connectionCount <= 0
            ? 0
            : this.manageNetworkCountObj.connectionCount - 1)
      );
    },
    addConnectionCountEvent() {
      this.$set(
        this.manageMyNetwork[0],
        'number',
        (this.manageNetworkCountObj.connectionCount =
          this.manageNetworkCountObj.connectionCount + 1)
      );
    },
    removefollowCountEvent() {
      this.$set(
        this.manageMyNetwork[3],
        'number',
        (this.manageNetworkCountObj.followingCount =
          this.manageNetworkCountObj.followingCount <= 0
            ? 0
            : this.manageNetworkCountObj.followingCount - 1)
      );
    },
    addFollowingCountEvent() {
      this.$set(
        this.manageMyNetwork[3],
        'number',
        (this.manageNetworkCountObj.followingCount =
          this.manageNetworkCountObj.followingCount + 1)
      );
    },

    async getAllCountingList() {
      try {
        const data = await this.$axios.$get(
          `api/connection/manage-network-count-list`
        );
        this.manageNetworkCountObj = data;
        this.$set(this.manageMyNetwork[0], 'number', data.connectionCount);
        this.$set(this.manageMyNetwork[1], 'number', data.memberCount);
        this.$set(this.manageMyNetwork[2], 'number', data.contactCount);
        this.$set(this.manageMyNetwork[3], 'number', data.followingCount);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.sticky-top-4 {
  position: sticky !important;
  top: 4rem !important;
}
.sticky-top-7 {
  position: sticky !important;
  top: 7rem !important;
}

@media only screen and (max-width: 960px) {
  .sticky-top-4 {
    position: sticky !important;
    top: 3.5rem !important;
  }
  .sticky-top-7 {
    position: sticky !important;
    top: 6.6rem !important;
  }
}
</style>
