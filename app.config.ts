export default defineAppConfig({
  ui: {
    strategy: "merge",
    notifications: {
      position: "bottom-auto left-auto top-0 right-0",
    },
    input: {
      color: {
        white: {
          outline: "focus:ring-gray-900 dark:focus:ring-gray-900",
        },
      },
    },
    textarea: {
      color: {
        white: {
          outline: "focus:ring-gray-900 dark:focus:ring-gray-900",
        },
      },
    },
    select: {
      color: {
        white: {
          outline: "focus:ring-gray-900 dark:focus:ring-gray-900",
        },
      },
    },
    button: {
      default: {
        color: "black",
        loadingIcon: "i-lucide-loader",
      },
      icon: {
        loading: "!w-4 !h-4",
      },
    },
    breadcrumb: {
      base: "font-normal",
      active: "text-black",
      inactive: "text-gray-500",
    },
    modal: {
      // base: "p-4",
      transition: {
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 translate-y-4 sm:translate-y-80",
        enterTo: "opacity-100 translate-y-0",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 translate-y-0",
        leaveTo: "opacity-0 translate-y-4 sm:translate-y-80",
      },
    },
  },
});
