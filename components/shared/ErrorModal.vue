<template>
  <UModal
    :ui="{
      base: 'sm:!max-w-sm',
      transition: {
        enter: 'duration-100',
        enterFrom: 'sm:translate-y-0 sm:scale-95',
        leave: 'ease-in duration-200',
        leaveFrom: 'opacity-100 translate-y-0',
        leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      },
    }"
  >
    <div
      class="flex flex-col items-center gap-4 text-center justify-center p-6 py-10"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-20 h-20 text-red-600"
      />
      <h3 class="text-red-600 text-3xl font-semibold">{{ $props.title }}</h3>
      <p>{{ $props.message }}</p>
      <div v-if="$props.withButton">
        <UButton color="red">
          <span> Tutup </span>
        </UButton>
      </div>
    </div>
  </UModal>
</template>
<script lang="ts" setup>
defineProps<{
  title: string;
  message: string;
  withButton?: boolean;
}>();
</script>
