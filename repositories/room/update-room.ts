import type { CreateRoomSchema } from "~/schema/create-room-schema";

type UpdateRoomData = CreateRoomSchema & {
  galleries: { id: string; url: string }[];
  facilities: string[];
  nearestAccess: string[];
};

const updateRoom = async (params: { data: UpdateRoomData; roomId: string }) => {
  const res = await $fetch(`/api/rooms/${params.roomId}`, {
    method: "PUT",
    body: JSON.stringify(params.data),
  });

  return res;
};

export default updateRoom;
