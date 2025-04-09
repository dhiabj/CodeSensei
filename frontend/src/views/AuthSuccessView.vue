<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

onMounted(() => {
  const token = route.query.token as string;
  if (token) {
    authStore.setToken(token);
    toast.success("Authentication successful!");
    router.push("/");
  } else {
    toast.error("Invalid authentication token. Please try again.");
    router.push("/login");
  }
});
</script>

<template></template>
