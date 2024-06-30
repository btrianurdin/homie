export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();

  if (auth.status.value === "authenticated") {
    if (auth.data.value?.user?.role === "owner") {
      return navigateTo("/owner", {
        replace: true,
      });
    }
    return navigateTo("/", {
      replace: true,
    });
  }
});
