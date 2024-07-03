<template>
  <div class="relative flex flex-col min-h-screen">
    <header
      class="sticky h-16 top-0 z-50 px-6 py-4 bg-white border-b flex items-center w-full"
    >
      <NuxtLink to="/">
        <h1 class="text-xl font-semibold">Homie</h1>
      </NuxtLink>
      <div class="relative ml-16 flex items-center justify-between w-full">
        <div class="w-1/2 xl:w-1/3">
          <UInput
            id="search-input"
            v-model="search"
            placeholder="Cari kos"
            autocomplete="off"
          />
          <div
            id="search-box"
            v-if="searchBoxOpen"
            class="absolute mt-2 w-1/2 xl:w-1/3"
          >
            <div class="w-full bg-white shadow-md rounded-md border px-4 py-3">
              <div v-if="suggestions === null">
                <button
                  class="flex items-center p-2 bg-gray-50 rounded-md transition-colors hover:bg-gray-100 w-full mb-3"
                  @click="nearestSearchHandler"
                >
                  <UIcon name="i-heroicons-map-pin" class="w-5 h-5 mr-1" />
                  <p class="font-medium">Cari lokasi sekitar</p>
                </button>
                <p class="text-sm font-medium mb-2">Banyak dicari</p>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="city in citiesCover"
                    class="relative rounded-md overflow-hidden"
                  >
                    <img
                      :src="city.image"
                      class="w-full h-[100px] object-cover"
                    />
                    <div
                      class="bg-black bg-opacity-35 w-full h-full absolute inset-0 z-0"
                    ></div>
                    <p
                      class="absolute text-white z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                    >
                      {{ city.name }}
                    </p>
                  </button>
                </div>
              </div>
              <div v-else>
                <div v-if="suggestions.length" class="flex flex-col gap-4">
                  <button
                    v-for="location in suggestions"
                    class="text-left rounded-md px-2 py-1 bg-gray-50 w-full hover:bg-gray-100 transition-colors"
                    @click="() => suggestionClickHandler(location)"
                  >
                    <p class="font-medium">{{ location.city_name }}</p>
                    <p class="text-xs">{{ location.address }}</p>
                  </button>
                </div>
                <div v-else>
                  <p class="text-sm font-medium text-center py-5">
                    Tidak ada hasil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="status === 'unauthenticated'" class="flex gap-3">
          <NuxtLink to="/auth/sign-up">
            <UButton variant="outline">Daftar</UButton>
          </NuxtLink>
          <NuxtLink to="/auth/sign-in">
            <UButton>Masuk</UButton>
          </NuxtLink>
        </div>
        <div v-else>
          <UDropdown
            :items="[
              [
                {
                  label: 'Profile',
                  to: '/profile',
                },
              ],
              [
                {
                  label: 'Sign Out',
                  click: () => signOut({ callbackUrl: '/' }),
                  class: 'text-red-500',
                },
              ],
            ]"
            :popper="{ placement: 'bottom-start' }"
          >
            <button
              class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            >
              {{ profileLetter }}
            </button>
          </UDropdown>
        </div>
      </div>
    </header>
    <div class="relative w-full h-full flex-grow">
      <div
        v-if="searchBoxOpen"
        class="bg-black z-40 bg-opacity-70 absolute inset-0"
      ></div>
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import locationSuggest from "~/repositories/public/location/location-suggest";
import type { LocationSuggestResponse } from "~/types";

const router = useRouter();
const { data, status, signOut } = useAuth();
const search = ref("");
const searchBoxOpen = ref(false);
const suggestions = ref<LocationSuggestResponse[] | null>(null);

const profileLetter = computed(() => {
  const name = data.value?.user?.name;
  if (name) {
    return name[0].toUpperCase();
  }
  return "?";
});

const openSearchBox = () => {
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;

  searchInput.addEventListener("focus", () => {
    console.log("focus");
    searchBoxOpen.value = true;
  });

  document.addEventListener("click", (e) => {
    const searchBox = document.getElementById("search-box") as HTMLDivElement;
    const actionButton = document.getElementById("action-button");
    if (
      !searchBox?.contains(e.target as Node) &&
      e.target !== searchInput &&
      e.target !== actionButton
    ) {
      searchBoxOpen.value = false;
    }
  });
};

onMounted(() => {
  openSearchBox();
});

const nearestSearchHandler = () => {
  const data = {
    type: "nearest",
  };

  searchBoxOpen.value = false;
  router.push({
    name: "search",
    query: { q: btoa(JSON.stringify(data)) },
  });
};

const suggestionClickHandler = (location: LocationSuggestResponse) => {
  const data = {
    type: "place",
    city_name: location.city_name,
    coordinates: location.coordinates,
    bbox: location.bbox,
  };

  searchBoxOpen.value = false;
  router.push({
    name: "search",
    query: { q: btoa(JSON.stringify(data)) },
  });
};

const onSearchChange = debounce(async () => {
  if (search.value.length < 3) {
    suggestions.value = null;
    return;
  }

  const res = await locationSuggest(search.value);
  suggestions.value = res.payload?.locations || [];
}, 300);

watch(search, () => {
  onSearchChange();
});

const citiesCover = [
  {
    id: "jakarta",
    name: "Jakarta",
    image: "https://educaly.s3.amazonaws.com/assets/jakarta-cover.webp",
  },
  {
    id: "bandunng",
    name: "Bandung",
    image: "https://educaly.s3.amazonaws.com/assets/bandung-cover.webp",
  },
  {
    id: "surabaya",
    name: "Surabaya",
    image: "https://educaly.s3.amazonaws.com/assets/surabaya-cover.webp",
  },
];
</script>
