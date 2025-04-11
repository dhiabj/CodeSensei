<script setup lang="ts">
import { RouterView } from "vue-router";
import { Vue3Lottie } from "vue3-lottie";
import { useAuthStore } from "./stores/auth.store";
import LanguagesJSON from "./assets/animations/LanguagesJSON.json";

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.isInitializing" class="flex items-center justify-center h-screen w-full">
    <Vue3Lottie :animationData="LanguagesJSON" :height="400" :width="400" />
  </div>
  <RouterView v-else />
</template>
