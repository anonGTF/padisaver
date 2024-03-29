<template>
  <div class="overflow-hidden my-auto" ref="emblaRef">
    <div 
      class="flex max-w-md p-4 space-x-4 bg-neutral rounded-box"
      :class="{'justify-center': scrollSnaps.length == 1}"
    >
      <div 
        v-for="hama in items" 
        :key="hama.name" 
        class="flex-[0_0_80%] h-[480px] hover:cursor-pointer shadow-lg"
        @click="router.push(`/detail/${toLink(hama.name)}`)"
      >
        <img :src="hama.thumbnail" class="rounded-t-box object-cover w-[320px] h-[390px]" />
        <div class="w-full px-3 py-4 rounded-b-box bg-[#E6DEB9] text-[#3B2E1E]">
          <p class="text-2xl font-semibold">{{ hama.name }}</p>
          <p class="italic">{{ hama.scientificName }}</p>
        </div>
      </div>
    </div>
    <div v-if="scrollSnaps.length > 1" class="flex flex-wrap items-center justify-center mt-8 gap-2 bg-[#E6DEB9] rounded-full w-fit mx-auto px-3 py-2">
      <button 
        v-for="(_, index) in scrollSnaps" 
        :key="index"
        @click="onDotButtonClick(index)"
        class="appearance-none touch-manipulation cursor-pointer w-6 h-6 rounded-full bg-white"
        :class="{'bg-[#3B2E1E]': selectedIndex == index}"
      ></button>
    </div>
  </div>
</template>

<script setup>
  import emblaCarouselVue from 'embla-carousel-vue'
  import { useRouter } from "vue-router"
  import { toLink } from "../utils/stringUtil";
  import { useDotButton } from "../composables/useDotButton"

  const [emblaRef, emblaApi] = emblaCarouselVue()
  
  const router = useRouter()

  const props = defineProps(['items'])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
</script>