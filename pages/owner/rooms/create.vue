<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="flex justify-between items-center w-full p-6 py-5 border-b">
      <h2 class="text-2xl font-semibold">Tambah Kos Baru</h2>
      <div class="flex gap-3">
        <UButton to="/owner/rooms" variant="outline"> Cancel </UButton>
        <UButton id="save-button" to="/owner/rooms/create"> Simpan </UButton>
      </div>
    </div>
    <div class="h-full p-6 flex gap-10 overflow-auto">
      <div class="w-2/5 flex flex-col gap-4">
        <div
          v-for="gallery in galleries"
          :key="gallery.id"
          class="rounded-md overflow-hidden"
        >
          <img :src="gallery.url" class="w-full h-[200px] object-cover" />
        </div>
        <p v-if="galleryError" class="text-sm text-red-600 my-2">
          {{ galleryError }}
        </p>
        <button @click="addImageHandler" class="w-full">
          <UCard class="hover:bg-gray-50 hover:cursor-pointer">
            <div class="flex items-center gap-1 justify-center">
              <UIcon
                v-if="!uploadMutation.loading.value"
                name="i-heroicons-plus"
                class="w-5 h-5"
              />
              <UIcon
                v-else="uploadMutation.loading.value"
                name="i-lucide-loader"
                class="w-5 h-5 animate-spin"
              />
              Tambah Gambar
            </div>
          </UCard>
        </button>
        <input
          ref="inputFileRef"
          type="file"
          class="sr-only"
          accept="image/jpg, image/jpeg, image/png"
          @change="fileChangedHandler"
        />
      </div>
      <CreateRoomForm @submit="submitHandler" />
    </div>
  </div>
</template>
<script setup lang="ts">
import CreateRoomForm from "~/components/rooms/CreateRoomForm.vue";
import useMutation from "~/composables/use-mutation";
import createRoom from "~/repositories/room/create-room";
import uploadGallery from "~/repositories/room/upload-gallery";
import type { CreateRoomSchema } from "~/schema/create-room-schema";

definePageMeta({
  layout: "owner",
});

const galleries = ref<{ id: string; url: string }[]>([]);
const galleryError = ref<string | null>(null);
const inputFileRef = ref<HTMLInputElement | null>(null);

const addImageHandler = () => {
  if (uploadMutation.loading.value) return;
  if (inputFileRef.value) inputFileRef.value.click();
};

const uploadMutation = useMutation(uploadGallery);

const fileChangedHandler = (e: Event) => {
  const { files } = e.target as HTMLInputElement;
  if (files?.[0]) {
    uploadMutation.mutate(files[0], {
      onSuccess: (data) => {
        galleryError.value = null;
        galleries.value.unshift({
          id: data.payload?.id!,
          url: data.payload?.url!,
        });
      },
    });
  }
};

const router = useRouter();
const alert = useAlert();
const createRoomHandler = useMutation(createRoom);

const submitHandler = (data: CreateRoomSchema) => {
  if (galleries.value.length === 0) {
    galleryError.value = "Gambar kos wajib diisi";
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
