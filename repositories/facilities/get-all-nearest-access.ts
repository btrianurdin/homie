import type { HttpResponse, NearestAccessResponse } from "~/types";

const getAllNearestAccess = async () => {
  const res = await $fetch("/api/nearest-access");

  return res as HttpResponse<NearestAccessResponse[]>;
};

export default getAllNearestAccess;
