import { z } from "zod";

const UIntSchema = z.number().int().nonnegative();
export type UInt = z.infer<typeof UIntSchema>;

export type Id = UInt;
export type Url = string;
export enum Platform {
	YouTube,
	RuTube,
}
export type Password = string;