import { z } from "zod";

const schema = z.object({
  title: z
    .string({ message: "Nama kos tidak boleh kosong" })
    .min(5, { message: "Judul minimal 5 karakter" }),
  description: z.string({ message: "Deskripsi tidak boleh kosong" }).min(10, {
    message: "Deskripsi minimal 10 karakter",
  }),
  price: z
    .string({ message: "Harga tidak boleh kosong" })
    .regex(/^\d+$/, { message: "Harga harus berupa angka" }),
  price_period: z.enum(["month", "3months", "6months", "year"], {
    message: "Periode harga tidak valid",
  }),
  period: z.array(z.enum(["month", "3months", "6months", "year"])).min(1, {
    message: "Pilih minimal satu periode sewa",
  }),
  type: z.enum(["men", "women", "all"], {
    message: "Tipe kos tidak boleh kosong",
  }),
  total_rooms: z
    .string({ message: "Jumlah kamar tidak boleh kosong" })
    .regex(/^\d+$/, { message: "Jumlah kamar harus berupa angka" }),
  slots: z
    .string({ message: "Jumlah kamar tersedia tidak boleh kosong" })
    .regex(/^\d+$/, { message: "Jumlah kamar tersedia harus berupa angka" }),
  address: z.string({ message: "Alamat tidak boleh kosong" }).min(5, {
    message: "Alamat minimal 5 karakter",
  }),
});

export type CreateRoomSchema = z.infer<typeof schema> & {
  point: mapboxgl.LngLat;
  bbox: number[];
};

export default schema;
