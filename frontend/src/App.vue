<script setup lang="ts">
import { RouterView } from "vue-router";
import PacmanLoader from "vue-spinner/src/PacmanLoader.vue";
import { useAuthStore } from "./stores/auth.store";

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.isInitializing" class="flex items-center justify-center h-screen w-full">
    <PacmanLoader />
  </div>
  <RouterView v-else />
</template>
