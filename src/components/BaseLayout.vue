<template>
  <video-background 
    v-if="useCustomBackground"
    src="/welcoming_background.mp4"
    poster="/welcoming_background.jpg"
    style="width: 100vw; height: 100vh;"
  >
    <main class="my-0 mx-auto min-h-screen max-w-md flex flex-col justify-center">
      <div class="mx-4 max-w-300 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <slot />
      </div>  
    </main>
  </video-background>
  <div 
    v-else
    class="bg-neutral"
  >
    <main class="my-0 mx-auto min-h-screen max-w-md flex flex-col justify-center">
      <div class="mx-4 max-w-300 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <slot />
      </div>  
    </main>
  </div>
</template>

<script setup>
  import VideoBackground from "vue-responsive-video-background-player"

  const props = defineProps({
    useCustomBackground: {
      type: Boolean,
      default: false
    }
  })
</script>