<template>
  <div
    class="relative rounded-md flex flex-col gap-4 items-center overflow-hidden"
  >
    <div id="map" class="h-96 w-full"></div>
    <NuxtLink
      :to="`https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`"
      target="_blank"
    >
      <UButton
        variant="outline"
        icon="i-heroicons-arrow-up-right-16-solid"
        trailing
      >
        Buka di Google Maps
      </UButton>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const config = useRuntimeConfig();
mapboxgl.accessToken = config.public.mapBoxApi;

const props = defineProps<{
  coordinates: string[];
}>();

onMounted(() => {
  const center = props.coordinates.map((c) => parseFloat(c)) as [
    number,
    number,
  ];
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: center,
    zoom: 15,
    minZoom: 13,
  });

  new mapboxgl.Marker().setLngLat(center).addTo(map);
});
</script>
