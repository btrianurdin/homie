const deleteRoom = async (id: string) => {
  const res = await $fetch(`/api/rooms/${id}`, {
    method: "DELETE",
    onResponseError: (res) => {
      throw new Error(res.response.statusText);
    },
  });

  return res;
};

export default deleteRoom;
