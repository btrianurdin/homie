<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="flex flex-col items-center w-full p-6 pb-0 py-5 border-b">
      <div class="flex justify-between items-center w-full mb-3">
        <h2 class="text-2xl font-semibold">Tambah Kos Baru</h2>
        <div class="flex gap-3">
          <UButton
            to="/owner/rooms"
            variant="outline"
            :disabled="createRoomHandler.loading.value"
          >
            Batalkan
          </UButton>
          <UButton
            id="save-button"
            to="/owner/rooms/create"
            :loading="createRoomHandler.loading.value"
          >
            {{ activeTab === "room" ? "Selanjutnya" : "Simpan" }}
          </UButton>
        </div>
      </div>
      <div class="relative flex gap-8">
        <button
          :class="['px-3 py-1 border-b-2 border-transparent']"
          @click="activeTab = 'room'"
        >
          Kamar
        </button>
        <button
          :class="['px-3 py-1 border-b-2 border-transparent']"
          @click="activeTab = 'facility'"
        >
          Fasilitas
        </button>
        <div
          :class="[
            'absolute bottom-0 transition-all duration-300 left-0 w-1/2 h-1 bg-black rounded-t-lg',
            activeTab === 'room' && 'w-[40%] -left-[3px]',
            activeTab === 'facility' && 'w-[46%] left-[100px]',
          ]"
        />
      </div>
    </div>

    <div
      :class="[
        'h-full w-full grid grid-cols-[40%_60%] p-6 pr-10 gap-5 overflow-x-hidden',
        activeTab === 'facility' && 'hidden',
      ]"
    >
      <GalleryUpload v-model="galleries" />
      <CreateRoomForm @submit="submitHandler" @errorForm="errorFormHandler" />
    </div>
    <div
      :class="[
        'h-full w-full overflow-x-hidden',
        activeTab === 'room' && 'hidden',
      ]"
    >
      <FacilityForm v-model="facilities" />
      <NearestAccess v-model="nearestAccess" />
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateRoomForm from "~/components/rooms/CreateRoomForm.vue";
import FacilityForm from "~/components/rooms/FacilityForm.vue";
import GalleryUpload from "~/components/rooms/GalleryUpload.vue";
import NearestAccess from "~/components/rooms/NearestAccess.vue";
import useMutation from "~/composables/use-mutation";
import createRoom from "~/repositories/room/create-room";
import type { CreateRoomSchema } from "~/schema/create-room-schema";

definePageMeta({
  layout: "owner",
  middleware: ["auth-owner"],
});

const activeTab = ref<"room" | "facility">("room");

const router = useRouter();
const alert = useAlert();

const galleries = ref<{ id: string; url: string }[]>([]);
const facilities = ref<string[]>([]);
const nearestAccess = ref<string[]>([]);

const createRoomHandler = useMutation(createRoom);

const submitHandler = (data: CreateRoomSchema) => {
  if (galleries.value.length < 4) {
    if (activeTab.value === "facility") activeTab.value = "room";
    alert.error({
      title: "Gagal",
      message: "Silahkan tambahkan minimal 4 gambar",
    });
    return;
  }

  if (activeTab.value === "room") {
    activeTab.value = "facility";
    return;
  }

  if (facilities.value.length === 0) {
    alert.error({
      title: "Gagal",
      message: "Silahkan pilih minimal 1 fasilitas",
    });
    return;
  }

  if (nearestAccess.value.length === 0) {
    alert.error({
      title: "Gagal",
      message: "Silahkan pilih minimal 1 akses terdekat",
    });
    return;
  }

  createRoomHandler.mutate(
    {
      ...data,
      galleries: galleries.value.map((gallery) => gallery.url),
      nearestAccess: nearestAccess.value,
      facilities: facilities.value,
    },
    {
      onSuccess: () => {
        alert.success({
          title: "Berhasil",
          message: "Kos berhasil ditambahkan",
        });
        router.push("/owner/rooms");
      },
      onError: () => {
        alert.error({
          title: "Gagal",
          message: "Terjadi kesalah saat menambahkan kos",
        });
      },
    },
  );
};

const errorFormHandler = async (errors: any[]) => {
  if (activeTab.value === "facility") {
    activeTab.value = "room";
    await delayAsync(100);
  }

  const element = document.getElementById(errors[0]?.id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
};
</script>
