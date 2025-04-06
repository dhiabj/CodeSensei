<script setup lang="ts">
import logo from "@/assets/logo.png";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { authService } from "@/services/auth.service";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

const router = useRouter();
const toast = useToast();

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
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
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const handleRegister = async (values: any) => {
  try {
    isLoading.value = true;
    const { message } = await authService.register({
      email: values.email,
      password: values.password,
    });
    toast.success(message);
    router.push("/login");
  } catch (error: any) {
    console.error(error);
    toast.error(error.response?.data?.message || "Registration failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" :src="logo" alt="CodeSensei" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
        Sign up for an account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form @submit="handleRegister" :validation-schema="schema" class="space-y-6">
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
          <label for="confirmPassword" class="block text-sm/6 font-medium text-white"
            >Confirm password</label
          >
          <div class="mt-2">
            <Field name="confirmPassword" v-slot="{ field, meta }">
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-bind="field"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="current-confirmPassword"
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
                  @click="toggleShowConfirmPassword"
                >
                  <EyeIcon
                    v-if="!showConfirmPassword"
                    class="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                    aria-hidden="true"
                  />
                  <EyeSlashIcon
                    v-if="showConfirmPassword"
                    class="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </Field>
            <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            Sign up
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
