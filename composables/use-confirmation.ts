import ConfirmationDangerModal from "~/components/shared/ConfirmationDangerModal.vue";

export type Confirmation = {
  title?: string;
  icon?: "trash" | "warning";
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
};

const useConfirmation = () => {
  const modal = useModal();

  return {
    danger: (params: Confirmation) => {
      const isLoading = ref(false);

      modal.open(ConfirmationDangerModal, {
        title: params?.title ?? "Apakah kamu yakin?",
        message:
          params.message ?? "Data yang dihapus tidak dapat dikembalikan.",
        icon: params.icon ?? "warning",
        confirmText:
          params.confirmText ?? params.icon === "trash"
            ? "Ya, Hapus"
            : "Ya, Lanjutkan",
        cancelText: params.cancelText ?? "Batal",
        isLoading,
        onConfirm: async () => {
          try {
            isLoading.value = true;
            const res = await params.onConfirm();
            modal.close();
            // prevent modal opened twice in the same tick
            await delayAsync(300);
            params?.onSuccess?.(res as any);
          } catch (error) {
            modal.close();
            // prevent modal opened twice in the same tick
            await delayAsync(300);
            params?.onError?.(error);
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
