<template>
  <v-app id="app">
    <AppBar v-model="drawer" />
    <v-navigation-drawer
      v-if="breakpoint.mdAndDown"
      v-model="drawer"
      fixed
      app
      width="220"
      style="z-index: 201"
    >
      <v-toolbar class="secondary">
        <v-img
          src="/logo-dark.svg"
          width="100%"
          height="100%"
          contain
          :alt="title"
        />
      </v-toolbar>
      <div>
        <v-btn
          text
          block
          class="mt-0 justify-start"
          style="min-height: 50px"
          :class="
            $route.name === 'feed' || $route.name === 'index'
              ? 'v-btn--active'
              : ''
          "
          @click="goToFeedPage"
        >
          <div class="d-flex align-center menu-item">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25.02 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" x="0.01" width="25" height="25" />
                  <path
                    id="Path_4"
                    data-name="Path 4"
                    class="cls-2"
                    d="M12.51,5.23l6.26,5.63v9.77h-2.5v-7.5H8.76v7.5H6.26V10.86l6.25-5.63m0-3.37L0,13.13H3.75v10h7.51V15.63h2.5v7.51h7.51v-10H25Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Home
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/cx-brainstorm"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center menu-item">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <g id="Group_409" data-name="Group 409">
                    <g id="Group_408" data-name="Group 408">
                      <path
                        id="Path_8"
                        data-name="Path 8"
                        class="cls-2"
                        d="M17.79,5.87l-1.38.55a4.34,4.34,0,0,0-.93-.54l-.21-1.47A.28.28,0,0,0,15,4.18H12.77a.27.27,0,0,0-.27.24l-.2,1.47a3.64,3.64,0,0,0-.93.54L10,5.87A.27.27,0,0,0,9.65,6L8.55,7.91a.27.27,0,0,0,.06.36l1.18.92a3.33,3.33,0,0,0-.07.54,3.29,3.29,0,0,0,0,.54l-1.17.92a.25.25,0,0,0-.07.34l1.11,1.93a.27.27,0,0,0,.34.12L11.36,13a4,4,0,0,0,.94.54L12.49,15a.29.29,0,0,0,.28.23H15a.28.28,0,0,0,.28-.23l.21-1.47a4.34,4.34,0,0,0,.93-.54l1.37.55a.25.25,0,0,0,.33-.12l1.11-1.93a.26.26,0,0,0-.07-.35L18,10.27a3.67,3.67,0,0,0,0-1.08l1.18-.92a.28.28,0,0,0,.07-.36L18.14,6A.29.29,0,0,0,17.79,5.87Zm-3.91,5.84a2,2,0,1,1,2-2,2,2,0,0,1-2,2Z"
                      />
                      <path
                        id="Path_9"
                        data-name="Path 9"
                        class="cls-2"
                        d="M23.51,8.42A9.8,9.8,0,0,0,14.45,0a5.33,5.33,0,0,0-.57,0A9.69,9.69,0,0,0,4.29,8.34L1.61,13.17a1.38,1.38,0,0,0,.46,1.9,1.42,1.42,0,0,0,.72.2H4.18v2.78A2.78,2.78,0,0,0,7,20.82H8.34V25H18V18.49A9.73,9.73,0,0,0,23.51,8.42Zm-7,7.73-1.23.58v5.48H11.11V18.05H7V12.5H5.15L7,9.27a6.92,6.92,0,1,1,9.51,6.88Z"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              CX Brainstorm
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/topics/digital-transformation"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <g id="Group_406" data-name="Group 406">
                    <path
                      id="Path_5"
                      data-name="Path 5"
                      class="cls-2"
                      d="M21.63,13.23C19.72,8.26,12.9,8,14.54.76A.61.61,0,0,0,14.09,0a.57.57,0,0,0-.46.07C9.2,2.7,6,7.93,8.69,14.78a.6.6,0,0,1-.91.72A6,6,0,0,1,5.54,9.71.62.62,0,0,0,5,9a.62.62,0,0,0-.57.26,11.38,11.38,0,0,0-1.67,6.4,9.81,9.81,0,0,0,8.3,9.2,10.44,10.44,0,0,0,8.47-2.28A8.42,8.42,0,0,0,21.63,13.23ZM10.32,19.36a3.76,3.76,0,0,0,2.9-2.81c.4-1.75-1.17-3.45-.11-6.21.4,2.28,4,3.71,4,6.2C17.19,19.62,13.85,22.27,10.32,19.36Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Hot Topics
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/my-network"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <path
                    class="cls-2"
                    d="M17,21.59h-6.6A1.17,1.17,0,0,1,9.1,20.25a6.75,6.75,0,0,1,5.79-6.52,14.4,14.4,0,0,1,4.9.11,6.76,6.76,0,0,1,5.13,5.58c0,.28.06.56.08.85a1.15,1.15,0,0,1-1.26,1.32c-1.73,0-3.45,0-5.17,0Z"
                  />
                  <path
                    class="cls-2"
                    d="M6.82,12.5a4.55,4.55,0,1,1,4.55-4.56A4.55,4.55,0,0,1,6.82,12.5Z"
                  />
                  <path
                    class="cls-2"
                    d="M17,12.5A4.55,4.55,0,1,1,21.6,7.93,4.56,4.56,0,0,1,17,12.5Z"
                  />
                  <path
                    class="cls-2"
                    d="M9.48,14C7.25,16.61,6.54,18.78,7,21.59H1.46C.38,21.59,0,21.2,0,20.11a6.25,6.25,0,0,1,2.74-5.35,6,6,0,0,1,3.2-1.11A8.6,8.6,0,0,1,9.36,14Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              My Network
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/messaging"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <path
                    id="Path_2074"
                    data-name="Path 2074"
                    class="cls-2"
                    d="M2.5,2.5h20v15H4L2.5,19V2.5M2.5,0A2.49,2.49,0,0,0,0,2.5V25l5-5H22.5A2.5,2.5,0,0,0,25,17.5V2.5A2.5,2.5,0,0,0,22.5,0ZM5,12.5H20V15H5ZM5,8.75H20v2.5H5ZM5,5H20V7.5H5Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Messaging
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/images"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <path
                    class="cls-2"
                    d="M25,20.68a4.36,4.36,0,0,1-.21.64,2.26,2.26,0,0,1-2,1.35H2.68c0-.1.08-.13.13-.18L10,15.31c.13-.13.2-.16.34,0,.78.8,1.58,1.59,2.37,2.38a.75.75,0,0,0,1.19,0l5.5-5.51c.14-.13.2-.15.35,0l5.08,5.09.18.15Z"
                  />
                  <path
                    class="cls-2"
                    d="M24.89,3.8a2.4,2.4,0,0,0-2.32-1.48H2.45a2.78,2.78,0,0,0-.58.06A2.27,2.27,0,0,0,0,4.38C0,4.6,0,4.82,0,5,0,10.19,0,15.34,0,20.5a2.16,2.16,0,0,0,.7,1.6c.23.22.31.2.53,0a1.7,1.7,0,0,0,.19-.19l8.09-8.08a.76.76,0,0,1,1.28,0c.7.74,1.43,1.45,2.15,2.17.34.34.36.34.7,0l5.26-5.26c.54-.54.79-.54,1.32,0q2.22,2.23,4.45,4.45c.09.09.16.23.33.22v-11C24.94,4.2,25,4,24.89,3.8ZM6.25,11.7A3.08,3.08,0,1,1,9.33,8.61,3.1,3.1,0,0,1,6.25,11.7Z"
                  />
                  <path
                    class="cls-2"
                    d="M6.23,7A1.62,1.62,0,1,1,4.62,8.62,1.64,1.64,0,0,1,6.23,7Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Images
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/videos"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <path
                    class="cls-2"
                    d="M0,7.56A3.1,3.1,0,0,1,.57,6.23a2.62,2.62,0,0,1,2-1.07c.51,0,1,0,1.54,0H14a2.7,2.7,0,0,1,2.62,1.6A2.78,2.78,0,0,1,16.88,8v9a2.74,2.74,0,0,1-2.29,2.8,2.19,2.19,0,0,1-.51,0H2.78A2.72,2.72,0,0,1,.07,17.72c0-.09,0-.2-.07-.28Z"
                  />
                  <path
                    class="cls-2"
                    d="M25,12.51c0,1.39,0,2.78,0,4.17a1.63,1.63,0,0,1-2.1,1.6,2.48,2.48,0,0,1-.44-.2l-4-2.31a.3.3,0,0,1-.18-.3c0-2,0-4,0-6a.27.27,0,0,1,.14-.28c1.38-.79,2.76-1.6,4.15-2.39a1.62,1.62,0,0,1,2.38.94,1.79,1.79,0,0,1,.09.6C25,9.75,25,11.13,25,12.51Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Videos
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          text
          to="/documents"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <div class="d-flex align-center">
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              class="mr-2"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: var(--color-heading);
                    opacity: 0;
                  }
                  .cls-2 {
                    fill: var(--color-heading);
                  }
                </style>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <rect class="cls-1" width="25" height="25" />
                  <path
                    class="cls-2"
                    d="M6.3,25a3.05,3.05,0,0,1-.46-.2,1.37,1.37,0,0,1-.67-1.22c0-.62,0-.62.6-.62H18.31a2.17,2.17,0,0,0,2.08-1.22,2.35,2.35,0,0,0,.22-1.14V3.13c0-.23,0-.33.28-.29a2.54,2.54,0,0,0,.39,0,1.37,1.37,0,0,1,1.43,1.3,2.45,2.45,0,0,1,0,.27q0,9.51,0,19a1.43,1.43,0,0,1-.8,1.42,2.13,2.13,0,0,1-.35.14Z"
                  />
                  <path
                    class="cls-2"
                    d="M7.82,2.55V4.31A1.18,1.18,0,0,1,6.59,5.56c-1.21,0-2.42,0-3.63,0A.59.59,0,0,1,2.53,4.5L6.74.29a.61.61,0,0,1,.72-.2.61.61,0,0,1,.36.65C7.81,1.35,7.82,2,7.82,2.55Z"
                  />
                  <path
                    class="cls-2"
                    d="M19.83,1.5A1.39,1.39,0,0,0,18.34,0H8.82c-.2,0-.23.06-.23.24,0,1.35,0,2.7,0,4.05a2,2,0,0,1-2.09,2h-4c-.2,0-.24.06-.24.25,0,1.88,0,3.77,0,5.66v8.34a1.41,1.41,0,0,0,1.59,1.58H18.26a2.32,2.32,0,0,0,.46,0,1.38,1.38,0,0,0,1.11-1.48V1.5Zm-8.59,16H6.61a.68.68,0,0,1-.75-.66.67.67,0,0,1,.73-.65h4.66a.66.66,0,1,1,0,1.31Zm4.89-3.33H6.62a.68.68,0,0,1-.76-.65.67.67,0,0,1,.57-.65h9.68a.65.65,0,0,1,.69.7A.66.66,0,0,1,16.13,14.15Zm0-3.54H6.57a.65.65,0,0,1-.18-1.28,1.1,1.1,0,0,1,.26,0H16c.47,0,.77.23.78.62A.64.64,0,0,1,16.14,10.61Z"
                  />
                </g>
              </g>
            </svg>
            <h4
              class="text-capitalize heading--text pl-5"
              style="font-weight: 500"
            >
              Documents
            </h4>
          </div>
        </v-btn>
        <v-divider />
        <v-btn
          v-if="loggedIn"
          text
          to="/notifications"
          exact
          nuxt
          block
          class="mt-0 justify-start"
          style="min-height: 60px"
        >
          <client-only>
            <div class="d-flex align-center">
              <template v-if="unreadCount > 0">
                <v-badge color="red" :content="unreadCount" overlap>
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 25 25"
                    class="mr-2"
                  >
                    <defs>
                      <style>
                        .cls-1 {
                          fill: var(--color-heading);
                          opacity: 0;
                        }
                        .cls-2 {
                          fill: var(--color-heading);
                        }
                      </style>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <rect class="cls-1" width="25" height="25" />
                        <path
                          class="cls-2"
                          d="M12.75,0c0,.07.09.05.14.07a1,1,0,0,1,.65,1c0,.33,0,.65,0,1,0,.13,0,.18.17.2a7.29,7.29,0,0,1,6,5.82,8.44,8.44,0,0,1,.13,1.5c0,1.1-.06,2.2,0,3.3a6.78,6.78,0,0,0,2.32,4.68,2,2,0,0,1,.76,1.32,1.83,1.83,0,0,1-1.8,2H4.05A1.86,1.86,0,0,1,2.4,20a1.8,1.8,0,0,1,.38-2.43,7.29,7.29,0,0,0,1.48-1.8,7.11,7.11,0,0,0,1-3.6c0-1,0-2.06,0-3.08a7.27,7.27,0,0,1,6-6.9c.18,0,.23-.09.22-.26s0-.57,0-.86a1,1,0,0,1,.72-1s.06,0,.07,0Z"
                        />
                        <path
                          class="cls-2"
                          d="M16.33,21.89A3.86,3.86,0,0,1,15,24.12a3.91,3.91,0,0,1-6.25-2c0-.13-.06-.21.13-.21h7.48Z"
                        />
                      </g>
                    </g>
                  </svg>
                </v-badge>
              </template>

              <template v-else>
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25 25"
                  class="mr-2"
                >
                  <defs>
                    <style>
                      .cls-1 {
                        fill: var(--color-heading);
                        opacity: 0;
                      }
                      .cls-2 {
                        fill: var(--color-heading);
                      }
                    </style>
                  </defs>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                      <rect class="cls-1" width="25" height="25" />
                      <path
                        class="cls-2"
                        d="M12.75,0c0,.07.09.05.14.07a1,1,0,0,1,.65,1c0,.33,0,.65,0,1,0,.13,0,.18.17.2a7.29,7.29,0,0,1,6,5.82,8.44,8.44,0,0,1,.13,1.5c0,1.1-.06,2.2,0,3.3a6.78,6.78,0,0,0,2.32,4.68,2,2,0,0,1,.76,1.32,1.83,1.83,0,0,1-1.8,2H4.05A1.86,1.86,0,0,1,2.4,20a1.8,1.8,0,0,1,.38-2.43,7.29,7.29,0,0,0,1.48-1.8,7.11,7.11,0,0,0,1-3.6c0-1,0-2.06,0-3.08a7.27,7.27,0,0,1,6-6.9c.18,0,.23-.09.22-.26s0-.57,0-.86a1,1,0,0,1,.72-1s.06,0,.07,0Z"
                      />
                      <path
                        class="cls-2"
                        d="M16.33,21.89A3.86,3.86,0,0,1,15,24.12a3.91,3.91,0,0,1-6.25-2c0-.13-.06-.21.13-.21h7.48Z"
                      />
                    </g>
                  </g>
                </svg>
              </template>
              <h4
                class="text-capitalize heading--text pl-5"
                style="font-weight: 500"
              >
                Notifications
              </h4>
            </div>
          </client-only>
        </v-btn>
        <v-divider />
      </div>
    </v-navigation-drawer>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer
      v-if="showFooter"
      height="auto"
      class="pa-3 justify-center align-center flex-column"
    >
      <ul class="footer__links flex justify-center align-center flex-wrap py-2">
        <li>
          <n-link to="/privacy-policy"> Privacy Policy </n-link>
        </li>
        <li>
          <n-link to="/terms-of-use"> Terms of Use </n-link>
        </li>
        <li>
          <n-link to="/about"> About </n-link>
        </li>
        <li>
          <n-link to="/contact-us"> Contact Us </n-link>
        </li>
      </ul>
      <span class="caption d-block">
        &copy;{{ new Date().getFullYear() }} —
        <strong class="primary--text">{{ title }}</strong>
        . All Rights Reserved.
      </span>
      <span class="d-none">
        Developed By
        <a href="https://devxhub.com" target="_blank" rel="noopener">DevXHub</a>
      </span>
    </v-footer>

    <ChatPanel v-if="loggedIn && breakpoint.mdAndUp" />
    <!-- <AppFab />-->
    <v-snackbar
      v-if="snackbar"
      :value="snackbar.show"
      :timeout="snackbar.timeout"
      top
      :color="snackbar.color"
      @input="$store.commit('CLOSE_SNACKBAR')"
    >
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn
          dark
          text
          icon
          v-bind="attrs"
          @click.stop="$store.commit('CLOSE_SNACKBAR')"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- <Confirm ref="confirm" /> -->
  </v-app>
</template>

<script>
import {
  mdiForum,
  mdiMusic,
  mdiHome,
  mdiMenu,
  mdiClose,
  mdiHeart,
  mdiAccount,
  mdiImage,
  mdiVideo,
  mdiFileDocument,
  mdiFire,
  mdiHeadSnowflake,
  mdiBell,
  mdiNetwork,
  mdiCommentTextMultiple,
} from '@mdi/js';
import { mapGetters } from 'vuex';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'CXBrainstorm',
      drawer: false,
      dark: false,
      isHydrated: false,
      items: [
        {
          title: 'Home',
          link: '/',
          icon: mdiHome,
        },
        {
          title: 'CX Brainstorm',
          link: '/cx-brainstorm',
          icon: mdiHeadSnowflake,
        },
        {
          title: 'Hot Topics',
          link: '/topics/digital-transformation',
          icon: mdiFire,
        },
        {
          title: 'My Network',
          link: '/my-network',
          icon: mdiNetwork,
        },
        {
          title: 'Messaging',
          link: '/messaging',
          icon: mdiCommentTextMultiple,
        },
        {
          title: 'Images',
          link: '/images',
          icon: mdiImage,
        },
        {
          title: 'Videos',
          link: '/videos',
          icon: mdiVideo,
        },
        {
          title: 'Documents',
          link: '/documents',
          icon: mdiFileDocument,
        },
      ],
      mdiForum,
      mdiHome,
      mdiMusic,
      mdiMenu,
      mdiClose,
      mdiHeart,
      mdiAccount,
      mdiBell,
      mdiCommentTextMultiple,
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
    loggedIn() {
      return this.$auth.loggedIn;
    },

    ...mapGetters({
      unreadCount: 'notification/unreadCount',
    }),
    breakpoint() {
      return this.isHydrated ? this.$vuetify.breakpoint : { mobile: false };
    },
    showFooter() {
      const paths = ['/cx-brainstorm'];

      return paths.includes(this.$route.path);
    },
  },
  mounted() {
    this.isHydrated = true;
    if (this.$vuetify.theme.dark) {
      this.dark = true;
    }
  },
  methods: {
    toggleTheme(value) {
      this.$vuetify.theme.dark = value;
    },
    goToFeedPage() {
      const route = this.loggedIn ? '/feed' : '/';
      this.$router.push(route);
      if (this.$route.name === 'feed') {
        this.$nuxt.$emit('getLatestPosts');
      }
    },
  },
};
</script>
