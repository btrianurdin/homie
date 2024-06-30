import { rooms } from "~/server/database/schema";

export type HttpResponse<T> = {
  statusCode: number;
  payload?: T;
};

export type SearchPointResponse = HttpResponse<{
  full_address?: string;
  bbox?: number[];
}>;

export type InsertRoom = typeof rooms.$inferInsert