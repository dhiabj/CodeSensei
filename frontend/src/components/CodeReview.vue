<script setup lang="ts">
defineProps({
  review: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <span class="text-white">{{ review }}</span>
</template>
