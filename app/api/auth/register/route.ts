import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { ok, fail, handleRouteError } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = registerSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(payload.password, 12);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: payload.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return ok({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("A user with this email already exists", 409);
    }

    return handleRouteError(error);
  }
}
