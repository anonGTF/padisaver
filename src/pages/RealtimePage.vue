<template>
  <BaseLayout full-screen>
    <div class="h-screen relative">
      <div v-if="isLoading" class="absolute top-0 left-0 w-full h-full bg-black opacity-85 z-50 flex flex-col justify-center items-center">
        <span class="loading loading-dots w-20"></span>
        <p class="text-white text-2xl">Memuat model...</p>
      </div>
      <div class="absolute top-0 left-0 flex w-full justify-between items-center my-4 z-10">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 cursor-pointer"/>
        <h1 class="text-lg font-semibold">Identifikasi Realtime</h1>
        <div></div>
      </div>
      <p v-if="permissionDenied" class="absolute top-1/2 w-full text-center">Tidak bisa mengakses kamera tanpa izin akses!</p>
      <div v-else class="relative w-full h-full">
        <video 
          ref="videoRef" 
          autoplay
          class="absolute top-[72px]"
          @loadeddata="detectFrame"
        />
        <div
          v-if="boundingBox != null"
          class="absolute border-2 border-red-600"
          :style="boundingBox"
        ></div>
      </div>
      <canvas ref="canvasRef" class="hidden" />
      <div class="w-full absolute bottom-[30px] left-0 p-2 bg-neutral z-10">
        <Carousel :items="resultList" narrow/>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
  import { onMounted, ref, onUpdated, computed } from "vue"
  import { useRouter, onBeforeRouteLeave } from "vue-router"
  import { listHama } from '../utils/data';
  import BaseLayout from "../components/BaseLayout.vue"
  import Carousel from "../components/Carousel.vue"
  import CameraUtil from "../utils/camera"

  const isLoading = ref(false)
  const permissionDenied = ref(false)
  const isCameraOpen = ref(false)
  const errorMessage = ref("")
  const counter = ref()
  const prediction = ref()
  const model = ref()
  const camera = ref()
  const canvasRef = ref()
  const videoRef = ref()
  const boundingBox = ref()
  const router = useRouter()

  const resultList = computed(() => listHama.filter((hama) => hama.tag == prediction.value?.class))

  const initCamera = async () => {
    const checkPermission = setInterval(() => {
      if (isCameraOpen.value) {
        clearInterval(checkPermission)
      } else {
        permissionDenied.value = true
        clearInterval(checkPermission)
      }
    }, 5000)

    camera.value = await new CameraUtil(videoRef.value, canvasRef.value)
      .setConstraint({
        video: {
          facingMode: "environment",
          height: 720,
          width: 1080,
        },
        audio: false,
      })
      .requestPermission()
      .catch((err) => showError(err.message))

    camera.value?.start().finally(() => (isCameraOpen.value = true))
  }

  const initModel = async () => {
    model.value = await roboflow.auth({
        publishable_key: "rf_hMtnOcpBcGZejg88q8iHzKkeYRM2"
    }).load({
        model: "datasetfinalproject",
        version: 6
    })
  }

  const detectFrame = async () => {
    if (!model.value) return await new Promise(resolve => requestAnimationFrame(resolve))

    try {
        model.value.detect(videoRef.value).then((result) => {
          if (result.length > 0 && result[0].confidence > 0.5) {
            prediction.value = result[0]
            createBoundingBox()
            clearTimeout(counter.value)
          } else {
            counter.value = setTimeout(() => {
              prediction.value = null
              boundingBox.value = null
            }, 1000)
          }
          requestAnimationFrame(detectFrame)
        })
    } catch (e) {
        console.log("Error caught:", e)
    }
  }

  const createBoundingBox = () => {
    const scaleX = videoRef.value.clientWidth / 1080
    const scaleY = videoRef.value.clientHeight / 720

    const x = prediction.value.bbox.x
    const y = prediction.value.bbox.y
    const width = prediction.value.bbox.width
    const height = prediction.value.bbox.height

    const x1 = (x - width / 2) * scaleX
    const x2 = (x + width / 2) * scaleX
    const y1 = (y - height / 2) * scaleY + 72
    const y2 = (y + height / 2) * scaleY + 72

    boundingBox.value = {
      left: `${x1}px`,
      top: `${y1}px`,
      width: `${x2 - x1}px`, 
      height: `${y2 - y1}px`,
    }
  }

  onMounted(async () => {
    isLoading.value = true
    await Promise.all([initModel(), initCamera()])
    isLoading.value = false
  })

  onUpdated(() => {
    videoRef.value?.play()
    camera.value?.start()
  }
)
  onBeforeRouteLeave(() => {
    camera.value?.stop()
    videoRef.value?.pause()
  })

  const showError = async (message) => {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ""
    }, Math.min(1000 + message.length * 25, 3000))
  }
</script>