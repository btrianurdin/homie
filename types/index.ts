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
    cluster_id?: number;
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

export type InsertRoom = typeof rooms.$inferInsert;
export type GetGallery = typeof galleries.$inferSelect;
export type GetRoom = typeof rooms.$inferSelect & {
  galleries: GetGallery[];
};

export const RoomTypeLabel = {
  men: "Pria",
  women: "Putri",
  all: "Campur",
} as const;

export const PricePeriodLabel = {
  month: "Bulan",
  "3months": "3 Bulan",
  "6months": "6 Bulan",
  year: "Tahun",
};
