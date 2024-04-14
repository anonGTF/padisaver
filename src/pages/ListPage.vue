<template>
  <BaseLayout>
    <div class="h-screen flex flex-col">
      <div class="flex justify-between items-center my-4">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 hover:cursor-pointer"/>
        <h1 class="text-lg font-semibold">Jenis-Jenis Hama 🪰</h1>
        <div></div>
      </div>
      <Carousel :items="listHama" class="my-auto"/>
    </div>
  </BaseLayout>
</template>

<script setup>
  import { useRouter } from "vue-router"
  import BaseLayout from "../components/BaseLayout.vue"
  import Carousel from "../components/Carousel.vue"
  import { listHama } from "../utils/data"

  const router = useRouter()
</script>../utils