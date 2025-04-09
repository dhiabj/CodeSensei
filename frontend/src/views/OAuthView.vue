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
  const error = route.query.error as string;

  if (token) {
    authStore.setToken(token);
    toast.success("Login successful!");
    router.push("/");
  } else if (error) {
    toast.error(error);
    router.push("/login");
  } else {
    toast.error("Invalid OAuth response");
    router.push("/login");
  }
});
</script>

<template></template>
