<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import CommandLineIcon from "@heroicons/vue/24/outline/CommandLineIcon";
import type { Review } from "@/types/review";

defineProps<{
  reviews: Review[];
  title: string;
}>();

const route = useRoute();
const isActiveLink = (routePath: string) => route.path === routePath;
</script>

<template>
  <li v-if="reviews.length">
    <div class="text-xs/6 font-semibold text-gray-400 mt-4">{{ title }}</div>
    <ul role="list" class="-mx-2 mt-2 space-y-1">
      <li v-for="review in reviews" :key="review._id">
        <RouterLink
          :to="{ name: 'review', params: { id: review._id } }"
          :class="[
            isActiveLink(`/review/${review._id}`)
              ? 'bg-gray-800 text-white'
              : 'hover:bg-gray-800 hover:text-white',
            'flex items-center gap-x-3 rounded-md p-2 text-sm/6 text-gray-400',
          ]"
        >
          <CommandLineIcon class="size-5 shrink-0" />
          <span class="truncate">{{ review.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </li>
</template>
