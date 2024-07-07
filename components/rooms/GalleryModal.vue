<template>
  <UModal :ui="{ base: 'sm:!max-w-5xl w-full h-[500px]' }">
    <div class="flex h-full">
      <div class="flex-shrink-0 flex flex-col p-4 w-[40%]">
        <p class="text-lg font-medium mb-4">Galeri</p>
        <div class="grid grid-cols-2 gap-2 overflow-auto pr-3">
          <button
            v-for="(gallery, idx) in props.galleries"
            @click="(e) => imageClickHandler(e, idx)"
          >
            <img
              :data-idx="idx"
              :src="gallery"
              :class="
                cn(
                  'w-full h-28 object-cover object-center rounded-md',
                  'transition-all duration-100',
                  activeIndex === idx && 'border-4 border-black',
                )
              "
            />
          </button>
        </div>
      </div>
      <div class="relative bg-black w-[60%]">
        <img
          :src="props.galleries[activeIndex]"
          class="object-contain object-center w-full h-full"
        />
        <div class="absolute top-4 right-4">
          <UButton
            color="black"
            class="rounded-full h-8 w-8 !p-0 flex items-center justify-center"
            @click="$emit('close')"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
          </UButton>
        </div>
        <div
          class="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-3"
        >
          <UButton class="bg-opacity-70" @click="() => navHandler('prev')">
            <UIcon name="i-heroicons-chevron-left-16-solid" />
          </UButton>
          <UButton class="bg-opacity-70" @click="() => navHandler('next')">
            <UIcon name="i-heroicons-chevron-right-16-solid" />
          </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
const props = defineProps<{
  galleries: string[];
}>();

defineEmits<{
  (e: "close"): void;
}>();

const activeIndex = ref(0);

const imageClickHandler = (e: Event, idx: number) => {
  const target = e.target as HTMLButtonElement;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  activeIndex.value = idx;
};

const navHandler = (direction: "prev" | "next") => {
  const idx = activeIndex.value;
  if (direction === "prev" && idx > 0) activeIndex.value = idx - 1;
  if (direction === "next" && idx < props.galleries.length - 1)
    activeIndex.value = idx + 1;
  const previewEl = document.querySelector(
    `button img[data-idx="${activeIndex.value}"]`,
  ) as HTMLImageElement;
  previewEl.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>
