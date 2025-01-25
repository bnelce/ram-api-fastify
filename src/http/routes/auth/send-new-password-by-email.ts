import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import emailQueue from "../../../lib/emailQueue";
import { prisma } from "../../../lib/prisma";
import { generatePassword } from "../../../utils/generate-password";
import getResendPasswordTemplate from "../../../utils/mails/get-resend-password-template";
import { auth } from "../../middlewares/auth";
import { BadRequestError } from "../_errors/bad-request-error";

export async function sendNewPasswordByEmail(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/password/send/new",
      {
        schema: {
          tags: ["Auth"],
          summary: "Send new password by email",

          body: z.object({
            userId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { userId } = request.body;

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new BadRequestError("Usuário não encontrado");
        }

        const newPassword = generatePassword(8);

        const passwordHash = await hash(newPassword, 6);

        await emailQueue.add({
          to: user.email,
          subject: "SAP Finanbank - Nova senha",
          html: getResendPasswordTemplate(
            user.name || "colaborador",
            newPassword
          ),
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            passwordHash,
          },
        });

        return reply.status(204).send();
      }
    );
}
