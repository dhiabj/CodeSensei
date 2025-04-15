<script setup lang="ts">
import logo from "@/assets/logo.png";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth.store";
import { API_URL } from "@/api";
import { authService } from "@/services/auth.service";

const showPassword = ref(false);
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

onMounted(() => {
  const type = route.query.type as string;
  if (!type) return;
  switch (type) {
    case "confirm":
      toast.success("Email verified successfully! You can now log in.");
      break;
    case "expired":
      toast.error("Verification link expired");
      break;
    case "invalid":
      toast.error("Invalid verification link");
      break;
    default:
      toast.error("Email verification failed");
  }
});

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const schema = yup.object({
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Must contain at least one uppercase, lowercase, and number"
    ),
});

const handleLogin = async (values: any) => {
  try {
    isLoading.value = true;
    await authService.login(values);
    authStore.setIsAuthenticated(true);
    router.push("/");
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const signInWithOAuthProvider = (provider: string) => {
  window.location.href = `${API_URL}/api/auth/${provider}`;
};
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="logo" alt="CodeSensei" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form @submit="handleLogin" :validation-schema="schema" class="space-y-6">
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
          <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
          <div class="mt-2">
            <Field name="password" v-slot="{ field, meta }">
              <div class="relative">
                <input
                  id="password"
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  :class="[
                    'block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 sm:text-sm/6 focus:outline-2 focus:-outline-offset-2 focus:outline-[#5DC596]',
                    meta.touched && !meta.valid
                      ? 'outline-2 -outline-offset-2 outline-red-500'
                      : 'outline-1 -outline-offset-1 outline-white/10',
                  ]"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center pr-3"
                  @click="toggleShowPassword"
                >
                  <EyeIcon
                    v-if="!showPassword"
                    class="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                    aria-hidden="true"
                  />
                  <EyeSlashIcon
                    v-if="showPassword"
                    class="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </Field>
            <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            Sign in
          </button>
        </div>
      </Form>

      <p class="mt-10 text-center text-sm/6 text-gray-400">
        Don't have an account?
        {{ " " }}
        <RouterLink to="/register" class="font-semibold text-[#5DC596] hover:text-[#328a62]">
          Sign up
        </RouterLink>
      </p>
      <div class="mt-6 grid grid-cols-2 gap-4">
        <button
          @click="signInWithOAuthProvider('google')"
          class="flex w-full items-center justify-center gap-3 rounded-md bg-[#5DC596] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#328a62] cursor-pointer"
        >
          <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
              fill="#34A853"
            />
          </svg>
          <span class="text-sm/6 font-semibold">Google</span>
        </button>

        <button
          @click="signInWithOAuthProvider('github')"
          class="flex w-full items-center justify-center gap-3 rounded-md bg-[#5DC596] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#328a62] cursor-pointer"
        >
          <svg
            class="size-5 fill-[#24292F]"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm/6 font-semibold">GitHub</span>
        </button>
      </div>
    </div>
  </div>
</template>
