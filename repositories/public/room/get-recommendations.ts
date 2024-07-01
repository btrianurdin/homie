import type { GetRoom, HttpResponse } from "~/types";

const getRecommendations = async () => {
  const res = await $fetch("/api/public/recommendations");

  return res as HttpResponse<GetRoom[]>;
};

export default getRecommendations;
