<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <Head>
      <Title>Masuk</Title>
    </Head>
    <UCard>
      <div class="w-[300px] flex flex-col gap-3">
        <h1 class="text-2xl font-semibold text-center">Masuk</h1>
        <div class="w-full grid grid-cols-2 gap-3 my-3">
          <button
            v-for="mode in modes"
            :class="
              cn(
                'p-3.5 rounded-md border hover:bg-gray-100',
                stateMode === mode.value &&
                  'bg-black text-white hover:bg-black',
              )
            "
            @click="() => stateModeChange(mode.value)"
          >
            {{ mode.label }}
          </button>
        </div>
        <UForm
          :schema="schema"
          :state="state"
          class="flex gap-2 flex-col"
          :validate-on="['input', 'submit']"
          @submit="() => {}"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" placeholder="Enter your email here" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Enter your password here"
            />
          </UFormGroup>
          <UButton type="submit" class="mt-1" block> Masuk </UButton>
        </UForm>
        <NuxtLink to="/auth/sign-up" class="mt-1 text-xs text-center">
          Belum punya akun?
          <span class="text-black underline">Sign Up</span>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import cn from "~/utils/cn";

const route = useRoute();
const router = useRouter();

const modes = [
  {
    label: "Pencari Kos",
    value: "seeker",
  },
  {
    label: "Owner Kos",
    value: "owner",
  },
];
const stateMode = ref(route.query.mode || "pencari-kos");

const stateModeChange = (mode: string) => {
  stateMode.value = mode;
  state.email = "";
  state.password = "";
  router.push({ query: { mode } });
};

const state = reactive({
  email: "",
  password: "",
});

const schema = z.object({
  email: z.string({ message: "Email is required" }).email(),
  password: z.string({ message: "Password is required" }),
});
</script>
