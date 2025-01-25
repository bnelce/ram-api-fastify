import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export async function updatePasswordAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/password/reset/account",
      {
        schema: {
          tags: ["Auth"],
          summary: "Reset password",

          security: [{ bearerAuth: [] }],
          body: z.object({
            currentPassword: z.string().min(6),
            newPassword: z.string().min(6),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { newPassword } = request.body;
        const userId = await request.getCurrentUserId();
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new BadRequestError("Usuário não encontrado.");
        }

        const newPasswordHash = await hash(newPassword, 6);

        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash: newPasswordHash },
        });

        return reply.status(204).send();
      }
    );
}
