<template>
  <div class="h-dvh w-screen flex flex-col">
    <header
      class="w-full bg-white border-b flex items-center justify-between h-14 flex-shrink-0"
    >
      <h1 class="px-6">Homie</h1>
      <div class="px-6">
        <UButton
          color="red"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
          @click="logoutHandler"
        >
          Sign out
        </UButton>
      </div>
    </header>
    <div class="flex-grow h-full w-full flex overflow-hidden">
      <div
        class="w-[300px] z-40 flex-shrink-0 border-r flex flex-col gap-4 bg-white p-6"
      >
        <NuxtLink
          to="/owner/account"
          class="flex items-center gap-2 rounded-md p-2 transition-colors duration-300 hover:bg-gray-100"
        >
          <ProfileLetter :text="userName!" />
          <p class="">{{ userName }}</p>
        </NuxtLink>
        <div class="h-[1px] bg-gray-200" />
        <template v-for="menu in sidebarMenu" :key="menu.name">
          <NuxtLink
            :to="menu.to"
            :class="
              cn(
                'flex items-center gap-1.5 py-2 px-3 rounded-md group hover:bg-gray-500 hover:bg-opacity-10 hover:text-gray-800',
                'transition-colors duration-200 ease-in-out',
                activeMenu(menu.to, menu.index!) &&
                  'bg-opacity-10 text-gray-500 bg-gray-500',
              )
            "
          >
            <UIcon
              :name="menu.icon"
              :class="[
                'w-5 h-5 text-gray-400 group-hover:text-gray-900',
                activeMenu(menu.to, menu.index!) && 'text-gray-900',
              ]"
            />
            <span
              :class="[
                'text-gray-500 group-hover:text-gray-900',
                activeMenu(menu.to, menu.index!) && '!text-gray-900',
              ]"
              >{{ menu.name }}
            </span>
          </NuxtLink>
        </template>
      </div>
      <div class="relative w-full h-full">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ProfileLetter from "~/components/shared/ProfileLetter.vue";

const route = useRoute();

const sidebarMenu = ref([
  {
    name: "Dashboard",
    icon: "i-heroicons-squares-2x2",
    to: "/owner",
    index: true,
  },
  {
    name: "Kos Saya",
    icon: "i-heroicons-home",
    to: "/owner/rooms",
  },
]);

const activeMenu = (path: string, isIndex: boolean) => {
  if (isIndex) return path === route.path;
  return route.path.startsWith(path);
};

const { data, signOut } = useAuth();

const userName = computed(() => data?.value?.user?.name);

const logoutHandler = () => {
  signOut({
    external: true,
    redirect: true,
  });
};
</script>
