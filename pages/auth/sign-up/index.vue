<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <Head>
      <Title>Daftar</Title>
    </Head>
    <UCard>
      <div class="w-[350px] flex flex-col gap-3">
        <h1 class="text-2xl font-semibold text-center">Daftar</h1>
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
          class="flex gap-3 flex-col"
          :validate-on="['input', 'submit', 'blur']"
          @submit="handleSignUp"
        >
          <UFormGroup label="Nama Lengkap" name="name">
            <UInput v-model="state.name" placeholder="Masukkan nama lengkap" />
          </UFormGroup>
          <UFormGroup label="Nomor Handphone" name="phone">
            <UInput
              v-model="state.phone"
              placeholder="Masukkan nomor handphone"
            />
          </UFormGroup>
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
            Daftar
          </UButton>
        </UForm>
        <NuxtLink
          :to="`/auth/sign-in?mode=${stateMode}`"
          class="mt-1 text-xs text-center"
        >
          Sudah punya akun?
          <span class="text-black underline">Masuk</span>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import cn from "~/utils/cn";

const route = useRoute();
const router = useRouter();
const { signIn } = useAuth();
const { loading } = useAuthState();

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

const state = reactive({
  name: "",
  phone: "",
  email: "",
  password: "",
});
const errorMessage = ref<string | null>(null);

const stateModeChange = (mode: string) => {
  stateMode.value = mode;
  state.name = "";
  state.phone = "";
  state.email = "";
  state.password = "";
  errorMessage.value = null;
  router.push({ query: { mode } });
};

const schema = z.object({
  name: z.string({ message: "Name is required" }).min(3, {
    message: "Name must be at least 3 characters",
  }),
  phone: z
    .string({ message: "Phone is required" })
    .regex(/^08[0-9]{9,}$/i, { message: "Invalid phone number" }),
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string({ message: "Password is required" }).min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type Schema = z.output<typeof schema>;

const handleSignUp = async (e: FormSubmitEvent<Schema>) => {
  const result = await signIn("sign-up", {
    mode: stateMode.value,
    name: e.data.name,
    phone: e.data.phone,
    email: e.data.email,
    password: e.data.password,
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
