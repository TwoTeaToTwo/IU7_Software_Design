import { z } from "zod";

const IdSchema = z.number().int().nonnegative();
export type Id = z.infer<typeof IdSchema>;
export type Url = string;
export enum Platform {
	YouTube,
	RuTube,
}
