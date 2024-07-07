<template>
  <span :class="props.class" :style="getStyle" />
</template>
<script setup lang="ts">
import homiIconCollections, {
  type HomiIconType,
} from "~/data/homi-icon-collections";

const props = defineProps<{
  name: HomiIconType;
  class?: string;
  width?: string | number;
  height?: string | number;
}>();

const getStyle = computed(() => {
  if (!props.name) return null;
  const collection = homiIconCollections(props.name);

  if (collection) {
    const svg = `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${props.width ?? collection.width} ${props.height ?? collection.height}' width='${props.width ?? collection.width}' height='${props.height ?? collection.height}'>${collection.body}</svg>`,
    )}")`;

    return {
      display: "inline-block",
      "--svg": svg,
      "background-color": "currentColor",
      "-webkit-mask-image": `var(--svg), ${svg}`,
      "mask-image": "var(--svg)",
      "-webkit-mask-repeat": "no-repeat",
      "mask-repeat": "no-repeat",
      "-webkit-mask-size": "100% 100%",
      "mask-size": "100% 100%",
    };
  }

  return null;
});
</script>
