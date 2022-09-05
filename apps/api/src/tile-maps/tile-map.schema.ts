import { InferType, number, object, string } from 'yup';

import { bboxSchema } from '../bbox.schema';

// Schema
export const createTileMapSchema = object({
  name: string().required(),
  bbox: bboxSchema.required(),
  blockSize: number().default(10),
}).noUnknown();

export type CreateTileMapData = InferType<typeof createTileMapSchema>;

export const updateTileMapSchema = object({
  name: string(),
  bbox: bboxSchema.default(undefined),
}).noUnknown();

export type UpdateTileMapData = InferType<typeof updateTileMapSchema>;
