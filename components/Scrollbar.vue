<template>
  <section
    :is="$props.tagname"
    class="ps-container"
    @mouseover.once="update"
    v-on="$listeners"
  >
    <slot />
  </section>
</template>

<script>
import PerfectScrollbar from 'perfect-scrollbar';

export default {
  name: 'TheScrollbar',
  props: {
    tagname: {
      type: String,
      default: 'section',
    },
    suppressScrollX: {
      type: Boolean,
      default: false,
    },
    suppressScrollY: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ps: null,
      settings: {
        // maxScrollbarLength: 160,
      },
    };
  },

  watch: {
    $route() {
      this.update();
    },
  },

  mounted() {
    // for support ssr
    if (!this.$isServer) {
      this.__init();
    }
  },

  updated() {
    this.$nextTick(this.update);
  },

  activated() {
    this.__init();
  },

  deactivated() {
    this.__uninit();
  },

  beforeDestroy() {
    this.__uninit();
  },
  methods: {
    update() {
      if (this.ps) {
        this.ps.update();
      }
    },

    __init() {
      if (!this.ps) {
        this.ps = new PerfectScrollbar(this.$el, {
          suppressScrollX: this.suppressScrollX,
          suppressScrollY: this.suppressScrollY,
          ...this.settings,
        });
      }
    },

    __uninit() {
      if (this.ps) {
        this.ps.destroy();
        this.ps = null;
      }
    },
  },
};
</script>
