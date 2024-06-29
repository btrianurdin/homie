import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";

const cookiesOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export default NuxtAuthHandler({
  secret: "secret",
  cookies: {
    callbackUrl: {
      name: `${process.env.AUTH_OPTS_CALLBACK_URL}`,
      options: cookiesOpts,
    },
    sessionToken: {
      name: `${process.env.AUTH_OPTS_SESSION}`,
      options: { ...cookiesOpts, maxAge: 10 * 24 * 60 * 60 },
    },
    csrfToken: {
      name: `${process.env.AUTH_OPTS_CSRF_TOKEN}`,
      options: cookiesOpts,
    },
  },
  providers: [
    // @ts-expect-error Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        return {
          email: credentials.email,
          role: "user",
        };
      },
    }),
    // @ts-expect-error Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      id: "register",
      name: "register",
      credentials: {},
      async authorize(credentials: any) {
        return {
          email: credentials.email,
          role: "user",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
});
