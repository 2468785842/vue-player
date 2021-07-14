<template>
  <div
    v-loading="loading"
    class="loading"
    element-loading-background="#f3f3f3"
  ></div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>