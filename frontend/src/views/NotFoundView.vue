<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <main class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-base font-semibold text-[#5DC596]">404</p>
      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
        Page not found
      </h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div class="mt-10 flex items-center justify-center">
        <RouterLink
          to="/"
          class="rounded-md bg-[#5DC596] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#328a62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#388E3C]"
          >Go back home</RouterLink
        >
      </div>
    </div>
  </main>
</template>
