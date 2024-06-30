import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "~/server/database";
import { hashSync } from "bcrypt";
import { clients, owners } from "~/server/database/schema";
import { uniqueColumnCode } from "~/server/exceptions/db-error-code";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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
      id: "sign-in",
      name: "sign-in",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const mode = credentials?.mode;
          const { email, password } = credentials;

          if (!email || !password) throw new Error("Invalid credentials");

          const selectMode = mode === "owner" ? owners : clients;
          const [data] = await db
            .select({
              id: selectMode.id,
              name: selectMode.name,
              email: selectMode.email,
              password: selectMode.password,
            })
            .from(selectMode)
            .where(eq(selectMode.email, email));

          if (!data) throw new Error("Invalid credentials");

          const checkPassword = bcrypt.compareSync(password, data.password);
          if (!checkPassword) throw new Error("Invalid credentials");

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            role: mode,
          };
        } catch (error: any) {
          console.log(error);
          if (error?.code === uniqueColumnCode) {
            throw new Error("Email already exists");
          }
          throw new Error(error?.message || "Invalid credentials");
        }
      },
    }),
    // @ts-expect-error Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      id: "sign-up",
      name: "sign-up",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const mode = credentials?.mode;
          const { name, phone, email, password } = credentials;

          if (!name || !phone || !email || !password)
            throw new Error("Invalid credentials");

          const passwordHash = hashSync(password, 10);

          const [data] = await db
            .insert(mode === "owner" ? owners : clients)
            .values({
              name,
              phone,
              email,
              password: passwordHash,
            })
            .returning();

          return {
            id: data.id,
            name: data.name,
            email: data.email,
            role: mode,
          };
        } catch (error: any) {
          if (error?.code === uniqueColumnCode) {
            throw new Error("Email already exists");
          }
          throw new Error(error?.message || "Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
