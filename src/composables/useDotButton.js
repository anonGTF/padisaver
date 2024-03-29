import { ref, onMounted, onBeforeUnmount } from "vue"

export const useDotButton = (emblaApi) => {
  const selectedIndex = ref(0)
  const scrollSnaps = ref([])

  const onDotButtonClick = (index) => {
    if (!emblaApi.value) return
    emblaApi.value.scrollTo(index)
  }

  const onInit = (emblaApi) => {
    try {
      scrollSnaps.value = emblaApi.value.scrollSnapList()
    } catch (error) {
      scrollSnaps.value = emblaApi.scrollSnapList()
    }
  }

  const onSelect = (emblaApi) => {
    try {
      selectedIndex.value = emblaApi.value.selectedScrollSnap()
    } catch (error) {
      selectedIndex.value = emblaApi.selectedScrollSnap()
    }
  }

  onMounted(() => {
    if (!emblaApi.value) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.value.on('reInit', onInit)
    emblaApi.value.on('reInit', onSelect)
    emblaApi.value.on('select', onSelect)
  })

  onBeforeUnmount(() => {
    if (!emblaApi.value) return

    emblaApi.value.off('reInit', onInit)
    emblaApi.value.off('reInit', onSelect)
    emblaApi.value.off('select', onSelect)
  })

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}