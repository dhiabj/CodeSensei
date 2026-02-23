<script setup lang="ts">
import logo from "@/assets/logo.png";
import { authService } from "@/services/auth.service";
import { AxiosError } from "axios";
import { Form, Field, ErrorMessage, type GenericObject } from "vee-validate";
import { computed, onBeforeUnmount, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import * as yup from "yup";

const route = useRoute();
const toast = useToast();
const isLoading = ref(false);
const isSent = ref(false);
const sentMessage = ref("");
const cooldownSeconds = ref(0);
let cooldownInterval: ReturnType<typeof setInterval> | null = null;

const initialEmail = computed(() => {
  const value = route.query.email;
  return typeof value === "string" ? value : "";
});
const isCooldownActive = computed(() => cooldownSeconds.value > 0);
const resendButtonLabel = computed(() =>
  isCooldownActive.value ? `Resend in ${cooldownSeconds.value}s` : "Resend email",
);

const startCooldown = () => {
  cooldownSeconds.value = 60;

  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }

  cooldownInterval = setInterval(() => {
    if (cooldownSeconds.value <= 1) {
      cooldownSeconds.value = 0;
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }
      return;
    }

    cooldownSeconds.value -= 1;
  }, 1000);
};

const schema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email format"),
});

const handleResend = async (values: GenericObject) => {
  if (isCooldownActive.value) {
    return;
  }

  try {
    isLoading.value = true;
    const { message } = await authService.resendVerificationEmail({
      email: values.email,
    });
    isSent.value = true;
    sentMessage.value = message;
    toast.success(message);
    startCooldown();
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message ?? "Failed to resend verification email.";

      if (error.response?.status === 429) {
        startCooldown();
      } else {
        toast.error(errorMessage);
        sentMessage.value = errorMessage;
      }
    } else {
      toast.error("Unexpected error");
      sentMessage.value = "Failed to resend verification email.";
    }
    isSent.value = false;
  } finally {
    isLoading.value = false;
  }
};

onBeforeUnmount(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
    cooldownInterval = null;
  }
});
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="logo" alt="CodeSensei" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Resend verification email
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form
        @submit="handleResend"
        :validation-schema="schema"
        :initial-values="{ email: initialEmail }"
        class="space-y-6"
      >
        <div>
          <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
          <div class="mt-2">
            <Field name="email" v-slot="{ field, meta }">
              <input
                id="email"
                v-bind="field"
                type="email"
                autocomplete="email"
                :class="[
                  'block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 sm:text-sm/6 focus:outline-2 focus:-outline-offset-2 focus:outline-[#5DC596]',
                  meta.touched && !meta.valid
                    ? 'outline-2 -outline-offset-2 outline-red-500'
                    : 'outline-1 -outline-offset-1 outline-white/10',
                ]"
              />
            </Field>
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || isCooldownActive"
          >
            {{ resendButtonLabel }}
          </button>
        </div>
      </Form>

      <p
        v-if="sentMessage"
        :class="isSent ? 'mt-4 text-sm text-[#5DC596]' : 'mt-4 text-sm text-red-400'"
      >
        {{ sentMessage }}
      </p>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        Back to
        {{ " " }}
        <RouterLink to="/login" class="font-semibold text-[#5DC596] hover:text-[#328a62]">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
