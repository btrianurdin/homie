<template>
  <div
    :class="cn('w-[100px] h-6 bg-gray-300 animate-pulse rounded-md', $props?.class)"
    v-bind="$attrs"
  ></div>
</template>
<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>
