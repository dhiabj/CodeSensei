<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import GridLoader from "vue-spinner/src/GridLoader.vue";

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.isLoading" class="flex items-center justify-center h-screen w-screen">
    <GridLoader />
  </div>
  <RouterView v-else />
</template>
