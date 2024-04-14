<template>
  <BaseLayout>
    <div class="h-screen flex flex-col">
      <div class="flex justify-between items-center my-4">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 hover:cursor-pointer"/>
        <h1 class="text-lg font-semibold">{{ data.name }}</h1>
        <div></div>
      </div>
      <img :src="data.thumbnail" class="rounded-xl w-full h-96 my-4" />
      <p class="text-2xl font-semibold mb-2">{{ data.name }}</p>
      <p class="italic">{{ data.scientificName }}</p>
      <div v-html="markdown.render(data.description)" class="my-6" />
      <div class="card w-full bg-secondary text-secondary-content">
        <div class="card-body items-center text-center">
          <mdi-shield-bug class="w-20 h-20"/>
          <h2 class="card-title mb-4">Cara Mengatasi Hama Ini!</h2>
          <div v-if="data.isMultiList" class="text-start">
            <ul>
              <li v-for="parentStep in data.howToControl">
                <p class="mt-3 mb-2 text-lg font-medium -ms-4">{{ parentStep.title }}</p>
                <ol class="list-decimal">
                  <li v-for="step in parentStep.items">{{ step }}</li>
                </ol>
              </li>
            </ul>
          </div>
          <div v-else class="text-start">
            <ol class="list-decimal">
              <li v-for="step in data.howToControl">{{ step }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
  import MarkdownIt from "markdown-it"
  import BaseLayout from "../components/BaseLayout.vue"
  import { toTitleCase } from "../utils/stringUtil"
  import { useRoute, useRouter } from "vue-router"
  import { listHama } from "../utils/data"
  import { computed } from "vue"

  const router = useRouter()
  const route = useRoute()
  const markdown = new MarkdownIt()

  const data = computed(() => listHama.find(hama => hama.name == toTitleCase(route.params.id)))
</script>../utils