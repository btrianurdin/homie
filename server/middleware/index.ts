import { getServerSession } from "#auth";

export default defineEventHandler(async (e) => {
  const session = await getServerSession(e);

  if (session) {
    e.context.user = session.user;
  }
});
