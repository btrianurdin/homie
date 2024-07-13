<template>
  <div class="flex flex-col gap-4">
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
    <div
      v-for="gallery in modelValue"
      :key="gallery.id"
      class="relative rounded-md overflow-hidden flex-shrink-0"
    >
      <img
        :src="gallery.url"
        class="w-full h-[200px] object-cover bg-gray-300"
      />
      <UButton
        class="absolute top-2 right-2"
        color="red"
        @click="
          () => removeGalleryHandler({ id: gallery.id, url: gallery.url })
        "
        :loading="
          removeMutation.loading &&
          removeMutation.variable.value?.id === gallery.id
        "
      >
        <UIcon name="i-heroicons-trash" class="" />
      </UButton>
    </div>
    <input
      ref="inputFileRef"
      type="file"
      class="sr-only"
      accept="image/jpg, image/jpeg, image/png, image/webp"
      @change="fileChangedHandler"
    />
  </div>
</template>
<script setup lang="ts">
import removeGallery from "~/repositories/room/remove-gallery";
import uploadGallery from "~/repositories/room/upload-gallery";

const props = defineProps<{
  modelValue: { id: string; url: string }[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", data: { id: string; url: string }[]): void;
}>();

const inputFileRef = ref<HTMLInputElement | null>(null);

const uploadMutation = useMutation(uploadGallery);

const addImageHandler = () => {
  if (uploadMutation.loading.value) return;
  if (inputFileRef.value) inputFileRef.value.click();
};

const fileChangedHandler = (e: Event) => {
  const { files } = e.target as HTMLInputElement;
  if (files?.[0]) {
    uploadMutation.mutate(files[0], {
      onSuccess: (data) => {
        if (data.payload) {
          emits("update:modelValue", [data.payload, ...props.modelValue]);
        }
      },
    });
    return;
  }
  inputFileRef.value = null;
};

const route = useRoute();
const removeMutation = useMutation(removeGallery);

const removeGalleryHandler = ({ id, url }: { id: string; url: string }) => {
  removeMutation.mutate(
    {
      roomId: route.params?.id as string,
      id: id,
      imgId: url.split("/").pop()!,
    },
    {
      onSuccess: () => {
        emits(
          "update:modelValue",
          props.modelValue.filter((gallery) => gallery.id !== id),
        );
      },
    },
  );
};
</script>
