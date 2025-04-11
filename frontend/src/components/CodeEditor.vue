<script setup>
import { shallowRef, computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { ChevronDownIcon } from "@heroicons/vue/16/solid";
import { useReviewStore } from "@/stores/review.store";

const reviewStore = useReviewStore();

// Available language extensions
const languageMap = {
  javascript: javascript(),
  html: html(),
  css: css(),
  python: python(),
  php: php(),
  java: java(),
};

const selectedLanguage = computed({
  get() {
    return reviewStore.selectedLanguage;
  },
  set(value) {
    reviewStore.setSelectedLanguage(value);
  },
});

// Dynamic extensions based on selected language
const extensions = computed(() => [languageMap[reviewStore.selectedLanguage], oneDark]);

// Editor instance reference
const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
};

// Event logging
const log = (eventName, event) => {
  console.log(eventName, event);
};

// Handler for Codemirror changes
const onChange = (value) => {
  reviewStore.setCode(value);
};
</script>

<template>
  <div>
    <label for="language" class="block text-sm/6 font-medium text-white"
      >Select your language</label
    >
    <div class="mt-2 grid grid-cols-1 size-fit">
      <select
        id="language"
        v-model="selectedLanguage"
        name="language"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      >
        <option value="javascript">JavaScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="java">Java</option>
      </select>
      <ChevronDownIcon
        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        aria-hidden="true"
      />
    </div>
  </div>

  <Codemirror
    v-model="reviewStore.code"
    placeholder="Code goes here..."
    :style="{ height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="
      (value) => {
        log('change', value);
        onChange(value);
      }
    "
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>
