<template>
  <v-container>
    <v-row justify="center">
      <v-col
        v-if="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
        cols="12"
        md="3"
      >
        <!-- START MOST POPULAR POSTS -->
        <ad-card :footer="false" class="sticky-top">
            <adsbygoogle ad-slot="6757125591" ad-format="auto" />
          </ad-card>
      </v-col>
      <v-col cols="12" md="6" class="rounded-lg">
        <v-card outlined class="rounded-lg">
          <!-- <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Notifications</v-toolbar-title>
          </v-toolbar> -->
          <v-card-text class="pa-0 rounded-lg">
            <v-list class="py-0 rounded-lg">
              <v-list-item-group class="rounded-lg">
                <div
                  v-for="(notification, index) in notifications"
                  :key="notification.id"
                >
                  <v-hover v-slot="{ hover }">
                    <v-list-item
                      :class="[
                        ({
                          'elevation-2': hover,
                        },
                        notification.read_at
                          ? 'read-notification'
                          : 'unread-notification'),
                        index === 0 ? 'rounded-t-lg' : '',
                        index === notifications.length - 1
                          ? 'rounded-b-lg'
                          : '',
                      ]"
                      class="px-3 py-3"
                      @click.prevent="followNotification(notification)"
                    >
                      <v-list-item-avatar
                        height="60px"
                        width="60px"
                        class="mr-2"
                      >
                        <v-img
                          :alt="`${notification.data.user.name} avatar`"
                          :src="notification.data.user && notification.data.user.image != null? notification.data.user.image : $store.state.defaultProfileImage"
                        />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-subtitle style="white-space: normal">
                          <template
                            v-if="
                              getNotificationType(notification.type) ===
                              'CourseAssigned'
                            "
                          >
                            <p
                              v-if="notification.data.mandatory"
                              class="mb-0 body-2"
                            >
                              You have been assigned
                              <strong class="font-weight-medium">{{
                                notification.data.course.title
                              }}</strong>
                              a mandatory training course that must be completed
                              by
                              <span class="red--text">{{
                                notification.data.deadline
                                  | toFormattedDateString
                              }}</span>
                            </p>
                            <p v-else class="mb-0 body-2">
                              We have got
                              <strong class="font-weight-medium">{{
                                notification.data.course.title
                              }}</strong>
                              a fantastic course for you to attend
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ReactionAddedIntoPost'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              reacted on your post
                              <b> "{{ `${notification.data.post.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ConnectionRequested'
                            "
                          >
                            <p class="mb-0 body-2">
                              You have received a connection request from
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ConnectionAccepted'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              accepted your connection request.
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'CommentAddedIntoPost'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              commented on your post
                              <b> "{{ `${notification.data.post.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ReplyAddedIntoComment'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              replied on your comment on this
                              <b> "{{ `${notification.data.post.title} ` }}"</b>
                              post
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ReactionAddedIntoMap'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              reacted on your map
                              <b> "{{ `${notification.data.map.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'CommentAddedIntoMap'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              commented on your map
                              <b> "{{ `${notification.data.map.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ReactionAddedIntoCXMap'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              reacted on your map
                              <b> "{{ `${notification.data.map.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'CommentAddedIntoCXMap'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              commented on your map
                              <b> "{{ `${notification.data.map.title}` }}" </b>
                            </p>
                          </template>
                          <template
                            v-else-if="
                              getNotificationType(notification.type) ===
                              'ReplyAddedIntoCXMapComment'
                            "
                          >
                            <p class="mb-0 body-2">
                              <strong class="font-weight-medium">{{
                                notification.data.user.name
                              }}</strong>
                              replied on your comment on this
                              <b>
                                "{{ `${notification.data.map.title}` }}" map
                              </b>
                            </p>
                          </template>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action
                        :style="{ height: '45px !important' }"
                      >
                        <v-list-item-action-text class="body-2 ml-2">
                          {{ notification.created_at | datetime }}
                        </v-list-item-action-text>
                        <v-menu
                          v-if="
                            getNotificationType(notification.type) !==
                            'CourseAssigned'
                          "
                          offset-y
                          origin="center center"
                          transition="scale-transition"
                          left
                        >
                          <template #activator="{ on }">
                            <v-icon
                              class="mr-n1"
                              height="36"
                              width="36"
                              v-on="on"
                            >
                              {{ mdiDotsHorizontal }}
                            </v-icon>
                          </template>
                          <v-list class="pa-0">
                            <!-- <v-list-item ripple @click="markAsRead(notification.id)">
                              <v-list-item-action>
                                <v-icon>
                                  {{ mdiCheckboxMarked }}
                                </v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>
                                  Mark as read
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-divider /> -->
                            <v-list-item
                              ripple
                              class="px-3"
                              @click="
                                deleteNotification(notification.id, index)
                              "
                            >
                              <v-list-item-action class="mr-3 my-0">
                                <v-icon large>
                                  {{ mdiTrashCanOutline }}
                                </v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title class="body-1">
                                  Delete
                                </v-list-item-title>
                                <v-list-item-subtitle class="caption">
                                  Delete this notification
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-list-item-action>
                    </v-list-item>
                  </v-hover>
                  <v-divider
                    v-if="index < notifications.length - 1"
                    :key="index"
                  />
                </div>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <!-- START MOST POPULAR POSTS -->
        <ad-card :footer="true" class="sticky-top">
          <adsbygoogle ad-slot="6757125591" ad-format="auto" />
        </ad-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import {
  mdiDotsHorizontal,
  mdiTrashCanOutline,
  mdiBell,
  mdiBellAlert,
} from '@mdi/js';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'NotificationsPage',
  middleware: 'auth',
  data() {
    return {
      processing: false,
      mdiDotsHorizontal,
      mdiTrashCanOutline,
      mdiBell,
      mdiBellAlert,
    };
  },
  head() {
    return {
      title: 'Notifications',
    };
  },
  computed: {
    ...mapState('notification', ['notifications']),
  },
  mounted() {
    this.$store.dispatch('notification/getNotifications');
  },
  methods: {
    getNotificationType(value) {
      return value.split('\\').pop();
    },
    ...mapActions('notification', [
      'deleteNotification',
      'followNotification',
      'markAsRead',
    ]),
  },
};
</script>
