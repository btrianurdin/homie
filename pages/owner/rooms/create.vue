<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="flex justify-between items-center w-full p-6 py-5 border-b">
      <h2 class="text-2xl font-semibold">Tambah Kos Baru</h2>
      <div class="flex gap-3">
        <UButton
          to="/owner/rooms"
          variant="outline"
          :disabled="createRoomHandler.loading.value"
        >
          Cancel
        </UButton>
        <UButton
          id="save-button"
          to="/owner/rooms/create"
          :loading="createRoomHandler.loading.value"
        >
          Simpan
        </UButton>
      </div>
    </div>
    <div
      class="h-full w-full grid grid-cols-[40%_60%] p-6 pr-10 gap-5 overflow-x-hidden"
    >
      <GalleryUpload
        :galleries="galleries"
        @gallery-added="galleryAddedHandler"
        @gallery-removed="galleryRemovedHandler"
      />
      <CreateRoomForm @submit="submitHandler" />
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateRoomForm from "~/components/rooms/CreateRoomForm.vue";
import GalleryUpload from "~/components/rooms/GalleryUpload.vue";
import useMutation from "~/composables/use-mutation";
import createRoom from "~/repositories/room/create-room";
import type { CreateRoomSchema } from "~/schema/create-room-schema";

definePageMeta({
  layout: "owner",
  middleware: ["auth-owner"],
});

const router = useRouter();
const alert = useAlert();

const galleries = ref<{ id: string; url: string }[]>([]);

const galleryAddedHandler = (data: { id: string; url: string }) => {
  galleries.value.unshift(data);
};

const galleryRemovedHandler = (data: { id: string; url: string }) => {
  galleries.value = galleries.value.filter((gallery) => gallery.id !== data.id);
};

const createRoomHandler = useMutation(createRoom);

const submitHandler = (data: CreateRoomSchema) => {
  if (galleries.value.length < 4) {
    alert.error({
      title: "Gagal",
      message: "Silahkan tambahkan minimal 4 gambar",
    });
    return;
  }

  createRoomHandler.mutate(
    {
      ...data,
      galleries: galleries.value.map((gallery) => gallery.url),
    },
    {
      onSuccess: () => {
        alert.toastSuccess({
          title: "Berhasil",
          message: "Kos berhasil ditambahkan",
        });
        router.push("/owner/rooms");
      },
      onError: () => {
        alert.toastError({
          title: "Gagal",
          message: "",
        });
      },
    },
  );
};
</script>
