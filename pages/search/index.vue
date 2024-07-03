<template>
  <div class="absolute inset-0 flex w-full h-full bg-white">
    <div class="w-1/2 border-r overflow-auto">
      <div class="p-4 border-b">
        <h1 class="text-2xl font-semibold">
          Pencarian kos di
          {{
            searchParams.type === "place"
              ? searchParams.city_name
              : "sekitar anda"
          }}
        </h1>
        <p class="text-gray-500 text-sm">
          Menampilkan {{ roomLists.length }} hasil pencarian
        </p>
      </div>
      <div
        v-if="isLoadingLists"
        v-for="(_, idx) in createArray(3)"
        class="p-4 flex gap-3 w-full border-b"
        :key="`sk-${idx}`"
      >
        <Skeleton class="w-[260px] h-[160px] flex-shrink-0" />
        <div class="flex flex-col gap-3 w-full">
          <Skeleton />
          <Skeleton class="w-1/2" />
          <Skeleton class="w-full h-3" />
          <Skeleton class="w-full h-3" />
          <Skeleton class="mt-auto" />
        </div>
      </div>
      <NuxtLink
        v-if="!isLoadingLists && roomLists.length"
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
      <div v-if="!isLoadingLists && !roomLists.length" class="p-4 text-center">
        <p class="text-gray-500 py-8">Yahh! tidak ada kos di daerah sini!</p>
      </div>
    </div>
    <SearchMap
      :type="searchParams.type"
      :coordinates="searchParams?.coordinates!"
      :bbox="searchParams?.bbox!"
      @clusterUpdate="clusterUpdateHandler"
      @clusterClick="clusterUpdateHandler"
    />
  </div>
</template>
<script setup lang="ts">
import Skeleton from "~/components/shared/Skeleton.vue";
import getRoomLists from "~/repositories/public/room/get-room-lists";
import { RoomTypeLabel, type RoomListResponse } from "~/types";

definePageMeta({
  layout: "common",
});

const route = useRoute();
const roomLists = ref<RoomListResponse["rooms"]>([]);
const isLoadingLists = ref(true);

type SearchParams = {
  bbox?: number[];
  city_name?: string;
  coordinates?: number[];
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
  isLoadingLists.value = true;
  const res = await getRoomLists({
    bounds: data.bounds,
    zoom: data.zoom,
    cluster_id: data.cluster_id,
  });

  isLoadingLists.value = false;
  roomLists.value = res.payload?.rooms || [];
};
</script>
