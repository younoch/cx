<template>
  <div id="taxonomyEntry">
    <v-progress-linear v-if="loading" :indeterminate="loading" />
    <validation-observer ref="form" v-slot="{ handleSubmit, invalid, reset }">
      <v-form @reset.prevent="reset" @submit.prevent="handleSubmit(onSubmit)">
        <v-card class="mb-4 rounded-lg" outlined>
          <v-card-title>
            <h4>
              Create
              <span class="text-capitalize">
                {{ $route.params.type }} 
              </span>
            </h4>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <b-text
              v-model="article.title"
              rules="required|min:10|max:180"
              outlined
              label="Title"
              vid="title"
              counter="180"
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
                v-if="isHydrated"
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
        <v-card class="mb-4 rounded-lg" outlined>
          <v-card-title>
            <h4>Cover Image</h4>
          </v-card-title>
          <v-divider />
          <ImageUploader
            @updateImage="article.image = $event"
            @removeImage="article.image = $event"
          />
        </v-card>
        <v-card class="mb-4 rounded-lg" outlined>
          <v-card-title>
            <h4>Tag</h4>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <b-auto-complete
              v-model="article.tags"
              :items="tags"
              rules="required"
              item-text="name"
              item-value="id"
              outlined
              return-object
              multiple
              label="Select Tag"
            />
          </v-card-text>
        </v-card>
        <v-card class="mb-0 mb-md-4 mb-lg-4 mb-xl-4 rounded-lg" outlined>
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
              class="ml-2 text--text px-6"
              rounded
              outlined
              @click="$router.back()"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              :loading="loading"
              color="primary"
              :disabled="invalid"
              rounded
              class="px-6"
            >
              Publish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import { mdiCalendar, mdiPlus, mdiDelete, mdiPencil, mdiClose } from '@mdi/js';

export default {
  name: 'CreateDiscussion',
  components: { Editor },
  data() {
    const defaultForm = Object.freeze({
      title: '',
      slug: '',
      content: '',
      datetime: new Date().toISOString(),
      tags: [],
      status: 'active',
      image: '',
      group: this.$route.params.group,
      subgroup: this.$route.params.slug,
    });

    return {
      isHydrated: false,
      language: 'en',
      article: Object.assign({}, defaultForm),
      dailog_type: 'image',
      mediaDialog: false,
      tags: [],
      assets: [],
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
        'print preview paste  importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons code',
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
        block_unsupported_drop: false,
        paste_data_images: false,
        automatic_uploads: true,
        images_upload_credentials: true,
        images_upload_handler: (blobInfo, success, failure, progress) => {
          if (blobInfo.blob().size <= 10256270) {
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
          } else {
            failure('The file may not be greater than 10240 kilobytes.');
          }
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
              const { location, name } = await this.$axios.$post(
                `/api/common/asset`,
                formData
              );
              this.$store.commit(
                'CRUD_SUCCESS_NO_ACTION',
                'Image Uploaded Successfully'
              );

              // Provide image and alt text for the image dialog
              if (meta.filetype === 'image') {
                callback(location, { alt: name });
              }
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
                  const { location, name } = await this.$axios.$post(
                    `/api/common/asset`,
                    formData
                  );
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
      },
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: this.capitalize(this.$route.params.slug.split('-').join(' ')),
          to: `/cx-brainstorm/${this.$route.params.group}/${this.$route.params.slug}`,
          disabled: false,
          icon: false,
          exact: true,
        },
        {
          text: this.capitalize(this.$route.params.type),
          to: `/`,
          disabled: true,
          icon: false,
          exact: true,
        },
      ];
    },
  },
  async mounted() {
    await this.getTags();
    this.$set(this.init, 'skin', this.$vuetify.theme.dark ? 'oxide-dark' : '');
    this.$set(this.init, 'content_css', this.$vuetify.theme.dark ? 'dark' : '');
    this.isHydrated = true;
  },
  methods: {
    capitalize(str) {
      str = str || '';

      return str.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });
    },
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

        formData.append('type', this.$route.params.type);

        Object.keys(this.article).forEach((key) => {
          if (key !== 'tags') {
            formData.append(key, this.article[key]);
          }
        });
        formData.append('tags', JSON.stringify(this.article.tags));

        await this.$axios.$post(`api/create-post`, formData);
        this.loading = false;
        await this.$store.dispatch('crud_success', {
          message: `Post successfully created`,
          path: `/cx-brainstorm/${this.$route.params.group}/${this.$route.params.slug}`,
        });
        setTimeout(() => {
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });
        }, 1600);
      } catch (err) {
        this.loading = false;
        if (err.response.status === 422) {
          const { errors } = err.response.data;
          this.$refs.form.setErrors(errors);
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response.data.errors.image[0]
          );
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
