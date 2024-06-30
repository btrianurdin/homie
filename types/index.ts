import { galleries, rooms } from "~/server/database/schema";

export type HttpResponse<T> = {
  statusCode: number;
  payload?: T;
};

export type SearchPointResponse = HttpResponse<{
  full_address?: string;
  bbox?: number[];
}>;

export type InsertRoom = typeof rooms.$inferInsert;
export type GetGallery = typeof galleries.$inferSelect;
export type GetRoom = typeof rooms.$inferSelect & {
  galleries: GetGallery[];
};

export const RoomTypeLabel = {
  men: "Pria",
  women: "Wanita",
  all: "Campur",
} as const;

export const PricePeriodLabel = {
  month: "Bulan",
  "3months": "3 Bulan",
  "6months": "6 Bulan",
  year: "Tahun",
};
