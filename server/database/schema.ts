import { relations, sql } from "drizzle-orm";
import {
  char,
  decimal,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  picture: text("picture"),
  name: text("name").notNull(),
  phone: text("phone").unique().notNull(),
  address: text("address"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const owners = pgTable("owners", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  picture: text("picture"),
  name: text("name").notNull(),
  phone: text("phone").unique().notNull(),
  address: text("address"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const ownersRelations = relations(owners, ({ many }) => ({
  rooms: many(rooms),
}));

export const rooms = pgTable("rooms", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  pricePeriod: text("price_period", {
    enum: ["month", "3months", "6months", "year"],
  }).notNull(),
  rating: char("rating", { length: 5 }),
  address: text("address").notNull(),
  longitude: text("longitude").notNull(),
  latitude: text("latitude").notNull(),
  roomsTotal: integer("total_rooms").notNull(),
  roomsAvailable: integer("slots").notNull(),
  type: text("type", { enum: ["men", "women", "all"] }).notNull(),
  allowBookPeriod: text("period", {
    enum: ["month", "3months", "6months", "year"],
  }).notNull(),
  ownerId: text("owner_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  roomFacilities: many(roomFacilities),
  roomNearestAccess: many(roomNearestAccess),
  galleries: many(galleries),
  owner: one(owners, {
    fields: [rooms.ownerId],
    references: [owners.id],
  }),
}));

export const facilities = pgTable("facilities", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  roomFacilities: many(roomFacilities),
}));

export const roomFacilities = pgTable(
  "room_facilities",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id),
    facilityId: text("facility_id")
      .notNull()
      .references(() => facilities.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roomId, t.facilityId] }),
  }),
);

export const roomFacilitiesRelations = relations(roomFacilities, ({ one }) => ({
  room: one(rooms, {
    fields: [roomFacilities.roomId],
    references: [rooms.id],
  }),
  facility: one(facilities, {
    fields: [roomFacilities.facilityId],
    references: [facilities.id],
  }),
}));

export const nearestAccess = pgTable("nearest_access", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  code: text("code").notNull(),
  title: text("title").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const nearestAccessRelations = relations(nearestAccess, ({ many }) => ({
  roomNearestAccess: many(roomNearestAccess),
}));

export const roomNearestAccess = pgTable(
  "room_nearest_access",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id),
    nearestAccessId: text("nearest_access_id")
      .notNull()
      .references(() => nearestAccess.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roomId, t.nearestAccessId] }),
  }),
);

export const roomNearestAccessRelations = relations(
  roomNearestAccess,
  ({ one }) => ({
    room: one(rooms, {
      fields: [roomNearestAccess.roomId],
      references: [rooms.id],
    }),
    nearestAccess: one(nearestAccess, {
      fields: [roomNearestAccess.nearestAccessId],
      references: [nearestAccess.id],
    }),
  }),
);

export const galleries = pgTable("galleries", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .unique(),
  image: text("image").notNull(),
  roomId: text("room_id").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const galleriesRelations = relations(galleries, ({ one }) => ({
  room: one(rooms, {
    fields: [galleries.roomId],
    references: [rooms.id],
  }),
}));
