import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "path";
import { errorHandler } from "./error-handler";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/auth/create-account";
import { getProfile } from "./routes/auth/get-profile";
import { sendNewPasswordByEmail } from "./routes/auth/send-new-password-by-email";
import { updatePasswordAccount } from "./routes/auth/udpate-password-account";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyStatic, {
  root: path.join(__dirname, "src/docs/diagrams"),
  prefix: "/docs/diagrams/",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "SAP SaaS backend",
      description: "Full-stack SaaS with multi-tenant & RBAC.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

// Registrar o plugin de variáveis de ambiente (opcional, mas recomendado)
app.register(require("@fastify/env"), {
  dotenv: true,
  schema: {
    type: "object",
    required: [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "FROM_EMAIL",
      "JWT_SECRET",
      "DATABASE_URL",
      "REDIS_HOST",
      "REDIS_PORT",
    ],
    properties: {
      SMTP_HOST: { type: "string" },
      SMTP_PORT: { type: "number" },
      SMTP_USER: { type: "string" },
      SMTP_PASS: { type: "string" },
      FROM_EMAIL: { type: "string" },
      JWT_SECRET: { type: "string" },
      DATABASE_URL: { type: "string" },
      REDIS_HOST: { type: "string" },
      REDIS_PORT: { type: "number" },
    },
  },
});

app.register(fastifyJwt, {
  secret: "fb-saas-secret", //env.JWT_SECRET,
});

app.register(fastifyCors);
app.register(fastifyMultipart);

app.register(authenticateWithPassword);
app.register(createAccount);
app.register(getProfile);
app.register(updatePasswordAccount);
app.register(sendNewPasswordByEmail);
// app.register(requestPasswordRecover);
// app.register(resetPassword);

if (process.env.NODE_ENV !== "test") {
  app.listen({ port: 3333 }).then(() => {
    console.log("HTTP Server running on http://localhost:3333");
  });
}
