<template>
  <div
    class="bg-black text-white h-9 w-9 text-sm flex items-center justify-center rounded-full"
  >
    {{ profile }}
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();

const profile = computed(() => {
  if (!props.text.length) return "?";

  const name = props.text.split(" ");
  if (name.length > 1) {
    return (name[0][0] + name[1][0]).toUpperCase();
  }
  return name[0][0].toUpperCase();
});
</script>
