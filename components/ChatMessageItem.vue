<template>
  <v-hover v-slot="{ hover }" :disabled="disableHover">
    <v-list-item class="px-0 py-3">
      <div
        class="d-flex w-100 align-start"
        :class="sender.id === user.id ? 'flex-row-reverse text-right' : ''"
      >
        <!-- user avater  -->
        <div class="user-img">
          <v-avatar
            size="35"
            class="mx-2"
            :color="sender.id === user.id ? 'purple' : 'blue'"
          >
            <v-img
              :alt="`${sender.name} avatar`"
              :src="sender && sender.image? sender.image : $store.state.defaultProfileImage"
            />
          </v-avatar>
        </div>

        <!-- message content -->
        <div
          class="chat-contents d-flex flex-column"
          :class="sender.id === user.id ? 'align-end' : ''"
        >
          <!-- text type message  -->
          <p
            v-if="message.type === 'text'"
            v-html="getTextEmoji(message.message)"
          />

          <!-- Link -->
          <a
            v-else-if="message.type === 'link'"
            :href="message.message"
            target="_blank"
          >
            {{ message.message }}
          </a>

          <!-- Files -->
          <template v-else-if="message.type === 'file'">
            <!-- Image -->
            <template v-if="isImage(message.file_extension)">
              <!-- image captions -->
              <v-card v-if="message.message" class=" pa-0 elevation-0">
                <v-card-text  class="py-1 px-0">
                  <p
                    class="mb-1 text--text break-spaces"
                    v-html="getTextEmoji(message.message)"
                  />
                </v-card-text>
              </v-card>

              <!-- image with large view dialog -->
              <v-card class="py-0 overflow-hidden mx-4" max-width="200">
                <v-dialog content-class="message__image-dialog rounded-lg">
                  <!-- chat box veiw image -->
                  <template #activator="{ on, attrs }">
                    <v-img
                      :src="message.attachment"
                      class="cursor-pointer"
                      contain
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>

                  <!-- dailog view image -->
                  <v-card>
                    <div class="d-flex justify-center align-center h-auto">
                      <img
                        :src="message.attachment"
                        :alt="`image_${message.id}`"
                      />
                    </div>
                  </v-card>
                </v-dialog>
              </v-card>
            </template>
            <!-- Documents -->
            <template v-else>
              <div
                v-if="message.message"
                class="mb-2 break-spaces"
                v-html="getTextEmoji(message.message)"
              ></div>
              <v-card-text class="message__file-inner pa-0">
                <div class="message__file">
                  <div
                    class="message__file-ext"
                    :class="'file-' + makeLowerCase"
                  >
                    <span>{{ message.file_extension }}</span>
                  </div>
                  <div class="message__file-name">
                    <span>{{ getFileName(message.attachment) }}</span>
                  </div>
                </div>
                <!-- download button -->
                <v-btn
                  type="button"
                  :loading="downloading"
                  height="100%"
                  class="message__file-download"
                  @click.stop="downloadAttachment(message)"
                >
                  <v-icon>{{ mdiDownload }}</v-icon>
                  Download
                </v-btn>
              </v-card-text>
            </template>
          </template>
          <time
            class="message__time mt-1 mb-0"
            :class="sender.id !== user.id ? '' : 'text-right'"
          >
            {{ message.created_at | formattedTime }}
          </time>
        </div>
        <v-spacer />

        <v-menu
          v-if="hover && sender.id === user.id"
          transition="slide-x-transition"
          :left="sender.id !== user.id"
          :right="sender.id === user.id"
          :max-width="170"
          :allow-overflow="true"
          :close-on-click="true"
          :close-on-content-click="false"
          :z-index="1000"
          offset-y
          @input="disableHover = $event"
        >
          <template #activator="{ on, attrs }">
            <v-btn x-small icon v-bind="attrs" v-on="on">
              <v-icon>{{ mdiDotsVertical }}</v-icon>
            </v-btn>
          </template>

          <v-list class="pa-0" dense>
            <!-- <v-list-item v-if="sender.id === user.id" ripple @click="editItem">
              <v-list-item-action class="mr-3">
                <v-icon size="20">
                  {{ mdiPencilOutline }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="font-14"> Edit </v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
            <v-list-item
              v-if="sender.id === user.id"
              ripple
              @click.stop="deleteItem"
            >
              <v-list-item-action class="mr-3">
                <v-icon size="20">
                  {{ mdiTrashCanOutline }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="font-14"> Delete </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-list-item>
  </v-hover>
</template>
<script>
import {
  mdiDotsVertical,
  mdiDelete,
  mdiPencilBoxOutline,
  mdiDownload,
  mdiPencilOutline,
  mdiTrashCanOutline,
} from '@mdi/js';
export default {
  name: 'ChatMessageItem',
  props: {
    message: {
      type: Object,
      required: true,
      default: null,
    },

    sender: {
      type: Object,
      required: true,
      default: null,
    },

    lastMessage: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      sentOn: false,
      statusReport: false,
      downloading: false,
      disableHover: false,
      mdiDotsVertical,
      mdiDelete,
      mdiPencilBoxOutline,
      mdiDownload,
      mdiPencilOutline,
      mdiTrashCanOutline,
    };
  },

  computed: {
    user() {
      return this.$auth.user;
    },
    makeLowerCase() {
      return this.message?.file_extension?.toLowerCase();
    },
  },

  methods: {
    isImage(ext) {
      const image = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test('.' + ext);
      return image;
    },

    getFileName(fileUrl) {
      let fileName = 'attachments';
      if (fileUrl) {
        const splitArray = fileUrl?.split('/');
        if (splitArray) {
          fileName = splitArray[splitArray?.length - 1].replaceAll('-', ' ');
          fileName = fileName.substr(0, 10) + '...';
        }
      }
      return fileName;
    },
    getTextEmoji(text) {
      const regexExp =
        /(\u00A9|\u00AE|[\u2000-\u3300]|\uD83C[\uD000-\uDFFF]|\uD83D[\uD000-\uDFFF]|\uD83E[\uD000-\uDFFF])/gi;

      const isEmoji = regexExp.test(text);
      if (isEmoji) {
        let modifyText;
        if (text.match(/[a-zA-Z0-9 _-]+/)) {
          modifyText = text.replace(/\p{Emoji}+/gu, (emoji, i) =>
            Number.isInteger(Number(emoji))
              ? `<span>${emoji}</span>`
              : `${this.isHasNumberWithEmoji(emoji)}`
          );
        } else {
          modifyText = `<span class='font-28 line__height'>${text}</span>`;
        }
        return modifyText;
      } else {
        return text;
      }
    },
    isHasNumberWithEmoji(str) {
      if (str) {
        let makeText = '';
        str.split('').forEach((item) => {
          makeText += Number.isInteger(Number(item))
            ? `<span>${item}</span>`
            : `<span class='font-14'>${item}</span>`;
        });
        return makeText;
      }

      return str;
    },
    // edit item
    editItem() {},

    // delete item
    deleteItem() {
      this.$emit('delete-message', { id: this.message.id });
    },

    async downloadAttachment(message) {
      this.downloading = true;
      try {
        const response = await this.$axios({
          url: `api/message/attachment/${message.id}`,
          method: 'GET',
          responseType: 'blob',
        });
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'unknown';
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          fileName = fileNameMatch[1];
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.downloading = false;
      } catch (e) {
        this.downloading = false;
        this.$store.commit(
          'APP_NETWORK_ERROR',
          e.response && e.response.data.message
        );
      }
    },
  },
};
</script>
