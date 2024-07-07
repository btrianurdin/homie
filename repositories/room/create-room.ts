import type { CreateRoomSchema } from "~/schema/create-room-schema";

type CreateRoomParams = CreateRoomSchema & {
  galleries: string[];
  facilities: string[];
  nearestAccess: string[];
};

const createRoom = async (params: CreateRoomParams) => {
  const res = await $fetch("/api/rooms", {
    method: "POST",
    body: JSON.stringify(params),
  });

  return res;
};

export default createRoom;
