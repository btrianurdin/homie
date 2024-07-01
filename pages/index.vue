<template>
  <div class="mx-auto bg-white">
    <div class="relative max-w-4xl py-5 mx-auto px-6 lg:px-0">
      <div class="flex items-center justify-between gap-10">
        <div class="w-1/2">
          <h4
            class="mb-4 border border-black inline-block px-3 py-1 rounded-md"
          >
            1st platform pencarian kos
          </h4>
          <h2 class="text-[50px] leading-[56px] font-semibold mb-4">
            Cari Kos Semudah Nongkrong di Cafe
          </h2>
          <p class="text-lg mb-4">
            Temukan kos-kosan yang nyaman dan terjangkau di sekitar kamu.
          </p>
          <UButton id="action-button" size="xl" @click="actionClickHandler">
            Saya Mau Cari Kos!
          </UButton>
        </div>
        <div
          class="w-[300px] h-[300px] z-0 absolute -right-28 bottom-20 bg-gray-400 rounded-full bg-opacity-20"
        ></div>
        <SvgTownVector class="w-1/3 flex-shrink-0 relative z-0" />
      </div>
    </div>
    <div class="border-t">
      <div class="max-w-4xl mx-auto py-10 px-3 lg:px-0">
        <div class="mb-10">
          <h2 class="text-xl font-semibold">Cari berdasarkan kota</h2>
          <p class="mb-3">Pilih kota yang ingin kamu cari kos-kosannya.</p>
          <div>
            <UCarousel
              v-slot="{ item }"
              :items="cityLists"
              :ui="{ item: 'snap-start' }"
            >
              <NuxtLink to="/" class="relative w-[200px] h-[200px] px-1.5">
                <img
                  :src="item.image"
                  class="w-full h-full rounded-md object-cover"
                  draggable="false"
                />
                <div
                  class="absolute top-0 bottom-0 right-1.5 left-1.5 bg-black bg-opacity-50 rounded-md"
                ></div>
                <p
                  class="absolute text-white z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  {{ item.name }}
                </p>
              </NuxtLink>
            </UCarousel>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-semibold">Rekomendasi</h2>
          <p class="mb-3">Temukan kos-kosan yang nyaman dan terjangkau di sekitar kamu.</p>
          <div class="grid grid-cols-3 gap-6">
            <UCard
              v-for="room in recommendationLists.data.value?.payload"
              :key="room.id"
              :ui="{
                base: '',
                header: { padding: '!p-0' },
                body: { padding: '!p-4' },
                footer: { padding: '!p-4' },
              }"
            >
              <template #header>
                <img
                  :src="room.galleries[0].image"
                  class="w-full h-[200px] object-cover object-center rounded-t-md"
                />
              </template>
              <div class="h-14 flex items-center mb-2">
                <h3 class="text-lg font-medium two-lines">
                  {{ room.title }}
                </h3>
              </div>
              <div>
                <div class="flex justify-between mb-3">
                  <div class="py-1 px-3 text-sm rounded-md bg-gray-200">
                    {{ RoomTypeLabel[room.type] }}
                  </div>
                  <div>
                    <span class="text-lg font-semibold">{{
                      currency(room.price)
                    }}</span>
                    <span class="text-sm text-gray-500"
                      >/ {{ PricePeriodLabel[room.pricePeriod] }}</span
                    >
                  </div>
                </div>
                <p class="text-sm text-gray-500">{{ room.address }}</p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center pb-20 pt-10 border-t">
      <p class="mb-2">Homie - Cari Kosan Secepat Kilat</p>
      <p>
        &copy; 2024 Homie. All rights reserved.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import cityLists from "~/data/city-lists";
import getRecommendations from "~/repositories/public/room/get-recommendations";
import { PricePeriodLabel, RoomTypeLabel } from "~/types";

definePageMeta({
  layout: "common",
});

const recommendationLists = await useLazyAsyncData(() => getRecommendations(), {
  server: false,
});

const actionClickHandler = () => {
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;

  searchInput.focus();
};
</script>
