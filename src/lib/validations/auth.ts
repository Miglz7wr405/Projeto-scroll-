import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(9, "Introduza um número de telefone válido")
  .regex(/^\+?[0-9 ]{9,15}$/, "Introduza um número de telefone válido");

export const cadastroSchema = z
  .object({
    fullName: z.string().trim().min(3, "Introduza o seu nome completo"),
    phone: phoneSchema,
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type CadastroInput = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Introduza a sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export function phoneToSyntheticEmail(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `${digits}@cliente.app.local`;
}
