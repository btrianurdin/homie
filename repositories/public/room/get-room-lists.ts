import type { HttpResponse, RoomListResponse } from "~/types";

const getRoomLists = async (params: {
  bounds: number[][];
  zoom: number;
  cluster_id?: string;
}) => {
  const res = await $fetch("/api/public/room-lists", {
    method: "POST",
    body: JSON.stringify({
      bounds: {
        west: params.bounds[0][0],
        south: params.bounds[0][1],
        east: params.bounds[1][0],
        north: params.bounds[1][1],
      },
      zoom: params.zoom,
      cluster_id: params?.cluster_id,
    }),
  });

  return res as HttpResponse<RoomListResponse>;
};

export default getRoomLists;
