<template>
  <div class="absolute inset-0 flex w-full h-full bg-white">
    <div class="w-1/2 border-r overflow-auto">
      <div>
        <div class="p-4 border-b">
          <h1 class="text-2xl font-semibold">
            Pencarian kos di {{ searchParams.city_name }}
          </h1>
          <p class="text-gray-500 text-sm">
            Menampilkan {{ roomLists.length }} hasil pencarian
          </p>
        </div>
        <NuxtLink
          v-if="roomLists.length"
          v-for="room in roomLists"
          :key="room.id"
          class="flex gap-3 border-b hover:bg-gray-50 p-4"
        >
          <img
            :src="room?.gallery"
            class="w-[260px] h-[160px] object-cover rounded-md flex-shrink-0"
            alt="room image"
          />
          <div class="w-full flex flex-col items-start">
            <div
              class="px-2 py-1 rounded-md inline-block text-xs mb-2 bg-gray-200"
            >
              {{ RoomTypeLabel[room.type] }}
            </div>
            <h3 class="text-lg font-medium">{{ room.title }}</h3>
            <p class="text-sm text-gray-500">{{ room.address }}</p>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="text-yellow-500" />
              {{ room.rating ?? "-" }}
            </div>
            <div class="mt-auto w-full">
              <span class="text-xl font-semibold">{{
                currency(room.price)
              }}</span>
              <span class="text-sm text-gray-500">
                /{{ room.price_period }}
              </span>
            </div>
          </div>
        </NuxtLink>
        <div v-else class="p-4 text-center">
          <p class="text-gray-500 py-8">Yahh! tidak ada kos di daerah sini!</p>
        </div>
      </div>
    </div>
    <SearchMap
      :type="searchParams.type"
      :coordinates="searchParams.coordinates"
      :bbox="searchParams.bbox"
      @clusterUpdate="clusterUpdateHandler"
      @clusterClick="clusterUpdateHandler"
    />
  </div>
</template>
<script setup lang="ts">
import getRoomLists from "~/repositories/public/room/get-room-lists";
import { RoomTypeLabel, type GetRoom, type RoomListResponse } from "~/types";

definePageMeta({
  layout: "common",
});

const route = useRoute();
const roomLists = ref<RoomListResponse["rooms"]>([]);

type SearchParams = {
  bbox: number[];
  city_name: string;
  coordinates: number[];
  type: "place" | "nearest";
};

const searchParams = computed(() => {
  return JSON.parse(atob(route.query?.q as string)) as SearchParams;
});

const clusterUpdateHandler = async (data: {
  bounds: number[][];
  zoom: number;
  cluster_id?: string;
}) => {
  const res = await getRoomLists({
    bounds: data.bounds,
    zoom: data.zoom,
    cluster_id: data.cluster_id,
  });

  roomLists.value = res.payload?.rooms || [];
};
</script>
