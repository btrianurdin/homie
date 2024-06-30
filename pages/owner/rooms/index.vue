<template>
  <div class="w-full bg-white">
    <div class="flex justify-between items-center w-full p-6 py-5 border-b">
      <h2 class="text-2xl font-semibold">Kos Saya</h2>
      <UButton to="/owner/rooms/create" class="" icon="i-heroicons-plus"> Tambah Kos </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "owner",
});
</script>
