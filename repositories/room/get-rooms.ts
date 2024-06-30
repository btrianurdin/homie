import type { GetRoom, HttpResponse } from "~/types";

const getRooms = async () => {
  const res = await $fetch("/api/rooms");

  return res as HttpResponse<GetRoom[]>;
};

export default getRooms;
