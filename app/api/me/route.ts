import { auth } from "@/auth";
import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Authentication required", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) {
    return fail("User not found", 404);
  }

  return ok({ user });
}
