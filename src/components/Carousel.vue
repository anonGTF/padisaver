<template>
  <div class="carousel carousel-center max-w-md my-auto p-4 space-x-4 bg-neutral rounded-box">
    <div 
      v-for="hama in items" 
      :key="hama.name" 
      class="carousel-item relative w-[320px] h-[480px] hover:cursor-pointer"
      @click="router.push(`/detail/${hama.name.toLowerCase().replace(/\s+/g, '-')}`)"
    >
      <img :src="hama.thumbnail" class="rounded-box absolute top-0 left-0 object-cover w-[320px] h-[480px]" />
      <div class="z-10 absolute bottom-0 left-0 w-full px-3 pb-3 pt-6 rounded-b-box bg-gradient-to-t from-black to-transparent">
        <p class="text-2xl font-semibold">{{ hama.name }}</p>
        <p class="italic">{{ hama.scientificName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from "vue-router"
  
  const router = useRouter()

  const props = defineProps(['items'])
</script>