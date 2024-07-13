<template>
  <UModal
    :prevent-close="props.isLoading.value"
    :ui="{
      base: 'sm:!max-w-md w-full',
      transition: {
        enter: 'duration-100',
        enterFrom: 'sm:translate-y-0 sm:scale-95',
        leave: 'ease-in duration-200',
        leaveFrom: 'opacity-100 translate-y-0',
        leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      },
    }"
  >
    <div class="p-6 py-10 text-center">
      <div class="mb-6">
        <UIcon
          v-if="props.icon === 'trash'"
          name="i-heroicons-trash"
          class="w-20 h-20 text-red-600"
        />
        <UIcon
          v-else-if="props.icon === 'warning'"
          name="i-heroicons-exclamation-circle"
          class="w-20 h-20 text-red-600"
        />
      </div>
      <p class="text-2xl font-semibold mb-3">
        {{ props.title }}
      </p>
      <p>
        {{ props.message }}
      </p>
      <div class="flex gap-4 justify-center mt-6">
        <UButton
          size="xl"
          @click="props.onCancel"
          :disabled="props.isLoading.value"
        >
          {{ props.cancelText }}
        </UButton>
        <UButton
          color="red"
          size="xl"
          @click="props.onConfirm"
          :loading="props.isLoading.value"
        >
          {{ props.confirmText }}
        </UButton>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string;
  message: string;
  icon: "trash" | "warning";
  cancelText: string;
  confirmText: string;
  isLoading: Ref<boolean>;
  onConfirm: () => void;
  onCancel: () => void;
}>();
</script>
