<template>
  <div class="relative h-full w-1/2">
    <div
      :class="
        cn(
          'absolute top-5 left-1/2 -translate-x-1/2 z-40 -translate-y-20 transition-transform duration-300',
          loading.clusters && '!translate-y-0',
        )
      "
    >
      <button
        class="flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow-lg"
      >
        <UIcon name="i-lucide-loader" class="animate-spin" />
        Loading...
      </button>
    </div>
    <div
      :class="
        cn(
          'absolute top-5 left-1/2 -translate-x-1/2 z-40 -translate-y-20 transition-transform duration-300',
          needToUpdate && 'translate-y-0',
        )
      "
    >
      <button
        class="bg-white px-3 py-2 rounded-full shadow-lg flex items-center gap-1"
        @click="updateCluster"
      >
        <UIcon name="i-heroicons-magnifying-glass" />
        Cari di area ini
      </button>
    </div>
    <div
      v-if="loading.map"
      class="h-full w-full flex flex-col items-center justify-center"
    >
      <span>Preparing map...</span>
    </div>
    <div class="relative w-full h-full">
      <div id="map" class="h-full" />
    </div>
  </div>
</template>
<script setup lang="ts">
import mapboxgl, { type MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getClusters from "~/repositories/public/room/get-clusters";

const props = defineProps<{
  type: "place" | "nearest";
  coordinates: number[];
  bbox: number[];
}>();

const emits = defineEmits<{
  (
    e: "clusterUpdate" | "clusterClick",
    data: { bounds: number[][]; zoom: number; cluster_id?: string },
  ): void;
}>();

const config = useRuntimeConfig();
mapboxgl.accessToken = config.public.mapBoxApi;

const loading = reactive({
  map: false,
  clusters: false,
});
const needToUpdate = ref(false);
const isZoomMode = ref(false);
const map = ref<mapboxgl.Map | null>(null);
const activeClusterId = ref<string | null>(null);

const createMap = (coordinates: number[], bounds?: number[], zoom?: number) => {
  const opts: MapboxOptions = {
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [coordinates[0], coordinates[1]],
    zoom: zoom || 9,
    maxZoom: 15,
    minZoom: 13,
  };

  if (bounds) {
    opts.bounds = [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ];
  }

  map.value = new mapboxgl.Map(opts);
  map.value.on("style.load", async () => {
    loading.map = false;
    updateCluster();
  });
  map.value.on("zoomend", () => {
    isZoomMode.value = true;
    updateCluster();
  });
  map.value.on("moveend", () => {
    if (isZoomMode.value) {
      isZoomMode.value = false;
      return;
    }
    needToUpdate.value = true;
  });
};

const updateCluster = async () => {
  needToUpdate.value = false;
  loading.clusters = true;
  const bounds = map.value?.getBounds();
  const zoom = map.value?.getZoom();

  emits("clusterUpdate", {
    bounds: bounds?.toArray()!,
    zoom: zoom!,
  });

  const clusters = await getClusters({
    bounds: bounds?.toArray()!,
    zoom: zoom!,
  });
  loading.clusters = false;

  if (!clusters.payload?.clusters) return;
  document.querySelectorAll(".marker").forEach((marker) => marker.remove());

  for (let cluster of clusters.payload?.clusters) {
    const el = document.createElement("div");
    el.className = "marker";
    if (cluster.is_cluster) {
      el.id = cluster.cluster_id!;
      el.className += " marker-cluster";
      el.innerHTML = `<span>${cluster.point_count}</span>`;
    } else {
      el.className += " marker-single";
      el.innerHTML = `<span>${rupiahReadable(cluster.price!)}</span>`;
    }
    el.addEventListener("click", () => {
      activeClusterId.value = null;
      emits("clusterClick", {
        bounds: bounds?.toArray()!,
        zoom: zoom!,
        cluster_id: cluster.cluster_id!,
      });
      if (cluster.is_cluster) {
        activeClusterId.value = cluster.cluster_id!;
      }
    });

    new mapboxgl.Marker(el)
      .setLngLat([cluster.coordinates[0], cluster.coordinates[1]])
      .addTo(map.value!);
  }
};

watch(activeClusterId, (id) => {
  if (id) {
    const cluster = document.getElementById(id);
    if (cluster) {
      document
        .querySelectorAll(".marker-cluster")
        .forEach((cluster) => cluster.classList.remove("active"));
      cluster.classList.add("active");
    }
  }
});

onMounted(() => {
  loading.map = true;
  if (props.type === "place") {
    createMap(props.coordinates, props.bbox);
  }
  if (props.type === "nearest") {
    navigator.geolocation.getCurrentPosition((position) => {
      createMap(
        [position.coords.longitude, position.coords.latitude],
        undefined,
        13,
      );
    });
  }
});

watch(
  () => props.bbox,
  (bbox) => {
    if (map.value) {
      map.value.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          speed: 0.5,
        },
      );
    }
  },
);
</script>
<style lang="postcss">
.marker.marker-cluster {
  @apply bg-white w-8 h-8 rounded-full text-xs flex items-center justify-center text-black border border-gray-400 font-semibold cursor-pointer;
}
.marker.marker-cluster.active {
  @apply bg-black text-white border-black;
}
.marker.marker-single {
  @apply bg-white px-2 py-1 pl-[22px] text-xs rounded-full flex items-center justify-center text-black border border-gray-400;
}
.marker.marker-single {
  content: "";
  background-image: url("/assets/images/svg/house-icon.svg");
  background-size: 15px 15px;
  background-repeat: no-repeat;
  background-position: 5px 3.5px;
}
</style>
