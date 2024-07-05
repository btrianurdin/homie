import type { HttpResponse, RoomDetailResponse } from "~/types";

const getRoomDetail = async (roomId: string) => {
  const res = await $fetch(`/api/public/rooms/${roomId}/detail`);

  return res as HttpResponse<RoomDetailResponse>;
};

export default getRoomDetail;
