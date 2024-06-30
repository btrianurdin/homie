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
        <UAlert
          v-if="errorMessage"
          color="red"
          :description="errorMessage"
          class="mb-2"
        />
        <UForm
          :schema="schema"
          :state="state"
          class="flex gap-2 flex-col"
          :validate-on="['input', 'submit']"
          @submit="handleSignIn"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" placeholder="Masukkan email" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Masukkan password"
            />
          </UFormGroup>
          <UButton type="submit" class="mt-1" block :loading="loading">
            Masuk
          </UButton>
        </UForm>
        <NuxtLink
          :to="`/auth/sign-up?mode=${stateMode}`"
          class="mt-1 text-xs text-center"
        >
          Belum punya akun?
          <span class="text-black underline">Daftar</span>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import cn from "~/utils/cn";

definePageMeta({
  middleware: ["unauthenticated"],
});

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
const stateMode = ref(route.query.mode || "seeker");

const stateModeChange = (mode: string) => {
  stateMode.value = mode;
  state.email = "";
  state.password = "";
  router.push({ query: { mode } });
};

const errorMessage = ref<string | null>(null);
const state = reactive({
  email: "",
  password: "",
});

const { signIn } = useAuth();
const { loading } = useAuthState();

const schema = z.object({
  email: z
    .string({ message: "Email tidak boleh kosong" })
    .email({ message: "Email tidak valid" }),
  password: z.string({ message: "Password tidak boleh kosong" }).min(6, {
    message: "Password minimal 6 karakter",
  }),
});

type Schema = z.output<typeof schema>;

const handleSignIn = async (e: FormSubmitEvent<Schema>) => {
  const result = await signIn("sign-in", {
    email: e.data.email,
    password: e.data.password,
    mode: stateMode.value,
    redirect: false,
    callbackUrl: "/",
  });

  const { error } = result as { error: string; url: string };

  if (error) {
    errorMessage.value = `${error}`;
    return;
  }

  const redirectUrl = stateMode.value === "owner" ? "/owner" : "/";
  navigateTo(redirectUrl, { external: true, replace: true });
};
</script>
