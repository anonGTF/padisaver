import { ref } from "vue"
import { defineStore } from "pinia"

export const useResultStore = defineStore('result', () => {
  const image = ref()
  const predictions = ref()
  return { image, predictions }
})