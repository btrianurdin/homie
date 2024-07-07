<template>
  <UForm
    ref="formRef"
    :schema="createRoomSchema"
    :state="formState"
    class="flex flex-col gap-3"
    @error="(error) => emits('errorForm', error?.errors)"
    @submit="handleSubmit"
  >
    <UFormGroup label="Nama Kos" name="title" class="w-full">
      <UInput v-model="formState.title" placeholder="Masukkan judul/nama kos" />
    </UFormGroup>
    <UFormGroup label="Deskripsi" name="description">
      <template #default="{ error }">
        <TiptapEditorContent
          :editor="editor"
          :class="error && 'description-error'"
        />
      </template>
    </UFormGroup>
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Harga" name="price" class="flex-grow">
        <UInput
          v-model="priceFormat"
          placeholder="Masukkan harga"
          input-class="!pe-16"
        >
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-sm">
              / Bulan
            </span>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup label="Tipe Kos" name="type">
        <USelectMenu
          v-model="formState.type"
          :options="[
            { id: 'men', label: 'Putra' },
            { id: 'women', label: 'Putri' },
            { id: 'all', label: 'Campur' },
          ]"
          value-attribute="id"
          option-attribute="label"
          placeholder="Pilih tipe kos"
        />
      </UFormGroup>
    </div>
    <UFormGroup label="Periode Sewa" name="period">
      <USelectMenu
        v-model="formState.period"
        :options="bookingPeriod"
        value-attribute="id"
        option-attribute="label"
        multiple
      >
        <template #label>
          <span v-if="formState.period.length" class="truncate">
            {{
              formState.period
                .map(
                  (p: string) =>
                    bookingPeriod.find((b: any) => b.id === p)?.label,
                )
                .join(", ")
            }}
          </span>
          <span v-else> Pilih periode sewa </span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Jumlah Kamar" name="total_rooms">
        <UInput
          v-model="formState.total_rooms"
          placeholder="Masukkan jumlah kamar"
        />
      </UFormGroup>
      <UFormGroup label="Jumlah Kamar Tersedia" name="slots">
        <UInput
          v-model="formState.slots"
          placeholder="Masukkan jumlah tersedia"
        />
      </UFormGroup>
    </div>
    <div>
      <p class="text-sm mb-2">Pilih Titik Lokasi</p>
      <div id="geocoder" class="geocoder-search"></div>
      <div class="relative rounded-md overflow-hidden">
        <div id="map" class="h-96" />
      </div>
    </div>
    <UFormGroup
      label="Lokasi (terisi otomatis)"
      name="address"
      class="relative"
    >
      <UTextarea
        v-model="formState.address"
        placeholder="Lokasi kos"
        disabled
      />
      <UIcon
        v-if="searchLocationLoading"
        name="i-lucide-loader"
        class="absolute top-2 right-2 animate-spin"
      />
    </UFormGroup>
    <button ref="buttonSubmitRef" type="submit" class="sr-only">submit</button>
    <div class="mb-10" />
  </UForm>
</template>
<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import type { SearchPointResponse } from "~/types";
import type { FormSubmitEvent } from "#ui/types";
import createRoomSchema, {
  type CreateRoomSchema,
} from "~/schema/create-room-schema";

const buttonSubmitRef = ref<HTMLButtonElement | null>(null);
const formRef = ref<HTMLFormElement | null>(null);
const config = useRuntimeConfig();

const emits = defineEmits<{
  (e: "submitClick"): void;
  (e: "submit", data: CreateRoomSchema): void;
  (e: "errorForm", error: any[]): void;
}>();

const editor = useEditor({
  content: "Kos ini memiliki fasilitas yang lengkap dan nyaman.",
  extensions: [TiptapStarterKit, TiptapParagraph],
  onCreate: (content) => {
    formState.description = content.editor.getHTML();
  },
  onUpdate: (content) => {
    formState.description = content.editor.getHTML();
  },
  editorProps: {
    attributes: {
      class:
        "min-h-[130px] py-1.5 px-2.5 rounded-md ring-inset ring-1 ring-gray-300 focus:ring-2 focus:ring-black focus:outline-none shadow-sm",
    },
  },
});

const searchLocationLoading = ref(false);
const locationPoint = ref<mapboxgl.LngLat | null>(null);
const locationBbox = ref<number[] | null>(null);
const formState = reactive({
  title: "",
  description: "",
  price: "",
  price_period: "",
  period: [],
  type: "",
  total_rooms: "",
  slots: "",
  address: "",
});

const priceFormat = computed({
  get: () => {
    return formState.price
      .replace(/\./g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },
  set: (value) => {
    formState.price = value.replace(/\./g, "");
  },
});

const bookingPeriod = [
  {
    id: "month",
    label: "Perbulan",
  },
  {
    id: "3months",
    label: "Per 3 Bulan",
  },
  {
    id: "6months",
    label: "Per 6 Bulan",
  },
  {
    id: "year",
    label: "Per Tahun",
  },
];

const map = ref<mapboxgl.Map | null>(null);

const searchLocationPointQuery = await useLazyAsyncData(
  () =>
    $fetch<SearchPointResponse>("/api/locations/search-point", {
      query: {
        lat: locationPoint.value?.lat,
        lng: locationPoint.value?.lng,
      },
    }),
  {
    watch: [locationPoint],
    immediate: false,
  },
);

watch(
  () => searchLocationPointQuery.data,
  (location) => {
    if (location) {
      searchLocationLoading.value = false;
      formState.address = location.value?.payload?.full_address || "";
      locationBbox.value = location.value?.payload?.bbox || [];
      formRef.value?.validate("address");
    }
  },
  {
    deep: true,
  },
);

const mapController = () => {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    language: "id",
    placeholder: "Cari lokasi",
  });

  geocoder.onAdd(map.value as mapboxgl.Map);
  geocoder.addTo("#geocoder");

  map.value?.on("style.load", () => {
    map?.value?.addControl(
      new mapboxgl.FullscreenControl({
        container: document.querySelector("#map") as HTMLElement,
      }),
    );
    map.value?.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
    );

    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([0, 0])
      .addTo(map.value as mapboxgl.Map);

    map.value?.on("click", (e) => {
      searchLocationLoading.value = true;
      marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      locationPoint.value = e.lngLat;
    });
  });
};

const mapInit = (position: GeolocationPosition) => {
  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [position.coords.longitude, position.coords.latitude],
    minZoom: 3,
    zoom: 13,
  });

  mapController();
};

onMounted(() => {
  mapboxgl.accessToken = config.public.mapBoxApi as string;
  navigator.geolocation.getCurrentPosition(mapInit);

  document.querySelector("#save-button")?.addEventListener("click", () => {
    buttonSubmitRef.value?.click();
  });
});

onUnmounted(() => {
  map.value?.remove();
});

const alert = useAlert();

const handleSubmit = (e: FormSubmitEvent<CreateRoomSchema>) => {
  if (!locationPoint.value || !locationBbox.value) {
    alert.error({
      title: "Gagal",
      message: "Silahkan pilih lokasi kos",
    });
    return;
  }

  emits("submit", {
    ...e.data,
    description: formState.description,
    point: locationPoint.value!,
    bbox: locationBbox.value!,
  });
};
</script>
<style lang="postcss">
.description-error .tiptap {
  @apply ring-red-500;
}
.geocoder-search {
  @apply w-full z-30 [&_.mapboxgl-ctrl]:!max-w-full [&_.mapboxgl-ctrl]:!w-full mb-3;
  & .mapboxgl-ctrl-geocoder {
    @apply z-10 ring-1 ring-gray-300 rounded-md shadow-sm;
  }
  & input {
    @apply rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black;
  }
  & .suggestions-wrapper {
    @apply relative;
  }
  & .suggestions {
    @apply bg-white shadow-md rounded-md;
  }
}
</style>
