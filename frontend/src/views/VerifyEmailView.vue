<script setup lang="ts">
import logo from "@/assets/logo.png";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { ref, onMounted, computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const isLoading = ref(true);
const isSuccess = ref(false);
const message = ref("Verifying your email...");

const emailFromQuery = computed(() => {
  const value = route.query.email;
  return typeof value === "string" ? value : "";
});

onMounted(async () => {
  const token = route.query.token;

  if (typeof token !== "string" || !token.trim()) {
    isLoading.value = false;
    isSuccess.value = false;
    message.value = "Verification link is invalid or missing.";
    return;
  }

  try {
    const response = await authService.verifyEmail({ token });
    isSuccess.value = true;
    message.value = response.message;
  } catch (error) {
    const errorMessage = error instanceof AxiosError ? error.response?.data?.message : null;
    isSuccess.value = false;
    message.value = errorMessage ?? "Unable to verify email. Please request a new link.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="logo" alt="CodeSensei" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Email verification
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="rounded-md bg-white/5 p-6 outline-1 -outline-offset-1 outline-white/10">
        <p v-if="isLoading" class="text-sm/6 text-gray-300">Verifying your email...</p>
        <p v-else :class="isSuccess ? 'text-sm/6 text-[#5DC596]' : 'text-sm/6 text-red-400'">
          {{ message }}
        </p>

        <div class="mt-6 flex flex-col gap-3">
          <RouterLink
            v-if="isSuccess"
            to="/login"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C]"
          >
            Continue to sign in
          </RouterLink>

          <RouterLink
            v-else
            :to="{
              path: '/resend-verification',
              query: emailFromQuery ? { email: emailFromQuery } : {},
            }"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C]"
          >
            Resend verification email
          </RouterLink>

          <RouterLink
            v-if="!isSuccess"
            to="/login"
            class="text-center text-sm/6 font-semibold text-[#5DC596] hover:text-[#328a62]"
          >
            Back to login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
