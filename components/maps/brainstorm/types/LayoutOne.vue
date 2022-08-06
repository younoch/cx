<template>
  <div>
    <Scrollbar
      id="steps-draggable"
      class="horizontal"
      :suppress-scroll-y="true"
    >
      <div class="zoom-container" :style="{ transform: `scale( ${zoom}` }">
        <draggable
          v-model="steps"
          :group="{ name: 'steps' }"
          filter=".add-step"
          class="row"
          tag="div"
          ghost-class="sortable-ghost"
          chosen-class="sortable-chosen"
          :disabled="user.id !== map.user_id"
          @end="updateStepsOrder"
        >
          <v-col
            v-for="(step, i) in steps"
            :key="i"
            cols="12"
            md="6"
            :lg="stepDialog ? '3' : '6'"
          >
            <v-dialog v-if="stepIndex === i" v-model="stepBoxOpen" width="640">
              <v-card class="rounded-t rounded-b-lg modal-card">
                <validation-observer
                  ref="form"
                  v-slot="{ handleSubmit, reset, invalid }"
                >
                  <v-form
                    @reset.prevent="reset"
                    @submit.prevent="handleSubmit(updateStep(step.id))"
                  >
                    <v-card-title
                      v-if="user.id === map.user_id"
                      class="justify-space-between white--text pa-3 head-title"
                      :style="{ backgroundColor: newStep.color }"
                    >
                      <div class="py-0"></div>
                      <v-spacer />
                      <v-btn icon dark class="ma-0" @click.stop="closeStepBox">
                        <v-icon size="36">{{ mdiClose }}</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-title
                      v-else
                      class="
                        d-flex
                        justify-space-between
                        white--text
                        head-title
                        line-clamp-1
                      "
                      :style="{ backgroundColor: newStep.color }"
                    >
                      {{ newStep.title }}
                      <v-spacer />
                      <v-btn icon dark class="ma-0" @click.stop="closeStepBox">
                        <v-icon>{{ mdiClose }}</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-card-text class="mt-6">
                      <v-row>
                        <v-col v-if="user.id === map.user_id" cols="12">
                          <v-row>
                            <v-col cols="12" class="py-0">
                              <b-text
                                v-model="newStep.title"
                                rules="required|min:1|max:23"
                                outlined
                                label="Title"
                                vid="title"
                                counter="23"
                              />
                              <b-text-area
                                v-model="newStep.description"
                                rules="min:10|max:1200"
                                label="Description"
                                vid="description"
                                outlined
                                counter="1200"
                              />
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col v-else>
                          <p
                            class="text-body-2"
                            v-html="newStep.description"
                          ></p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions v-if="user.id === map.user_id" class="pa-4">
                      <div class="d-flex justify-start align-center">
                        <label for="color" class="mr-4">Color: </label>
                        <v-menu offset-y transition="slide-y-transition">
                          <template #activator="{ on }">
                            <v-btn :color="newStep.color" dark v-on="on">
                            </v-btn>
                          </template>
                          <v-color-picker
                            v-model="newStep.color"
                            value="#7417BE"
                            hide-canvas
                            hide-inputs
                            show-swatches
                            class="mx-auto"
                          ></v-color-picker>
                        </v-menu>
                      </div>
                      <v-spacer />
                      <v-btn outlined @click.stop="closeStepBox">
                        Cancel
                      </v-btn>
                      <v-btn
                        :loading="processing"
                        :disabled="invalid"
                        class="primary ml-4"
                        type="submit"
                        min-width="80"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </v-dialog>
            <!-- start primary  header    -->
            <v-card
              height="252"
              outlined
              class="cursor-move mt-2"
              @click.stop="openStepBox(i)"
            >
              <v-card-title
                class="justify-space-between cx-card__title px-2"
                :style="{
                  backgroundColor: step.color ? step.color : 'primary',
                }"
              >
                <v-menu
                  v-if="step.owner"
                  max-width="300"
                  open-on-hover
                  left
                  offset-x
                >
                  <template #activator="{ on, attrs }">
                    <div class="d-inline" v-bind="attrs" v-on="on">
                      <div
                        class="cx-title"
                        :class="breakpoint.md ? 'font-16' : 'cx-title'"
                      >
                        {{ step.title }}
                      </div>
                    </div>
                  </template>
                  <UserCard
                    set-width="300"
                    :logged-in="loggedIn"
                    :user="step.owner"
                  />
                </v-menu>
                <div v-else :class="breakpoint.md ? 'font-16' : 'cx-title'">
                  <v-tooltip max-width="300" top>
                    <template #activator="{ on, attrs }">
                      <p
                        class="mb-0 text-line-clamp white--text"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ step.title }}
                      </p>
                    </template>
                    <span> {{ step.title }}</span>
                  </v-tooltip>
                </div>
                <v-menu
                  v-if="
                    (loggedIn && user.id === map.user_id) ||
                    (loggedIn && user.role !== 'subscriber')
                  "
                  transition="slide-x-transition"
                  offset-y
                  left
                  :max-width="170"
                  :allow-overflow="true"
                >
                  <template #activator="{ on }">
                    <v-icon color="white" v-on="on">
                      {{ mdiDotsVertical }}
                    </v-icon>
                  </template>
                  <v-list class="pa-0">
                    <template v-if="loggedIn && user.id === map.user_id">
                      <v-list-item ripple @click="openStepBox(i)">
                        <v-list-item-action>
                          <v-icon>
                            {{ mdiPencil }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title> Edit </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        ripple
                        @click="showConfirmDelete(step.id, i)"
                      >
                        <v-list-item-action>
                          <v-icon>
                            {{ mdiDelete }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title> Delete </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <v-list-item
                      v-if="loggedIn && user.role !== 'subscriber'"
                      ripple
                      @click.stop="openCopyDialog(step, map.type, map.group_id)"
                    >
                      <v-list-item-action>
                        <v-icon>
                          {{ mdiContentCopy }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title> Copy </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-subtitle
                class="mt-2 px-3 cursor-pointer"
                :class="breakpoint.md ? 'font-14' : ''"
              >
                <p class="mb-0 line-clamp-8 text--text">
                  {{ step.description }}
                </p>
              </v-card-subtitle>
            </v-card>
            <!-- end primary  header    -->

            <!-- start dynamic card content -->
            <draggable
              :list="step.answers"
              :group="{ name: 'answer' + step.id }"
              tag="section"
              class="answers-draggable"
              filter=".add-answer"
              ghost-class="sortable-ghost"
              chosen-class="sortable-chosen"
              :disabled="user.id !== map.user_id"
              @end="updateAnswersOrder(i, step.answers)"
            >
              <v-card
                v-for="(answer, idx) in step.answers"
                :id="`answerStepCard-${step.id}-${answer.id}`"
                :key="idx"
                class="mt-2 rounded"
                outlined
                @click.prevent="showAnswerModal(step, answer, i, idx)"
              >
                <v-card-text class="answer-box pa-0">
                  <div class="text-line-clamp-1 font-weight-bold my-2 mx-4">
                    {{ answer.title }}
                  </div>
                  <template v-if="answer.type === 'rating'">
                    <user-rated-icon :rating="answer.cover_image" />
                  </template>
                  <template v-else>
                    <div v-if="answer.cover_image" class="flex-grow-1">
                      <media-card
                        :media="{
                          name: 'Cover File',
                          data: answer.cover_image,
                          type: answer.type,
                        }"
                      />
                    </div>
                    <div
                      v-else
                      class="flex-grow-1 px-4 line-clamp-9 text--text"
                      v-html="answer.description"
                    ></div>
                  </template>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <user-reacted-icons :answer="answer" />
                  <v-spacer />
                  <v-icon small left>
                    {{ mdiAttachment }}
                  </v-icon>
                  {{
                    answer.meta.length ? answer.meta.length : '0'
                  }}&nbsp;&nbsp;

                  <v-icon small left>
                    {{ mdiCommentTextOutline }}
                  </v-icon>
                  {{ answer.comments_count }}
                </v-card-actions>
              </v-card>
              <template v-if="loggedIn && user.id === map.user_id">
                <v-card
                  v-if="answerBoxOpen && stepIndex === i"
                  class="add-answer mt-2"
                  outlined
                >
                  <v-card-text class="answer-input">
                    <template v-if="step.type === 'text'">
                      <v-textarea
                        v-model="userAnswer"
                        label="Add text here..."
                        outlined
                        autofocus
                        hide-details
                        rows="5"
                        @keydown.esc="closeAnswerBox"
                      />
                    </template>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn outlined @click.stop="closeAnswerBox">
                      Cancel
                    </v-btn>
                    <v-btn
                      :loading="processing"
                      class="primary"
                      @click.stop="addAnswer(step)"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <!-- start add new card -->
                <v-card
                  v-else
                  class="add-map pa-2 mt-2"
                  outlined
                  @click.stop="showNewAnswerModal(step, i)"
                >
                  <p
                    class="
                      text--grey text--darken-4
                      subtitle-1
                      font-weight-medium
                      mb-0
                    "
                  >
                    <v-icon>
                      {{ mdiPlusCircle }}
                    </v-icon>
                    <!-- {{
                      step.type === 'media'
                        ? 'Add media here...'
                        : step.type === 'text'
                        ? 'Add text here...'
                        : 'Add rating here...'
                    }} -->
                    <span>Add Content e.g., text, video, docs, etc. </span>
                  </p>
                </v-card>
                <!-- end add new card -->
              </template>
            </draggable>
            <!-- end dynamic card content -->
          </v-col>

          <v-col
            v-if="loggedIn && user.id === map.user_id"
            cols="12"
            md="6"
            :lg="stepDialog ? '3' : '6'"
            class="add-step"
          >
            <v-card
              v-if="stepBoxOpen && stepIndex === -1"
              outlined
              class="mt-2"
            >
              <validation-observer
                ref="stepForm"
                v-slot="{ handleSubmit, invalid }"
                tag="div"
              >
                <v-form @submit.prevent="handleSubmit(addStep)">
                  <v-card-text>
                    <p v-if="error" class="red--text caption mb-2">
                      {{ error }}
                    </p>
                    <b-text
                      v-model="newStep.title"
                      label="Title"
                      rules="required|max:23"
                      outlined
                      autofocus
                    />
                    <b-text
                      v-model="newStep.description"
                      rules="required|max:1200"
                      label="Description"
                      outlined
                    />
                    <!-- <v-radio-group v-model="newStep.type" row>
                      <v-radio label="Text" value="text" />
                      <v-radio label="Media" value="media" />
                      <v-radio label="Rating" value="rating" />
                    </v-radio-group> -->
                  </v-card-text>
                  <v-card-actions
                    class="d-flex flex-wrap justify-space-between"
                  >
                    <div class="d-flex justify-start align-center">
                      <label for="color" class="mr-1">Color: </label>
                      <v-menu offset-y transition="slide-y-transition">
                        <template #activator="{ on }">
                          <v-btn
                            min-width="15"
                            :color="newStep.color"
                            dark
                            v-on="on"
                          >
                          </v-btn>
                        </template>
                        <v-color-picker
                          v-model="newStep.color"
                          value="#7417BE"
                          hide-canvas
                          hide-inputs
                          show-swatches
                          class="mx-auto"
                        ></v-color-picker>
                      </v-menu>
                    </div>
                    <v-btn min-width="40" outlined @click.stop="closeStepBox">
                      Cancel
                    </v-btn>
                    <v-btn
                      min-width="40"
                      :disabled="
                        invalid ||
                        newStep.title.length > 23 ||
                        newStep.title.length == 0
                      "
                      :loading="processing"
                      class="primary ml-0"
                      type="submit"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>
            <v-card
              v-else
              outlined
              class="mt-2"
              @click.prevent="openStepBox(-1)"
            >
              <v-card-title>
                <v-icon left>
                  {{ mdiPlusCircle }}
                </v-icon>
                Add step
              </v-card-title>
            </v-card>
          </v-col>
        </draggable>
      </div>
    </Scrollbar>
    <!-- upload video dialog -->
    <v-dialog
      v-model="addVideoDialog"
      max-width="500"
      width="500"
      :scrollable="false"
    >
      <v-card>
        <v-card-title class="justify-space-between primary white--text">
          Add video to your journey
          <v-btn icon dark class="ma-0" @click.stop="addVideoDialog = false">
            <v-icon>{{ mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-6">
          <p v-if="videoError" class="red--text font-14 mb-2 pl-3">
            This field is required.
          </p>
          <b-text
            v-model="videoLink"
            rules="required|url"
            vid="video_link"
            label="Video Link"
            outlined
            autofocus
            class="w-100"
            placeholder="Supported YouTube, Vimeo, DailyMotion, Coub"
            @keydown.enter="addVideo"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="primary" @click.stop="addVideo"> Add Video </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- answer dialog -->
    <v-row justify="center">
      <v-dialog
        v-model="answerDialog"
        attach="#singleBrainstormMap"
        content-class="answer-dialog"
        scrollable
        :height="$vuetify.breakpoint.xlOnly ? 600 : 400"
      >
        <v-card v-if="activeStep">
          <!-- model title -->
          <v-card-title class="justify-space-between py-2 primary white--text">
            <div>
              <v-btn
                v-if="
                  activeAnswer.title &&
                  isCreateAnswer &&
                  loggedIn &&
                  user.id === map.user_id
                "
                type="submit"
                :loading="processing"
                class="
                  px-6
                  text-capitalize
                  rounded-pill
                  body-1
                  font-weight-medium
                  text--primary
                "
                elevation="0"
                :disabled="
                  activeAnswer.title.length < 10 ||
                  activeAnswer.title.length > 180
                "
                height="32"
                width="110"
                left
                @click="addAnswer(activeStep)"
              >
                Create
              </v-btn>
              <v-btn
                v-if="
                  activeAnswer.title &&
                  !isCreateAnswer &&
                  loggedIn &&
                  user.id === map.user_id
                "
                type="submit"
                :loading="processing"
                class="
                  px-6
                  text-capitalize
                  rounded-pill
                  body-1
                  font-weight-medium
                  text--primary
                "
                elevation="0"
                :disabled="
                  activeAnswer.title.length < 10 ||
                  activeAnswer.title.length > 180
                "
                height="32"
                width="110"
                left
                @click="updateAnswer"
              >
                Update
              </v-btn>
            </div>
            <div>
              <v-btn
                v-if="!isCreateAnswer && loggedIn && user.id === map.user_id"
                color="pink"
                icon
                dark
                class="ma-0"
                :loading="deletingAnswer"
                @click.stop="confirmDeleteAnswer"
              >
                <v-icon>{{ mdiDelete }}</v-icon>
              </v-btn>
              <v-btn icon dark class="ma-0" @click="closeAnswerDialog">
                <v-icon>{{ mdiClose }}</v-icon>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text class="pa-3">
            <template v-if="loggedIn && user.id === map.user_id">
              <!-- <template v-if="activeStep.type === 'text'">
                <v-textarea
                  v-model="activeAnswer.answer"
                  label="Add Text"
                  outlined
                  autofocus
                  hide-details
                  @keydown.enter="addAnswer(activeStep)"
                />
              </template> -->

              <!-- new design start  -->
              <v-row>
                <v-col v-if="true" cols="12">
                  <validation-observer ref="form">
                    <v-form>
                      <v-row>
                        <v-col cols="12" class="py-0 mt-3">
                          <b-text
                            v-model="activeAnswer.title"
                            rules="required|min:10|max:180"
                            outlined
                            label="Title"
                            vid="title"
                            counter="180"
                          />
                          <client-only>
                            <medium-editor
                              :text="activeAnswer.description"
                              :options="options"
                              data-placeholder="Description"
                              @edit="getDescription"
                            />
                          </client-only>
                        </v-col>
                      </v-row>
                      <rating-pane
                        v-if="ratingPane"
                        :answer="activeAnswer"
                        @answerUpdated="answerUpdated"
                      ></rating-pane>

                      <v-row>
                        <v-col
                          cols="12"
                          class="d-flex justify-space-around flex-wrap"
                        >
                          <v-btn
                            text
                            ripple
                            class="text-capitalize mx-md-0 my-md-0 mx-2 my-4"
                            elevation="1"
                            width="150"
                            @click="toggleRatingPane()"
                          >
                            <v-icon color="orange accent-2" left size="24">{{
                              mdiEmoticonOutline
                            }}</v-icon>
                            Emotions
                          </v-btn>

                          <label
                            class="mx-md-0 my-md-0 mx-2 my-4"
                            for="uploadImage"
                          >
                            <v-btn
                              text
                              class="text-capitalize"
                              elevation="1"
                              width="150"
                              @click="$refs.uploadImage.click()"
                            >
                              <v-icon color="blue darken-2" left size="24">{{
                                mdiImageArea
                              }}</v-icon>
                              Photo
                            </v-btn>
                            <input
                              id="uploadImage"
                              ref="uploadImage"
                              type="file"
                              class="d-none"
                              accept="image/*"
                              width="150"
                              @change="uploadImage"
                            />
                          </label>

                          <v-btn
                            text
                            class="text-capitalize mx-md-0 my-md-0 mx-2 my-4"
                            elevation="1"
                            width="150"
                            @click="addVideoDialog = true"
                          >
                            <v-icon color="orange accent-2" left size="24">{{
                              mdiPlayBoxOutline
                            }}</v-icon>
                            Video
                          </v-btn>

                          <label
                            class="mx-md-0 my-md-0 mx-2 my-4"
                            for="uploadDocument"
                          >
                            <v-btn
                              text
                              class="text-capitalize"
                              width="150"
                              elevation="1"
                              @click="$refs.uploadDocument.click()"
                            >
                              <v-icon
                                color="blue-grey darken-2"
                                left
                                size="24"
                                >{{ mdiFileDocument }}</v-icon
                              >
                              Document
                            </v-btn>
                            <input
                              id="uploadDocument"
                              ref="uploadDocument"
                              type="file"
                              class="d-none"
                              width="150"
                              accept=".pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx"
                              @change="uploadDocument"
                            />
                          </label>
                        </v-col>
                      </v-row>
                    </v-form>
                  </validation-observer>
                </v-col>
                <v-col v-else>
                  <p class="text-body-2" v-html="activeAnswer.description"></p>
                </v-col>
              </v-row>

              <!-- new design end  -->
            </template>

            <template v-else>
              <template v-if="activeStep.type === 'text'">
                {{ activeAnswer.answer }}
              </template>
              <template v-if="activeStep.type === 'rating'">
                <user-rated-icon
                  v-if="activeAnswer.rating"
                  :rating="activeAnswer.rating.data"
                />
              </template>
              <template v-if="activeStep.type === 'media'">
                <div
                  class="files"
                  @click="openMediaDialogModal(activeAnswer.meta)"
                >
                  <v-card
                    v-for="(file, fileIndex) in activeAnswer.meta"
                    :key="fileIndex + '-file'"
                    class="
                      d-flex
                      justify-center
                      align-center
                      relative
                      cx__media-user-view
                      ma-1
                      w-150
                    "
                  >
                    <template v-if="file.type === 'image'">
                      <v-img :src="file.data" aspect-ratio="1.5" />
                    </template>
                    <template v-if="file.type === 'document'">
                      <v-card-text class="pa-0">
                        <div class="d-flex flex-column white">
                          <div
                            class="message__file-ext py-10"
                            :class="'file-' + getFileExtension(file.name)"
                          >
                            <span>{{ getFileExtension(file.name) }}</span>
                          </div>
                          <div class="message__file-name py-2">
                            <span>{{ file.name }}</span>
                          </div>
                        </div>
                      </v-card-text>
                    </template>
                    <template v-if="file.type === 'video'">
                      <client-only>
                        <video-embed :src="file.data" />
                      </client-only>
                    </template>
                  </v-card>
                </div>
              </template>
            </template>

            <!-- documents  -->
            <v-row>
              <v-col
                v-for="(meta, metaIndex) in activeAnswer.meta"
                :key="metaIndex"
                cols="12"
                md="4"
              >
                <AnswerDocuments
                  v-if="meta.type !== 'rating'"
                  :answer="activeAnswer"
                  :meta-index="metaIndex"
                  :map-user-id="map.user_id"
                  :meta="meta"
                  @delete-attachment="removeAttachment"
                  @updateMakeCover="answerUpdated"
                  @removeCover="answerUpdated"
                />
              </v-col>
            </v-row>

            <!-- Reactions & comments count with  update button -->
            <div
              v-if="!isCreateAnswer"
              class="d-flex justify-space-between align-center my-2"
            >
              <reacted-icons-with-comment :answer="activeAnswer" />
            </div>

            <!-- <v-divider /> -->
            <!-- Reaction actions -->
            <div v-if="!isCreateAnswer" class="d-flex mt-2">
              <answer-reaction
                :active-answer="activeAnswer"
                :react-icon="mdiThumbUpOutline"
                url="api/brainstorm/map/steps/answers"
                @update="updateReaction($event)"
                @delete="deleteReaction($event)"
              />
              <v-btn text ripple depressed @click="toggleCommentBox">
                <v-icon left>
                  {{ mdiCommentTextOutline }}
                </v-icon>
                comemnts
              </v-btn>
            </div>

            <!-- comments -->
            <transition name="fade">
              <comment-list
                v-if="activeAnswer.showComment"
                id="comment-list"
                :post-id="activeAnswer.id"
                :post-index="answerIndex"
                endpoint="api/brainstorm/map/steps/answers/comments"
                @comments-count-updated="commentsCountUpdated"
                @scroll-down-answer="scrollDownAnswer"
              />
            </transition>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- toster popup for is comfirm to action -->
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import {
  mdiClose,
  mdiPencil,
  mdiDelete,
  mdiPlusCircle,
  mdiAttachment,
  mdiDotsVertical,
  mdiCommentTextOutline,
  mdiFileImage,
  mdiPlayBoxOutline,
  mdiFileDocument,
  mdiEmoticonAngryOutline,
  mdiEmoticonConfusedOutline,
  mdiEmoticonNeutralOutline,
  mdiEmoticonExcitedOutline,
  mdiEmoticonHappyOutline,
  mdiContentCopy,
  mdiThumbUpOutline,
  mdiFileExcelBoxOutline,
  mdiEmoticonOutline,
  mdiImageArea,
} from '@mdi/js';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import CommentList from '~/components/comment/List.vue';

export default {
  name: 'LayoutOne',
  components: {
    draggable,
    CommentList,
  },
  props: {
    stepDialog: {
      type: Boolean,
      default: false,
    },
    zoom: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      isHydrated: false,
      isCreateAnswer: false,
      tempDescription: '',
      tempAnswer: '',
      error: null,
      updating: false,
      stepBoxOpen: false,
      stepIndex: -1,
      processing: false,
      ratingPane: false,
      newStep: {
        title: '',
        description: '',
        type: 'text',
        ordering: 0,
        color: '#58c6e2',
      },
      defaultStep: {
        title: '',
        description: '',
        type: 'text',
        ordering: 0,
        color: '#58c6e2',
      },
      options: {
        toolbar: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'anchor',
            'h1',
            'h2',
            'h3',
            'quote',
          ],
        },
      },
      answerBoxOpen: false,
      userAnswer: '',
      answerDialog: false,
      activeStep: null,
      activeAnswer: null,
      deletingAnswer: false,

      files: [],
      addVideoDialog: false,
      videoError: false,
      videoLink: '',
      ratingValue: null,
      mdiClose,
      mdiPencil,
      mdiDelete,
      mdiPlusCircle,
      mdiAttachment,
      mdiDotsVertical,
      mdiCommentTextOutline,
      mdiFileImage,
      mdiPlayBoxOutline,
      mdiFileDocument,
      mdiEmoticonAngryOutline,
      mdiEmoticonConfusedOutline,
      mdiEmoticonNeutralOutline,
      mdiEmoticonExcitedOutline,
      mdiEmoticonHappyOutline,
      mdiContentCopy,
      mdiThumbUpOutline,
      mdiFileExcelBoxOutline,
      mdiEmoticonOutline,
      mdiImageArea,
    };
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    ...mapState('map', ['map']),
    steps: {
      get() {
        return JSON.parse(JSON.stringify(this.$store.state.map.steps));
      },
      set(value) {
        this.$store.commit('map/UPDATED_STEPS', value);
      },
    },
    breakpoint() {
      return this.isHydrated
        ? this.$vuetify.breakpoint
        : { smAndUp: true, xsOnly: false };
    },
  },
  watch: {
    answerDialog(val) {
      if (val === false) {
        this.closeAnswerDialog();
      }
    },
  },
  mounted() {
    this.isHydrated = true;
    const answerId = this.$route.query.answerId;
    const stepId = this.$route.query.stepId;
    if (answerId && stepId) {
      const el = document.getElementById(
        `answerStepCard-${stepId}-${answerId}`
      );
      if (el) {
        el.click();
        this.toggleCommentBox();
      }
    }
  },
  methods: {
    // helper to truncate text
    subStrText(str, limit = 20) {
      return str && str.length > limit ? str.substr(0, limit) + '...' : str;
    },
    // GET answer description
    getDescription(event) {
      this.activeAnswer.description = event.api.origElements.innerHTML;
    },

    // update step order
    async updateStepsOrder() {
      if (
        this.map.user_id === this.user.id ||
        this.user.role !== 'subscriber'
      ) {
        this.updating = true;
        const mapId = this.map.id;
        const steps = this.steps;
        try {
          await this.$store.dispatch('map/updateStepsOrder', { mapId, steps });
          this.updating = false;
          this.closeAnswerBox();
        } catch (error) {
          this.updating = false;
        }
      }
    },
    // open new step add form
    openStepBox(stepIndex) {
      this.isCreateAnswer = false;
      this.stepBoxOpen = true;
      this.stepIndex = stepIndex;
      if (stepIndex > -1) {
        this.newStep = Object.assign({}, this.map.steps[stepIndex]);
        this.newStep.color = this.map.steps[stepIndex].color;
      }
    },
    // close new step add form
    closeStepBox() {
      this.stepIndex = -1;
      this.stepBoxOpen = false;
      this.newStep = Object.assign({}, this.defaultStep);
      this.error = null;
    },
    // add new step
    async addStep() {
      this.processing = true;
      try {
        await this.$store.dispatch('map/addStep', this.newStep);
        this.processing = false;
        this.closeStepBox();
      } catch (error) {
      } finally {
        this.processing = false;
      }
    },
    // update step
    async updateStep(stepId) {
      this.processing = true;
      const payload = {
        newStep: this.newStep,
        stepId,
        index: this.stepIndex,
      };
      try {
        await this.$store.dispatch('map/updateStep', payload);
        this.processing = false;
        this.closeStepBox();
      } catch (error) {
        this.processing = false;
      }
    },
    // show confirm dialog
    showConfirmDelete(stepId, index) {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deleteStep(stepId, index);
          }
          return false;
        });
    },

    // delete step title
    async deleteStep(stepId, index) {
      try {
        await this.$store.dispatch('map/deleteStep', { stepId, index });
      } catch (e) {}
    },
    // open answer dialog
    showAnswerModal(step, answer, stepIndex, answerIndex) {
      this.activeStep = Object.assign({}, step);
      this.activeAnswer = Object.assign({}, answer, { showComment: false });
      this.files = answer.meta;
      this.stepIndex = stepIndex;
      this.answerIndex = answerIndex;
      if (answer.rating) {
        this.ratingPane = true;
      }
      setTimeout(() => (this.answerDialog = true), 100);
    },
    showNewAnswerModal(step, stepIndex) {
      this.activeStep = Object.assign({}, step);
      this.activeAnswer = Object.assign(
        {},
        {
          description: '',
          meta: [],
          answer: '',
          settings: { metaAttachmentId: 0 },
        }
      );
      this.files = this.activeAnswer.meta;
      this.stepIndex = stepIndex;
      this.isCreateAnswer = true;
      this.stepBoxOpen = false;
      setTimeout(() => (this.answerDialog = true), 100);
    },
    // close answer dialog
    closeAnswerDialog() {
      this.activeAnswer = null;
      this.activeStep = null;
      this.files = [];
      this.stepIndex = -1;
      this.answerIndex = -1;
      this.answerDialog = false;
      this.ratingPane = false;
      this.isCreateAnswer = false;
    },
    // open new Answer title box
    openAnswerBox(index) {
      this.answerBoxOpen = true;
      this.stepIndex = index;
    },
    // close answer box
    closeAnswerBox() {
      this.userAnswer = '';
      this.files = [];
      this.stepIndex = -1;
      this.answerBoxOpen = false;
    },

    // add new Answer
    async addAnswer(step) {
      if (this.activeAnswer.title) {
        this.processing = true;
        const stepIndex = this.stepIndex;
        this.tempDescription = this.activeAnswer.description;
        this.tempAnswer = this.activeAnswer.answer;
        const newAnswer = {
          map_id: this.map.id,
          step_id: step.id,
          type: step.type,
          title: this.activeAnswer.title,
        };
        try {
          await this.$store.dispatch('map/addAnswer', { newAnswer, stepIndex });
          this.isCreateAnswer = false;
          this.answerIndex = this.steps[stepIndex].answers.length - 1;
          this.activeAnswer = Object.assign(
            {},
            this.steps[stepIndex].answers[this.answerIndex],
            this.activeAnswer
          );
          await this.updateAnswer();
          if (this.activeAnswer.rating) {
            await this.rateAnswer();
          }
        } catch (err) {
          this.$store.commit(
            'APP_NETWORK_ERROR',
            err.response && err.response.data.message
          );
        } finally {
          this.processing = false;
          this.activeAnswer = Object.assign(
            {},
            this.steps[this.stepIndex].answers[this.answerIndex]
          );
        }
      }
    },
    // update answer
    async updateAnswer() {
      this.processing = true;
      const answerId = this.activeAnswer.id;
      const stepIndex = this.stepIndex;
      const answerIndex = this.answerIndex;
      const editAnswer = {
        map_id: this.map.id,
        title: this.activeAnswer.title,
        description: this.isCreateAnswer
          ? this.tempDescription
          : this.activeAnswer.description,
        files: this.files,
      };

      try {
        await this.$store.dispatch('map/updateAnswer', {
          editAnswer,
          answerId,
          stepIndex,
          answerIndex,
        });
        this.processing = false;
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      } finally {
        this.processing = false;
        this.activeAnswer = Object.assign(
          {},
          this.steps[this.stepIndex].answers[this.answerIndex]
        );
      }
    },
    // update make cover
    answerUpdated(event) {
      this.$store.commit('map/UPDATE_ANSWER', {
        answer: event,
        stepIndex: this.stepIndex,
        answerIndex: this.answerIndex,
      });
      this.activeAnswer = Object.assign({}, this.activeAnswer, event);
    },
    async rateAnswer() {
      try {
        await this.$axios.$post(
          `api/brainstorm/map/steps/answers/rating/${this.activeAnswer.id}`,
          {
            value: this.activeAnswer.rating.data,
          }
        );
        this.answerUpdated(this.activeAnswer);
        this.closeAnswerDialog();
      } catch (err) {
        this.$store.commit(
          'APP_NETWORK_ERROR',
          err.response && err.response.data.message
        );
      }
    },
    // delete answer confirm
    confirmDeleteAnswer() {
      this.$refs.confirm
        .open('Delete', 'Are you sure?', { color: 'red' })
        .then((res) => {
          if (res) {
            this.deleteAnswer();
          }
          return false;
        });
    },
    // delete answer
    async deleteAnswer() {
      this.deletingAnswer = true;
      const answerId = this.activeAnswer.id;
      const stepIndex = this.stepIndex;
      const answerIndex = this.answerIndex;
      try {
        await this.$store.dispatch('map/deleteAnswer', {
          answerId,
          answerIndex,
          stepIndex,
        });
        this.deletingAnswer = false;
      } catch (error) {
        this.deletingAnswer = false;
      }
    },
    // upadate answers order
    async updateAnswersOrder(stepIndex, answers) {
      await this.$store.dispatch('map/updateAnswersOrder', {
        mapId: this.map.id,
        stepIndex,
        answers,
      });
    },

    // Toggle Rate Pane
    toggleRatingPane() {
      this.ratingPane = !this.ratingPane;
    },

    // upload image
    uploadImage(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.files.push({
          data: reader.result,
          type: 'image',
          name: file.name,
        });
      };
      this.$refs.uploadImage.value = '';
    },
    // upload document
    uploadDocument(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.files.push({
          data: reader.result,
          type: 'document',
          name: file.name,
        });
      };
    },
    // upload video
    addVideo() {
      if (this.videoLink) {
        this.files.push({
          type: 'video',
          data: this.videoLink,
          name: 'A Video Attachment',
        });
        this.addVideoDialog = false;
        this.videoLink = '';
        this.videoError = false;
      } else {
        this.videoError = true;
      }
    },
    // remove attachment
    removeAttachment(fileIndex) {
      this.files.splice(fileIndex, 1);
    },

    // copy map event sender
    openCopyDialog(step, mapType, subGroupId) {
      this.$emit('copy-step', {
        step,
        mapType,
        subGroupId,
        group: this.$route.params.group,
      });
    },
    updateReaction(event) {
      const reactIndex = this.activeAnswer.reaction_count.findIndex(
        (_) => _.user_id === event.user_id
      );

      const reactData = {
        answer_id: event.answerId,
        type: event.reaction,
        user_id: event.user_id,
      };
      // Reactivity for child components
      if (reactIndex > -1) {
        this.activeAnswer.reaction_count.splice(reactIndex, 1, reactData);
      } else {
        this.activeAnswer.reaction_count.push(reactData);
        this.activeAnswer.reactions_count++;
      }

      this.$emit('update-reaction', {
        stepIndex: this.stepIndex,
        answerIndex: this.answerIndex,
        reactIndex,
        reactData,
      });
    },
    deleteReaction(event) {
      const reactIndex = this.activeAnswer.reaction_count.findIndex(
        (_) => _.user_id === event.user_id
      );
      // Reactivity for child components
      if (reactIndex > -1) {
        this.activeAnswer.reaction_count.splice(reactIndex, 1);
        this.activeAnswer.reactions_count--;
      }

      this.$emit('delete-reaction', {
        stepIndex: this.stepIndex,
        answerIndex: this.answerIndex,
        reactIndex,
      });
    },
    // toggle comment box
    toggleCommentBox() {
      this.activeAnswer.showComment = !this.activeAnswer.showComment;
    },
    // To Display loaded comments and replies in viewport
    scrollDownAnswer(length, isLoadReplies) {
      const commentList = document.getElementById('comment-list');
      const getCommentlisSrollPosition = isLoadReplies
        ? commentList.scrollTop
        : commentList.clientHeight;
      commentList.style.minHeight = `${getCommentlisSrollPosition + length}px`;
      commentList.scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
    // update comments count
    commentsCountUpdated(payload) {
      this.activeAnswer.comments_count =
        this.activeAnswer.comments_count + payload.count;
      this.$store.commit('map/UPDATED_COMMENTS', {
        ...payload,
        stepIndex: this.stepIndex,
      });
    },
    openMediaDialogModal(contents) {
      this.$emit('openAnswerMediaDialogModal', {
        isImageDialogOpen: true,
        contents,
        active: 0,
      });
    },
    getFileExtension(filename) {
      const extension = filename.split('.');
      return extension[extension.length - 1];
    },
  },
};
</script>
