<template>
  <BaseLayout>
    <div class="h-screen flex flex-col">
      <div class="flex justify-between items-center my-4">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 hover:cursor-pointer"/>
        <h1 class="text-lg font-semibold">Hasil Identifikasi</h1>
        <div></div>
      </div>
      <p class="text-center my-10">Hasil identifikasi gambar yang kamu pilih adalah:</p>
      <div class="relative">
        <img 
          ref="imageRef"
          :src="resultStore.image" 
          alt="hama" 
          class="rounded-xl"
          @load="drawBoundingBox"
        >
        <div
          v-for="boundingBox in boundingBoxes"
          class="absolute border-2 border-red-600"
          :style="boundingBox"
        ></div>
      </div>

      <div class="flex items-center gap-2 mt-4 p-4 bg-[#E6DEB9] rounded-full">
        <span class="w-4 h-4 rounded-full bg-[#3B2E1E]"/>
        <p class="flex-1 text-lg text-black">{{ highestScoreClass }} <span class="font-semibold">({{ highestScore }}%)</span></p>
        <p class="text-lg text-black font-bold">{{ resultTime }} ms</p>
      </div>

      <div v-if="compressionStore.initialSize != null" class="flex items-center gap-2 mt-4 p-4 bg-[#E6DEB9] rounded-full">
        <span class="w-4 h-4 rounded-full bg-[#3B2E1E]"/>
        <div class="flex-1">
          <p class="text-lg text-black">Ukuran asli : <span class="font-semibold">{{ compressionStore.initialSize.toFixed(2) }} MB</span></p>
          <p class="text-lg text-black">Ukuran terkompres : <span class="font-semibold">{{ compressionStore.compressedSize.toFixed(2) }} MB</span></p>
        </div>
        <p class="text-lg text-black font-semibold">({{ compressionStore.compressionRate.toFixed(0) }}%)</p>
      </div>

      <p class="text-lg font-bold text-center mt-10 mb-2">Lihat cara menangani:</p>

      <Carousel :items="resultList" narrow/>
    </div>
  </BaseLayout>
</template>

<script setup>
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  import BaseLayout from '../components/BaseLayout.vue'
  import Carousel from '../components/Carousel.vue';
  import { listHama } from '../utils/data';
  import { ref, computed } from 'vue';
  import { useResultStore } from '../composables/useResultStore';
  import { useCompressionStore } from '../composables/useCompressionStore';
  
  const router = useRouter()
  const resultStore = useResultStore()
  const compressionStore = useCompressionStore()
  const imageRef = ref()
  const boundingBoxes = ref([])
  const highestScoreClass = computed(() => resultStore.predictions.predictions[0].class)
  const resultList = computed(() => listHama.filter((hama) => hama.tag == highestScoreClass.value))
  const resultTime = computed(() => (resultStore.predictions.time * 1000).toFixed(2))
  const highestScore = computed(() => (resultStore.predictions.predictions[0].confidence * 100).toFixed(2))

  const drawBoundingBox = () => {
    boundingBoxes.value = []
    resultStore.predictions.predictions.forEach(prediction => {
      if (prediction.class == highestScoreClass.value) {
        const scaleX = imageRef.value.clientWidth / resultStore.predictions.image.width
        const scaleY = imageRef.value.clientHeight / resultStore.predictions.image.height
    
        const x = prediction.x
        const y = prediction.y
        const width = prediction.width
        const height = prediction.height
    
        const x1 = (x - width / 2) * scaleX
        const x2 = (x + width / 2) * scaleX
        const y1 = (y - height / 2) * scaleY
        const y2 = (y + height / 2) * scaleY
    
        boundingBoxes.value.push({
          left: `${x1}px`,
          top: `${y1}px`,
          width: `${x2 - x1}px`, 
          height: `${y2 - y1}px`,
        })
      }
    })
  }

  onBeforeRouteLeave(() => {
    compressionStore.initialSize = null
    compressionStore.compressedSize = null
    compressionStore.compressionRate = null
  })
</script>