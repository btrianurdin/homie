import type { Notification } from "#ui/types/notification";

export interface IAlertToast {
  title?: string;
  message: string;
  opts?: Omit<Partial<Notification>, "title" | "description" | "color">;
}

const useAlert = () => {
  const toast = useToast();

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
  };
};

export default useAlert;
