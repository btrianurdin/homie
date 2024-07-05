<template>
  <Suspense>
    <template #fallback>
      <div>loading..</div>
    </template>
    <div class="bg-white">
      <div class="max-w-screen-lg w-full mx-auto mb-5 pt-10">
        <UBreadcrumb
          divider=">"
          :links="[
            { label: 'Home', to: '/' },
            { label: 'Kos di Jakarta', to: '/' },
            { label: 'Kos pak andi soraya' },
          ]"
        />
      </div>
      <div
        :class="cn('galleries', isArrayEqualTo(galleries, 1) && 'w-full !flex')"
      >
        <img
          :src="galleries?.[0]"
          class="object-cover object-center w-full h-[500px]"
        />
        <div
          v-if="isArrayGreaterThan(galleries, 1)"
          class="relative grid grid-rows-3 gap-3 h-[500px]"
        >
          <img
            v-for="gallery in galleries.slice(1, 4)"
            :key="gallery"
            :src="gallery"
            class="w-full h-full object-cover object-center"
          />
          <UButton
            color="white"
            class="absolute right-5 bottom-5 shadow-2xl"
            @click="showAllGalleryHandler"
          >
            Lihat semua galeri
          </UButton>
        </div>
      </div>
      <div class="max-w-screen-lg mx-auto py-5 pb-10 flex items-start gap-6">
        <div class="w-full flex flex-col gap-6">
          <div class="border-b pb-8">
            <div class="flex items-center gap-4 mb-3">
              <div class="px-2 py-1 bg-gray-100 rounded-md">
                {{ RoomTypeLabel[details?.type!] }}
              </div>
              <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-star-16-solid" class="h-5 w-5" />
                <span>{{ details?.rating ?? "-" }} </span>
              </div>
              <UButton
                class="flex items-center gap-1 ml-auto"
                variant="outline"
                @click="shareHandler"
              >
                <UIcon name="i-heroicons-share-16-solid" class="h-5 w-5 mr-1" />
                <span>Bagikan</span>
              </UButton>
            </div>
            <h2 class="text-3xl font-semibold mb-4">{{ details?.title }}</h2>
            <div class="flex items-center gap-5">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin-16-solid" class="h-5 w-5" />
                <span>{{ addressRegion }}</span>
              </div>
              <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div class="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                >
                  <path
                    fill="currentColor"
                    d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6zm-4 5v2h2v-2z"
                  />
                </svg>
                <span>Tersisa {{ details?.roomsAvailable }} kamar</span>
              </div>
            </div>
          </div>
          <div class="pb-8 border-b">
            <h2 class="text-2xl font-medium mb-2">
              Informasi dari pemilik kos
            </h2>
            <div class="[&_p]:mb-2" v-html="details?.description"></div>
          </div>
          <div class="pb-8 border-b">
            <h2 class="text-2xl font-medium mb-2">Fasilitas</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque totam optio, iure temporibus, voluptate expedita
              officia accusamus porro laudantium provident atque quam doloribus
              eveniet, omnis cumque ullam nihil fugit dolor.
            </p>
          </div>
          <div class="pb-8 border-b">
            <h2 class="text-2xl font-medium mb-2">Akses Terdekat</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloremque totam optio, iure temporibus, voluptate expedita
              officia accusamus porro laudantium provident atque quam doloribus
              eveniet, omnis cumque ullam nihil fugit dolor.
            </p>
          </div>
          <div class="border-b pb-8">
            <h2 class="text-2xl font-medium mb-3">Peta Lokasi</h2>
            <RoomLocationMap :coordinates="coodinates!" />
          </div>
          <div>
            <h2 class="text-xl font-medium mb-3">Pemilik kos</h2>
            <div class="flex items-center gap-4">
              <img
                :src="details?.owner?.picture ?? '/blank-profile.png'"
                class="w-16 h-16 rounded-full"
              />
              <div>
                <h3 class="text-lg font-semibold mb-1">
                  {{ details?.owner.name }}
                </h3>
                <p class="text-sm">
                  Bergabung sejak
                  {{ ddate(details?.owner.created_at).format("DD MMMM YYYY") }}
                </p>
              </div>
              <div class="ml-auto">
                <NuxtLink :to="`tel:${details?.owner.phone}`">
                  <UButton
                    color="primary"
                    icon="i-heroicons-device-phone-mobile-20-solid"
                  >
                    Hubungi Pemilik
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="sticky top-20 w-[35%] flex-shrink-0 bg-red-50">
          <UCard :ui="{ base: 'p-0 !shadow-lg' }">
            <h3 class="text-xl font-semibold mb-4">
              {{ currency(details?.price!) }}
              <span class="text-base font-normal">/ Bulan</span>
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UInput class="w-full" :value="bookDatePrint" />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="bookState.date"
                    is-required
                    locale="id"
                    :min-date="new Date()"
                    @close="close"
                  />
                </template>
              </UPopover>
              <USelectMenu
                v-model="bookState.period"
                class="w-full mb-4"
                :options="periodOptions"
                placeholder="Periode Sewa"
              />
            </div>
            <div
              v-if="!!bookState.period && priceSummary"
              class="mb-5 flex flex-col gap-3 border-y py-4"
            >
              <div class="flex justify-between items-center">
                <p class="text-gray-500">Harga perbulan</p>
                <p>{{ currency(priceSummary.monthly!) }}</p>
              </div>
              <div
                v-if="!!priceSummary.period"
                class="flex justify-between items-center"
              >
                <p class="text-gray-500">Harga per 6 Bulan</p>
                <p>{{ currency(priceSummary.period) }}</p>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-gray-500">Total Bayar</p>
                <p class="text-lg font-medium">
                  {{ currency(priceSummary.total) }}
                </p>
              </div>
            </div>
            <UButton
              class="w-full justify-center"
              size="lg"
              :disabled="!bookState.period"
            >
              Pesan Sekarang
            </UButton>
          </UCard>
        </div>
      </div>
      <Footer />
    </div>
  </Suspense>
</template>
<script setup lang="ts">
import GalleryModal from "~/components/rooms/GalleryModal.vue";
import RoomLocationMap from "~/components/rooms/RoomLocationMap.vue";
import Footer from "~/components/shared/Footer.vue";
import DatePicker from "~/components/ui/DatePicker.vue";
import getRoomDetail from "~/repositories/public/room/get-room-detail";
import {
  AllowPeriodLabel,
  PeriodInNumber,
  RoomTypeLabel,
  type PeriodType,
} from "~/types";
import { isArrayGreaterThan } from "~/utils/array";
import ddate from "~/utils/ddate";

definePageMeta({
  layout: "common",
});

const route = useRoute();
const modal = useModal();
const roomId = computed(() => route.params.id as string);

const bookState = reactive({
  date: ddate().toDate(),
  period: null,
});

const bookDatePrint = computed(() => {
  return ddate(bookState.date).format("DD MMM YYYY");
});

const priceSummary = computed(() => {
  if (!bookState.period) return null;
  const selectedPeriod = bookState.period as { id: string; label: string };
  const monthlyPrice = details.value?.price;
  const period = PeriodInNumber[selectedPeriod.id as PeriodType];
  return {
    monthly: monthlyPrice,
    period: period > 1 ? Number(monthlyPrice) * period : null,
    total: Number(monthlyPrice) * period,
  };
});

const detailsQuery = useAsyncData("details", () =>
  getRoomDetail(roomId.value!),
);
const details = computed(() => detailsQuery.data.value?.payload);
const addressRegion = computed(() => {
  const address = details?.value?.address?.split(",");
  return `${address?.[3]},${address?.[4]}`;
});

const galleries = computed(() => {
  return details.value?.galleries?.map((gallery) => gallery.image) ?? [];
});

const periodOptions = computed(() => {
  return details.value?.allowBookPeriod?.split(",").map((val) => ({
    id: val,
    label: AllowPeriodLabel?.[val as keyof typeof AllowPeriodLabel],
  }));
});

const coodinates = computed(() => {
  return [details.value?.longitude, details.value?.latitude] as string[];
});

const showAllGalleryHandler = () => {
  modal.open(GalleryModal, {
    preventClose: true,
    galleries: galleries.value,
    onClose: () => modal.close(),
  });
};

const shareHandler = () => {};
</script>
<style scoped>
.galleries {
  display: grid;
  grid-template-columns: 1fr 25%;
  overflow: hidden;
  gap: 12px;
}
</style>
