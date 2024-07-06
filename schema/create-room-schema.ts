import { z } from "zod";

const schema = z.object({
  title: z
    .string({ message: "Kolom tidak boleh kosong" })
    .min(5, { message: "Minimal 5 karakter" }),
  description: z.string({ message: "Kolom tidak boleh kosong" }).min(10, {
    message: "Minimal 10 karakter",
  }),
  price: z
    .string({ message: "Kolom tidak boleh kosong" })
    .transform((val, ctx) => {
      const parse = val.replace(/\./g, "").match(/\D/g);
      if (parse) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format harga tidak valid",
        });
        return z.NEVER;
      }
      if (val.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Kolom tidak boleh kosong",
        });
        return z.NEVER;
      }
      return val.replace(/\D/g, "");
    }),
  period: z.array(z.enum(["month", "3months", "6months", "year"])).min(1, {
    message: "Pilih minimal satu",
  }),
  type: z.enum(["men", "women", "all"], {
    message: "Kolom tidak boleh kosong",
  }),
  total_rooms: z
    .string({ message: "Kolom tidak boleh kosong" })
    .regex(/^\d+$/, { message: "Harus berupa angka" }),
  slots: z
    .string({ message: "Kolom tidak boleh kosong" })
    .regex(/^\d+$/, { message: "Harus berupa angka" }),
  address: z.string({ message: "Kolom tidak boleh kosong" }).min(5, {
    message: "Minimal 5 karakter",
  }),
});

export type CreateRoomSchema = z.infer<typeof schema> & {
  point: mapboxgl.LngLat;
  bbox: number[];
};

export default schema;
