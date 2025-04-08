import { z } from "zod";

const UIntSchema = z.number().int().nonnegative();
export type UInt = z.infer<typeof UIntSchema>;

export type Id = UInt;
export enum Platform {
	YouTube,
	RuTube,
}
export type CompareFunction<Type> = (a: Type, b: Type) => number;
