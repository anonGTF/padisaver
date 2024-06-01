import { ref } from "vue"
import { defineStore } from "pinia"

export const useCompressionStore = defineStore('compression', () => {
  const initialSize = ref()
  const compressedSize = ref()
  const compressionRate = ref()
  return { initialSize, compressedSize, compressionRate }
})