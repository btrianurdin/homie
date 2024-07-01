<template>
  <div class="h-full w-1/2">
    <div id="map" class="h-full" />
  </div>
</template>
<script setup lang="ts">
import mapboxgl from "mapbox-gl";
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

const map = ref<mapboxgl.Map | null>(null);
const activeClusterId = ref<string | null>(null);

const createMap = (coordinates: number[]) => {
  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [coordinates[0], coordinates[1]],
    zoom: 9,
    maxZoom: 15,
    minZoom: 6,
    bounds: [
      [props.bbox[0], props.bbox[1]],
      [props.bbox[2], props.bbox[3]],
    ],
  });

  map.value.on("zoomend", async () => updateCluster());
};

const updateCluster = async () => {
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
  if (props.type === "place") {
    createMap(props.coordinates);
  }
  updateCluster();
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
  @apply bg-blue-600 text-white border-blue-500;
}
.marker.marker-single {
  @apply bg-white px-2 py-1 text-xs rounded-full flex items-center justify-center text-black border border-gray-400;
}
</style>
