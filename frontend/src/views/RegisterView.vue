<script setup lanbg="ts">
import logo from "@/assets/logo.png";
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
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
          <div class="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#5DC596] sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-white">Password</label>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#5DC596] sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm/6 font-medium text-white"
            >Confirm password</label
          >
          <div class="mt-2">
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              autocomplete="current-confirm-password"
              required
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#5DC596] sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-[#5DC596] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C] cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
