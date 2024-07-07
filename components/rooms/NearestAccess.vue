<template>
  <div class="p-6 flex gap-6 pb-20">
    <h2 class="text-2xl w-[25%] flex-shrink-0">Akses Terdekat</h2>
    <div class="w-full">
      <UInput v-model="search" placeholder="Cari fasilitas" class="mb-5" />
      <div class="flex-grow flex flex-wrap gap-6">
        <button
          v-if="!isArrayEmpty(nearestAccess)"
          v-for="facility in nearestAccess"
          :key="facility.code"
          :class="
            cn(
              'px-2.5 py-2 border flex items-center gap-2 border-gray-300 rounded-md hover:bg-gray-50',
              modelValue.includes(facility.id) &&
                'bg-black text-white border-black hover:bg-black',
            )
          "
          @click="toggleNearestAccess(facility.id)"
        >
          <HomiIcon
            :name="nearestAccessIcons[facility.code]?.icon"
            class="w-5 h-5"
          />
          {{ facility.title }}
        </button>
        <div v-else class="w-full">
          <p class="text-gray-400 text-center py-10">Akses terdekat yang kamu cari belum ada</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HomiIcon from "~/components/ui/HomiIcon.vue";
import nearestAccessIcons from "~/constants/nearest-access-icons";
import getAllNearestAccess from "~/repositories/facilities/get-all-nearest-access";

const props = defineProps<{
  modelValue: string[];
}>();

const emits = defineEmits<{
  (event: "update:modelValue", value: string[]): void;
}>();

const search = ref("");

const nearestAccessQuery = useAsyncData("nearest-access", () =>
  getAllNearestAccess(),
);

const nearestAccess = computed(() => {
  if (!nearestAccessQuery.data) return [];
  return nearestAccessQuery.data.value?.payload?.filter((facility) =>
    facility.title.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const toggleNearestAccess = (id: string) => {
  const index = props.modelValue.indexOf(id);
  emits(
    "update:modelValue",
    index === -1
      ? [...props.modelValue, id]
      : props.modelValue.filter((_, i) => i !== index),
  );
};
</script>
