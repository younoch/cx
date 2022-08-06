<template>
  <div id="taxonomyEntry">
    <v-container>
      <page-header />
    </v-container>
    <v-progress-linear v-if="loading" :indeterminate="loading" />
    <validation-observer ref="form" v-slot="{ handleSubmit, invalid, reset }">
      <v-form @reset.prevent="reset" @submit.prevent="handleSubmit(onSubmit)">
        <v-container>
          <v-row>
            <v-col cols="12" sm="8">
              <v-card outlined rounded="lg">
                <v-card-title>
                  <h4>Edit Post</h4>
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <b-text
                    v-model="article.title"
                    rules="required|min:10|max:180"
                    outlined
                    label="Title"
                    counter="180"
                    vid="title"
                    @blur="checkSlug"
                  />
                  <b-text
                    v-model="article.slug"
                    rules="required"
                    outlined
                    vid="slug"
                    label="Slug"
                  />
                  <v-subheader class="pa-0"> Content </v-subheader>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="content"
                    rules="required"
                  >
                    <editor
                      id="content"
                      v-model="article.content"
                      class="mt-4"
                      :api-key="apiKey"
                      :init="init"
                      :plugins="plugins"
                      :toolbar="toolbar"
                    />
                    <span class="error--text">{{ errors[0] }}</span>
                  </ValidationProvider>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card
                v-if="breakpoint.mdAndUp"
                rounded="lg"
                class="mb-4"
                outlined
              >
                <v-card-title>
                  <h4>Publish</h4>
                </v-card-title>
                <v-divider />
                <!-- <v-subheader v-if="publishedAt">
                  Scheduled on {{ publishedAt }}
                </v-subheader> -->
                <v-card-actions class="justify-center">
                  <!-- <b-date-time @input="article.datetime = $event" /> -->
                  <v-btn
                    class="ml-2 px-6"
                    rounded
                    outlined
                    @click="$router.back()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    type="submit"
                    :loading="loading"
                    class="primary px-6"
                    :disabled="invalid"
                    rounded
                  >
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="mb-6" outlined rounded="lg">
                <v-card-title>
                  <h4>Cover Image</h4>
                </v-card-title>
                <v-divider />
                <ImageUploader
                  v-model="image"
                  @updateImage="article.image = $event"
                  @removeImage="article.image = $event"
                />
              </v-card>
              <v-card
                v-if="article.group_type !== 'topic'"
                class="mb-6"
                outlined
                rounded="lg"
              >
                <v-card-title>
                  <h4>Tag</h4>
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <b-auto-complete
                    v-model="article.tags"
                    :items="tags"
                    item-text="name"
                    item-value="id"
                    outlined
                    return-object
                    multiple
                    vid="tags"
                    label="Select Tag"
                  />
                </v-card-text>
              </v-card>
              <v-card
                v-if="breakpoint.smAndDown"
                class="mb-6"
                rounded="lg"
                outlined
              >
                <v-card-title>
                  <h4>Publish</h4>
                </v-card-title>
                <v-divider />
                <!-- <v-subheader v-if="publishedAt">
                  Scheduled on {{ publishedAt }}
                </v-subheader> -->
                <v-card-actions class="justify-center">
                  <!-- <b-date-time @input="article.datetime = $event" /> -->
                  <v-btn
                    class="ml-2 px-6"
                    rounded
                    outlined
                    @click="$router.back()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    type="submit"
                    :loading="loading"
                    class="primary px-6"
                    rounded
                    :disabled="invalid"
                  >
                    Update
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { format } from 'date-fns';
import Editor from '@tinymce/tinymce-vue';
import { mdiCalendar, mdiPlus, mdiDelete, mdiPencil, mdiClose } from '@mdi/js';

export default {
  name: 'EditPost',
  components: { Editor },
  middleware: 'auth',
  async asyncData({ app, params, redirect }) {
    try {
      const res = await app.$axios.$get(`api/get-post/${params.slug}`);
      return {
        article: Object.assign({}, res),
      };
    } catch (e) {
      redirect('/');
    }
  },
  data() {
    const defaultForm = Object.freeze({
      title: '',
      slug: '',
      content: '',
      datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      tags: [],
      status: 'active',
      type: this.$route.params.type,
      image: '',
      group: this.$route.params.group,
      subgroup: this.$route.params.slug,
    });

    return {
      language: 'en',
      article: Object.assign({}, defaultForm),
      image: '',
      tags: [],
      asset_ids: [],
      isHydrated: false,
      loading: false,
      apiKey: this.$config.tinyMceApiKey,
      mdiCalendar,
      mdiPlus,
      mdiPencil,
      mdiDelete,
      mdiClose,
      toolbar:
        'undo redo | bold italic underline strikethrough | image media fileupload | alignleft aligncenter alignright alignjustify |  numlist bullist | fontselect fontsizeselect formatselect paste pastetext | outdent indent | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | link anchor codesample | ltr rtl | code',
      plugins:
        'print preview paste  importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons code',
      init: {
        height: 500,
        skin: '',
        content_css: '',
        toolbar_mode: 'sliding',
        image_caption: true,
        browser_spellcheck: true,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: true,
        image_advtab: true,
        menubar: true,
        branding: false,
        automatic_uploads: true,
        paste_data_images: true,
        images_upload_url: `/api/common/asset?token=${this.$auth.strategy.token
          .get()
          .substr(7)}`,
        images_upload_handler: (blobInfo, success, failure, progress) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', `/api/common/asset`);
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.setRequestHeader(
            'Authorization',
            this.$auth.strategy.token.get()
          );

          xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
          };

          xhr.onload = () => {
            if (xhr.status !== 201) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            const json = JSON.parse(xhr.responseText);

            if (!json || typeof json.location !== 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }

            // update assets
            this.asset_ids.push(json.id);

            this.$store.commit(
              'CRUD_SUCCESS_NO_ACTION',
              'Image Uploaded Successfully'
            );

            success(json.location);
          };

          xhr.onerror = function () {
            failure(
              'Image upload failed due to a XHR Transport error. Code: ' +
                xhr.status
            );
          };

          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = async (e) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            try {
              const { location, id } = await this.$axios.$post(
                `api/common/asset`,
                formData
              );
              // update assets
              this.asset_ids.push(id);

              this.$store.commit(
                'CRUD_SUCCESS_NO_ACTION',
                'Image Uploaded Successfully'
              );

              callback(location);
            } catch (err) {
              this.$store.commit(
                'APP_NETWORK_ERROR',
                err.response && err.response.data.message
              );
            }
          };

          input.click();
        },
        setup: (editor) => {
          editor.ui.registry.addButton('fileupload', {
            icon: 'new-document',
            tooltip: 'Insert Document',
            onAction: () => {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute(
                'accept',
                '.pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx'
              );
              input.onchange = async (e) => {
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const { location, name, id } = await this.$axios.$post(
                    `api/common/asset`,
                    formData
                  );
                  // update assets
                  this.asset_ids.push(id);
                  this.$store.commit(
                    'CRUD_SUCCESS_NO_ACTION',
                    'Document Uploaded Successfully'
                  );

                  const iframe = `<div class="v-card v-sheet" style="width: 600px; min-height: 300px; margin: auto;">
                    <div class="player-wrapper">
                      <div class="player">
                        <iframe class="document" src="https://docs.google.com/viewer?embedded=true&url=${location}" frameborder="0"
                        allowfullscreen style="width: 100%; height: 100%;"></iframe>
                      </div>
                    </div>
                    <div class="v-card__title justify-center">
                      <a href="${location}" title="${name}" class="uploadFile">Download Document</a>
                    </div>
                  </div>`;

                  editor.insertContent(iframe);
                } catch (err) {
                  if (err.response.status === 422) {
                    const { errors } = err.response.data;
                    const fields = Object.values(errors);
                    for (let i = 0; i < fields.length; i++) {
                      for (let j = 0; j < fields[i].length; j++) {
                        this.$store.commit(
                          'APP_NETWORK_ERROR',
                          `${fields[i][j]}`
                        );
                      }
                    }
                  } else {
                    this.$store.commit(
                      'APP_NETWORK_ERROR',
                      err.response && err.response.data.message
                    );
                  }
                }
              };

              input.click();
            },
          });
        },
        init_instance_callback: (editor) => {
          const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;

          const observer = new MutationObserver(async (mutations, instance) => {
            const removedImages = [];
            const removedDocuments = [];
            mutations.forEach((mutationRecord, index) => {
              for (let i = 0; i < mutationRecord.removedNodes.length; i++) {
                const currentNode = mutationRecord.removedNodes[i];
                if (currentNode.nodeName === 'IMG') {
                  if (removedImages.includes(currentNode.src)) continue;

                  removedImages.push(currentNode.getAttribute('src'));
                  continue;
                }
                if (currentNode.constructor.name.substr(0, 4) === 'HTML') {
                  const imgs = currentNode.querySelectorAll('img');
                  for (let j = 0; j < imgs.length; j++) {
                    if (removedImages.includes(imgs[j].src)) continue;

                    removedImages.push(imgs[j].getAttribute('src'));
                  }
                  const documents = currentNode.querySelectorAll('.uploadFile');
                  for (let j = 0; j < documents.length; j++) {
                    if (removedDocuments.includes(documents[j].href)) continue;

                    removedDocuments.push(documents[j].getAttribute('href'));
                  }
                }
              }
            });
            for (let i = 0; i < removedImages.length; i++) {
              const source = removedImages[i];

              try {
                const { message, id } = await this.$axios.$post(
                  `api/common/asset-file`,
                  {
                    source,
                  }
                );
                // remove deleted ids
                this.asset_ids = this.asset_ids.filter((_) => _ !== id);
                this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
              } catch (err) {
                this.$store.commit(
                  'APP_NETWORK_ERROR',
                  err.response && err.response.data.message
                );
              }
            }
            for (let i = 0; i < removedDocuments.length; i++) {
              const source = removedDocuments[i];

              try {
                const { message, id } = await this.$axios.$post(
                  `api/common/asset-file`,
                  {
                    source,
                  }
                );
                // remove deleted ids
                this.asset_ids = this.asset_ids.filter((_) => _ !== id);
                this.$store.commit('CRUD_SUCCESS_NO_ACTION', message);
              } catch (err) {
                this.$store.commit(
                  'APP_NETWORK_ERROR',
                  err.response && err.response.data.message
                );
              }
            }
          });

          observer.observe(editor.getBody(), {
            childList: true,
            subtree: true,
          });
        },
      },
    };
  },
  head() {
    return {
      title: `Edit - ${this.article.title}`,
    };
  },
  computed: {
    publishedAt() {
      if (this.article.datetime > format(new Date(), 'yyyy-MM-dd HH:mm:ss')) {
        const date = new Date(this.article.datetime.split(' ').join('T'));
        return format(date, 'E, MMM dd, yyyy - hh:mm:ss a');
      }
      return null;
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { mdAndUp: true, smAndDown: false };
    },
  },
  watch: {
    'article.image'(val) {
      if (typeof val === 'string' || val instanceof String) {
        this.image = val;
      }
    },
  },
  created() {
    if (this.article.user.id !== this.$auth.user.id) {
      return this.$router.push(`/posts/${this.$route.params.slug}`);
    }
  },
  async mounted() {
    this.isHydrated = true;
    await this.getTags();
    if (this.article.image) {
      this.image = await this.article.image;
    }
    Object.assign(this.article, { tags: this.article.shared_groups });
    this.$set(
      this.init,
      'skin',
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'oxide-dark'
        : ''
    );
    this.$set(
      this.init,
      'content_css',
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : ''
    );
  },
  methods: {
    // check slug
    async checkSlug() {
      try {
        const { slug } = await this.$axios.$get(
          `api/check-post-slug/${encodeURIComponent(this.article.title)}`
        );

        this.article.slug = slug;
      } catch (e) {
        this.article.slug = null;
      }
    },
    // get tags
    async getTags() {
      try {
        this.tags = await this.$axios.$get(`api/shared-groups`);
      } catch (e) {}
    },
    async onSubmit() {
      await this.publishArticle();
    },
    async publishArticle() {
      this.loading = true;
      try {
        const formData = new FormData();
        const date = new Date(this.article.datetime.split(' ').join('T'));
        this.article.datetime = format(
          new Date(date.toUTCString().substr(0, 25)),
          'yyyy-MM-dd HH:mm:ss'
        );

        formData.append('title', this.article.title);
        formData.append('slug', this.article.slug);
        formData.append('content', this.article.content);
        formData.append('image', this.article.image ? this.article.image : '');
        formData.append('datetime', this.article.datetime);
        formData.append('tags', JSON.stringify(this.article.tags));
        formData.append('asset_ids', JSON.stringify(this.asset_ids));

        await this.$axios.$post(
          `api/user/post/update/${this.article.id}`,
          formData
        );
        this.loading = false;
        this.$store.dispatch('crud_success', {
          message: 'Post successfully updated',
          path: `/posts/${this.$route.params.slug}`,
        });
      } catch (err) {
        this.loading = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
        } else {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        }
      }
    },
  },
};
</script>
