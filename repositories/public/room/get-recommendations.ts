import type { GetRoom, HttpResponse } from "~/types";

const getRecommendations = async () => {
  const res = await $fetch("/api/public/rooms/recommendations");

  return res as HttpResponse<GetRoom[]>;
};

export default getRecommendations;
