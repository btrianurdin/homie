import { galleries, rooms } from "~/server/database/schema";

export type HttpResponse<T> = {
  statusCode: number;
  payload?: T;
};

export type SearchPointResponse = HttpResponse<{
  full_address?: string;
  bbox?: number[];
}>;

export type LocationSuggestResponse = {
  coordinates: number[];
  city_name: string;
  address: string;
  bbox: number[];
};

export type ClusterResponse = {
  clusters: {
    cluster_id?: string;
    is_cluster?: boolean;
    point_count: number;
    coordinates: number[];
    price?: string;
  }[];
  total: number;
};

export type RoomListResponse = {
  rooms: {
    id: string;
    price: string;
    price_period: string;
    title: string;
    address: string;
    rating: number;
    rooms_available: number;
    type: GetRoom["type"];
    gallery: string;
  }[];
  total: number;
};

export type RoomDetailResponse = GetRoom & {
  owner: {
    name: string;
    phone: string;
    picture: string;
    created_at: string;
  };
};

export type InsertRoom = typeof rooms.$inferInsert;
export type GetGallery = typeof galleries.$inferSelect;
export type GetRoom = typeof rooms.$inferSelect & {
  galleries: GetGallery[];
};

export const RoomTypeLabel = {
  men: "Putra",
  women: "Putri",
  all: "Campur",
} as const;

export type PeriodType = "month" | "3months" | "6months" | "year";
export type PeriodCasting<T> = Record<PeriodType, T>;

export const PricePeriodLabel = {
  month: "Bulan",
  "3months": "3 Bulan",
  "6months": "6 Bulan",
  year: "Tahun",
} as PeriodCasting<string>;

export const AllowPeriodLabel = {
  month: "1 Bulan",
  "3months": "3 Bulan",
  "6months": "6 Bulan",
  year: "1 Tahun",
} as PeriodCasting<string>;

export const PeriodInNumber = {
  month: 1,
  "3months": 3,
  "6months": 6,
  year: 12,
} as PeriodCasting<number>;
