export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth();

  if (!auth.data || auth.status.value === "unauthenticated") {
    return navigateTo("/auth/sign-in", {
      replace: true,
    });
  }

  if (auth.data.value?.user?.role !== "client") {
    return navigateTo("/", {
      replace: true,
    });
  }
})