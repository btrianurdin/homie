import ConfirmationDangerModal from "~/components/shared/ConfirmationDangerModal.vue";

export type Confirmation = {
  title?: string;
  icon?: "trash" | "warning";
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onSuccess?: () => void;
  onError?: () => void;
  onCancel?: () => void;
};

const useConfirmation = () => {
  const modal = useModal();

  return {
    danger: (params: Confirmation) => {
      const isLoading = ref(false);

      modal.open(ConfirmationDangerModal, {
        title: params?.title ?? "Apakah kamu yakin?",
        message: params.message ?? "Data yang dihapus tidak dapat dikembalikan.",
        icon: params.icon ?? "warning",
        confirmText: params.confirmText ?? "Ya, Hapus",
        cancelText: params.cancelText ?? "Batal",
        isLoading,
        onConfirm: async () => {
          try {
            isLoading.value = true;
            await params.onConfirm();
            modal.close();
            // prevent modal opened twice in the same tick
            await delayAsync(300);
            params?.onSuccess?.();
          } catch (error) {
            modal.close();
            // prevent modal opened twice in the same tick
            await delayAsync(300);
            params?.onError?.();
          }
        },
        onCancel: () => {
          params?.onCancel?.();
          modal.close();
        },
      });
    },
  };
};

export default useConfirmation;
