import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../../../lib/prisma";

import { compare } from "bcryptjs";
import { getUserOrganizationsAndPermissions } from "../../../utils/get-user-organizations-with-permissions";
import { BadRequestError } from "../_errors/bad-request-error";

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with e-mail & password",
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          201: z.object({
            token: z.string(),
            user: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              avatarUrl: z.string().url().nullable(),
              memberships: z.any().nullable(),
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
      const { email, password } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!userFromEmail) {
        throw new BadRequestError("Credenciais inválidas.");
      }

      if (userFromEmail.passwordHash === null) {
        throw new BadRequestError(
          "User does not have a password, use social login."
        );
      }

      if (userFromEmail.status === "Inativo") {
        throw new BadRequestError(
          "Usuário inativo! Para mais informações consulte o administrador."
        );
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash
      );

      if (!isPasswordValid) {
        throw new BadRequestError("Credenciais inválidas.");
      }

      const memberships = await getUserOrganizationsAndPermissions(
        userFromEmail.id
      );

      const supervisorTeams = await prisma.team.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          supervisorId: userFromEmail.id,
        },
      });

      const user = {
        id: userFromEmail.id,
        name: userFromEmail.name || "name not found",
        email: userFromEmail.email,
        avatarUrl: userFromEmail.avatarUrl,
        memberships: memberships,
        supervisorTeams: supervisorTeams || [],
      };

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({ user, token });
    }
  );
}
