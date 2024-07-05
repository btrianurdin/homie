import type { ClusterResponse, HttpResponse } from "~/types";

const getClusters = async (params: { bounds: number[][]; zoom: number }) => {
  const res = await $fetch("/api/public/rooms/clusters", {
    method: "POST",
    body: JSON.stringify({
      bounds: {
        west: params.bounds[0][0],
        south: params.bounds[0][1],
        east: params.bounds[1][0],
        north: params.bounds[1][1],
      },
      zoom: params.zoom,
    }),
  });

  return res as HttpResponse<ClusterResponse>;
};

export default getClusters;
