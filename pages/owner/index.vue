<template>
  <div>owner</div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "owner",
  middleware: ["auth-owner"],
});
</script>
