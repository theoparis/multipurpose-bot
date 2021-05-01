import dotenv from "dotenv";
import * as z from "zod";

export const configSchema = z
    .object({
        token: z.string(),
        owners: z.string().refine((arg) => arg.split(",")),
        prefix: z
            .string()
            .optional()
            .transform((arg) => (arg ? arg.split(" ") : ["-"])),
        database: z.string().default("postgres://test:1234@localhost/bot"),
        warningColor: z.string().default("#F7FE72"),
        errorColor: z.string().default("#D62828"),
        successColor: z.string().default("#4F9D69"),
        botColor: z.string().default("#6E44FF"),
        botName: z.string().default("MultiPurpose Bot"),
    })
    .strip();
export type Config = z.infer<typeof configSchema>;

const denv = dotenv.config();
if (denv.error) console.error(denv.error);
export const config: Config = configSchema.parse(denv.parsed);
