import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { BadRequestError } from "../_errors/bad-request-error";

import { prisma } from "../../../lib/prisma";
import { getUserOrganizationsAndPermissions } from "../../../utils/get-user-organizations-with-permissions";
import { auth } from "../../middlewares/auth";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/profile",
      {
        schema: {
          tags: ["Auth"],
          summary: "Get authenticated user profile",

          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              user: z.object({
                id: z.string().uuid(),
                name: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
                memberships: z.any(),
                supervisorTeams: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                  })
                ),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
          where: {
            id: userId,
          },
        });

        console.log(user);

        if (!user) {
          throw new BadRequestError("User not found.");
        }

        const memberships = await getUserOrganizationsAndPermissions(user.id);

        const supervisorTeams = await prisma.team.findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            supervisorId: userId,
          },
        });

        const userWithMemberships = {
          ...user,
          memberships: memberships,
          supervisorTeams: supervisorTeams || [],
        };

        // MEMBERSHIP EXAMPLE
        /* [
          {
            "organization": {
              "id": "organization-id",
              "name": "Organization Name",
              "slug": "organization-slug"
            },
            "role": "ADMIN_ORG",
            "permissions": [
              { "action": "manage", "subject": "all" },
              { "action": "update", "subject": "Organization", "conditions": { "ownerId": "user-id" } }
            ]
          },
          ...
        ] */

        return reply.send({ user: userWithMemberships });
      }
    );
}
