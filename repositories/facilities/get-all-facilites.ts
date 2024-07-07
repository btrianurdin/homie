import type { FacilitiesResponse, HttpResponse } from "~/types";

const getAllFacilites = async () => {
  const res = await $fetch("/api/facilities");

  return res as HttpResponse<FacilitiesResponse[]>;
};

export default getAllFacilites;
