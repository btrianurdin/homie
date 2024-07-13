import type { HttpResponse, OwnerRoomDetailResponse } from "~/types";

const getOwnerRoomDetail = async (roomId: string) => {
  const res = await $fetch(`/api/rooms/${roomId}/detail`);

  return res as HttpResponse<OwnerRoomDetailResponse>;
};

export default getOwnerRoomDetail;
