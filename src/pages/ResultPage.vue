<template>
  <BaseLayout>
    <div class="h-screen flex flex-col">
      <div class="flex justify-between items-center my-4">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 hover:cursor-pointer"/>
        <h1 class="text-lg font-semibold">Hasil Identifikasi</h1>
        <div></div>
      </div>
      <p>Berdasarkan hasil identifikasi, berikut merupakan hama yang ada pada gambar tersebut: {{ toLower(route.params.id) }}</p>
      <Carousel :items="resultList"/>
    </div>
  </BaseLayout>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import BaseLayout from '../components/BaseLayout.vue'
  import Carousel from '../components/Carousel.vue';
  import { listHama } from '../utils/data';
  import { computed } from 'vue';
  import { toLower } from '../utils/stringUtil';
  
  const route = useRoute()
  const resultList = computed(() => listHama.filter((hama) => hama.tag == toLower(route.params.id)))
</script>