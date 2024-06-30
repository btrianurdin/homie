import type { HttpResponse } from "~/types";

const uploadGallery = async (image: File) => {
  const data = new FormData();
  data.append("gallery", image);

  const response = await $fetch("/api/rooms/galleries/upload", {
    method: "POST",
    body: data,
  });

  return response as HttpResponse<{ id: string; url: string }>;
};

export default uploadGallery;
