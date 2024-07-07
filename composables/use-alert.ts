import type { Notification } from "#ui/types/notification";
import ErrorModal from "~/components/shared/ErrorModal.vue";
import SuccessModal from "~/components/shared/SuccessModal.vue";

export interface IAlertToast {
  title?: string;
  message: string;
  opts?: Omit<Partial<Notification>, "title" | "description" | "color">;
}

const useAlert = () => {
  const toast = useToast();
  const modal = useModal();

  return {
    toastError: ({ title, message, opts }: IAlertToast) => {
      toast.add({
        title: title ?? "Opps!...",
        description: message,
        color: "red",
        ...opts,
      });
    },
    toastSuccess: ({ title, message, opts }: IAlertToast) => {
      toast.add({
        title: title ?? "Success...",
        description: message,
        color: "green",
        ...opts,
      });
    },
    error: ({
      title,
      message,
      withButton = true,
    }: IAlertToast & { withButton?: boolean }) => {
      modal.open(ErrorModal, {
        title: title ?? "Opps!...",
        message,
        withButton,
        onClose: () => modal.close(),
      });
    },
    success: ({
      title,
      message,
      withButton = true,
    }: IAlertToast & { withButton?: boolean }) => {
      modal.open(SuccessModal, {
        title: title ?? "Success...",
        message,
        withButton,
        onClose: () => modal.close(),
      });
    },
  };
};

export default useAlert;
