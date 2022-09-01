import { InferType, number, object, string } from 'yup';

// Schema
const bboxSchema = object().shape({
  t: number().required(),
  b: number().required()
    .when('t', (t, schema) => schema.min(t, 'b must be greater or equal than ${min} (t)')),

  l: number().required(),
  r: number().required()
    .when('l', (r, schema) => schema.min(r, 'r must be greater or equal than ${min} (l)')),
});

export const createTileMapSchema = object().shape({
  name: string().required(),
  bbox: bboxSchema.required(),
});

export type CreateTileMapData = InferType<typeof createTileMapSchema>;

export const updateTileMapSchema = object().shape({
  name: string(),
  bbox: bboxSchema.nullable().default(null),
});

export type UpdateTileMapData = InferType<typeof updateTileMapSchema>;
