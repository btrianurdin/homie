export default defineEventHandler(async (e) => {
  const { search } = getQuery(e);

  console.log("search", search);
})