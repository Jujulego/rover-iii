import { InferType, number, object, string } from 'yup';

// Schema
const bboxSchema = object({
  t: number().required(),
  b: number().required()
    .when('t', (t, schema) => schema.min(t, 'b must be greater or equal than ${min} (t)')),

  l: number().required(),
  r: number().required()
    .when('l', (r, schema) => schema.min(r, 'r must be greater or equal than ${min} (l)')),
}).noUnknown();

export const createTileMapSchema = object({
  name: string().required(),
  bbox: bboxSchema.required(),
}).noUnknown();

export type CreateTileMapData = InferType<typeof createTileMapSchema>;

export const updateTileMapSchema = object({
  name: string(),
  bbox: bboxSchema.nullable().default(null),
}).noUnknown();

export type UpdateTileMapData = InferType<typeof updateTileMapSchema>;
