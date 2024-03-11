<template>
  <BaseLayout>
    <h1 class="text-3xl font-bold mb-3 text-white">Apa yang ingin kamu lakukan? 🧐</h1>
    <router-link to="/camera">
      <button class="btn btn-outline btn-lg w-full mt-6">
        <div class="flex my-3 w-full items-center">
          <p class="text-lg flex-1 text-start">Identifikasi hama 🕵🏻‍♀️</p>
          <mdi-chevron-right class="w-10 h-10"/>
        </div>
      </button>
    </router-link>
    <router-link to="/list">
      <button class="btn btn-outline btn-lg w-full mt-6">
        <div class="flex my-3 w-full items-center">
          <p class="text-lg flex-1 text-start">Lihat jenis-jenis hama 🪰</p>
          <mdi-chevron-right class="w-10 h-10"/>
        </div>
      </button>
    </router-link>
  </BaseLayout>
</template>

<script setup>
  import BaseLayout from '../components/BaseLayout.vue'
</script>