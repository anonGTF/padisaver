<template>
  <BaseLayout useCustomBackground>
    <div class="h-full w-full bg-gray-0 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 text-center py-8 px-6">
      <img 
        src="/pens.png" 
        alt="logo pens" 
        width="150" 
        height="150"
        class="mx-auto mb-6"
      >
      <h1 class="text-3xl font-bold mb-3 text-white">Selamat Datang di <br>🌾 Padisaver 🌾</h1>
      <p class="text-xl mb-12">Klik tombol di bawah untuk melanjutkan.</p>
      <button class="btn btn-circle mb-4 btn-lg bg-white border-transparent text-white pulse bg-opacity-50 hover:bg-opacity-70 hover:bg-white hover:border-transparent">
        <router-link to="/home">
          <mdi-chevron-right class="w-10 h-10"/>
        </router-link>
      </button>
    </div>
  </BaseLayout>
</template>

<script setup>
  import BaseLayout from '../components/BaseLayout.vue';
</script>

<style>
.pulse
{
  border-radius: 50%;
  width: 72px;
  height: 72px;
  animation: animate 1s linear infinite;
}
@keyframes animate
{
    0%
  {
    box-shadow: 0 0 0 0 rgba(255,255,255,.7), 0 0 0 0 rgba(255,255,255,.7);
  }
    40%
  {
    box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 0 15px rgba(255,255,255,.7);
  }
    80%
  {
    box-shadow: 0 0 0 0 rgba(255,255,255,0), 0 0 0 35px rgba(255,255,255,0);
  }
    100%
  {
    box-shadow: 0 0 0 0 rgba(255,255,255,.7), 0 0 0 15px rgbargba(255,255,255,0);
  }
}
</style>