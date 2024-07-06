const removeGallery = async (params: { id?: string; imgId: string }) => {
  const res = await $fetch("/api/rooms/galleries/remove", {
    method: "DELETE",
    body: JSON.stringify(params),
  });

  return res;
};

export default removeGallery;
