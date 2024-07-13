<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div
      class="flex justify-between items-center w-full p-6 py-5 border-b flex-shrink-0"
    >
      <h2 class="text-2xl font-semibold">Kos Saya</h2>
      <UButton to="/owner/rooms/create" class="" icon="i-heroicons-plus">
        Tambah Kos
      </UButton>
    </div>
    <div
      class="h-full flex-grow grid grid-cols-3 items-start gap-3 p-6 overflow-auto"
    >
      <UCard
        v-for="room in roomsQuery.data.value?.payload"
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
          <h3 class="text-lg font-medium two-lines">{{ room.title }}</h3>
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
              <span class="text-sm text-gray-500"> / Bulan</span>
            </div>
          </div>
          <p class="text-sm text-gray-500">{{ room.address }}</p>
        </div>
        <template #footer>
          <div class="grid grid-cols-3 justify-end gap-3">
            <NuxtLink
              :to="`/room/${room.id}`"
              target="_blank"
              class="inline-block"
            >
              <UButton
                icon="i-heroicons-eye"
                color="indigo"
                class="justify-center w-full"
              >
                Lihat
              </UButton>
            </NuxtLink>
            <NuxtLink :to="`/owner/rooms/${room.id}/update`">
              <UButton icon="i-heroicons-pencil" class="justify-center w-full">
                Edit
              </UButton>
            </NuxtLink>
            <UButton
              icon="i-heroicons-trash"
              color="red"
              class="justify-center"
            >
              Hapus
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import getRooms from "~/repositories/room/get-rooms";
import { RoomTypeLabel } from "~/types";

definePageMeta({
  layout: "owner",
  middleware: ["auth-owner"],
});

useHead({
  title: "Daftar Kos Punyamu",
});

const roomsQuery = await useLazyAsyncData("rooms", getRooms, {
  server: false,
});
</script>
<style scoped>
.two-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
