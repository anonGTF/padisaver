<template>
  <BaseLayout fullScreen>
    <div class="h-screen relative">
      <div v-if="isLoading" class="absolute top-0 left-0 w-full h-full bg-black opacity-85 z-50 flex flex-col justify-center items-center">
        <span class="loading loading-dots w-20"></span>
        <p class="text-white text-2xl">Mengidentifikasi gambar...</p>
      </div>
      <div class="absolute top-0 left-0 flex w-full justify-between items-center my-4 z-10">
        <mdi-chevron-left @click="router.back()" class="h-10 w-10 cursor-pointer"/>
        <h1 class="text-lg font-semibold">Ambil/Upload Gambar</h1>
        <details class="dropdown dropdown-bottom dropdown-end">
          <summary tabindex="0" role="button" class="btn m-1 bg-transparent border-none hover:bg-transparent p-0">
            <mdi-cog class="w-6 h-6"/>
          </summary>
          <div tabindex="0" class="dropdown-content z-[1] p-4 shadow bg-base-100 rounded-box w-64">
            <div class="flex justify-between">
              <span>Kompres gambar</span>
              <input 
                type="checkbox" 
                class="toggle toggle-secondary" 
                :checked="isUsingImageCompression"
              />
            </div>
          </div>
        </details>
      </div>
      <p v-if="permissionDenied" class="absolute top-1/2 left-1/2 text-center">Tidak bisa mengakses kamera tanpa izin akses!</p>
      <video v-else ref="videoRef" autoplay class="w-full h-full"/>
      <canvas ref="canvasRef" class="hidden" />
      <div class="w-full flex justify-between items-center absolute bottom-0 left-0 py-6 px-2 bg-neutral z-10">
        <button 
          class="btn btn-circle w-14 h-14 btn-accent"
          @click="fileInput.click()"
        >
          <mdi-image class="w-7 h-7"/>
        </button>
        <button 
          class="btn btn-circle bg-white hover:bg-white hover:shadow-lg w-20 h-20"
          @click="snapCamera"
        >
        </button>
        <button 
          class="btn btn-circle w-14 h-14 btn-accent"
          @click="camera.flipCamera()"
        >
          <mdi-sync class="w-7 h-7"/>
        </button>
      </div>
    </div>
    <input 
      type="file" 
      class="hidden" 
      ref="fileInput"
      accept="image/*"
      @change="fileSelected"
    />
    <div v-if="errorMessage != ''" class="toast toast-top toast-center z-50">
      <div class="alert alert-error">
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
  import { onMounted, onUpdated, ref } from 'vue'
  import CameraUtil from "../utils/camera"
  import BaseLayout from "../components/BaseLayout.vue"
  import { onBeforeRouteLeave, useRouter } from 'vue-router'
  import { useResultStore } from "../composables/useResultStore"

  const isLoading = ref(false)
  const errorMessage = ref("")
  const fileInput = ref()
  const camera = ref()
  const canvasRef = ref()
  const videoRef = ref()
  const permissionDenied = ref(false)
  const isCameraOpen = ref(false)
  const isUsingImageCompression = ref(false)
  const router = useRouter()
  const resultStore = useResultStore()

  const initCamera = async () => {
    const checkPermission = setInterval(() => {
      if (isCameraOpen.value) {
        clearInterval(checkPermission)
      } else {
        permissionDenied.value = true
        clearInterval(checkPermission)
      }
    }, 3000)

    camera.value = await new CameraUtil(videoRef.value, canvasRef.value)
      .setConstraint({
        video: {
          facingMode: "user",
          height: {
            min: 480,
            max: 1920,
            ideal: 1920,
          },
          width: {
            min: 480,
            max: 1080,
            ideal: 1080,
          },
        },
        audio: false,
      })
      .requestPermission()
      .then((camera) => camera.mirror(true))
      .catch((err) => showError(err))

    camera.value?.start().finally(() => (isCameraOpen.value = true))
  }

  onMounted(() => {
    initCamera()
  })

  onUpdated(() => {
    videoRef.value?.play()
    camera.value?.start()
  })

  onBeforeRouteLeave(() => {
    camera.value?.stop()
  })

  const snapCamera = async () => {
    videoRef.value?.pause()
    const image = await camera.value.snapAsBase64()
    postData(image)
  }

  const fileSelected = async (event) => {
    const image = await loadImageBase64(event.target.files[0])
    postData(image)
  }

  const loadImageBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const postData = async (image) => {
    try {
      isLoading.value = true
      const response = await fetch("https://detect.roboflow.com/datasetfinalproject/6?api_key=9fHdyA8o2t9NN6pYHOfX", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: image
      })

      if (!response.ok) {
        throw new Error("Terdapat masalah pada jaringan")
      }

      const responseData = await response.json()
      if (responseData.predictions.length > 0) {
        resultStore.image = image
        resultStore.predictions = responseData
        router.push("/result")
      } else {
        throw new Error("Hasil tidak teridentifikasi!")
      }
    } catch (error) {
      showError(error)
    } finally {
      isLoading.value = false
    }
  }

  const showError = async (message) => {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ""
    }, Math.min(1000 + message.length * 25, 3000))
  }
</script>