import { number, object } from 'yup';

// Schema
export const bboxSchema = object({
  t: number().required(),
  b: number().required()
    .when('t', (t, schema) => schema.min(t, 'b must be greater or equal than ${min} (t)')),

  l: number().required(),
  r: number().required()
    .when('l', (r, schema) => schema.min(r, 'r must be greater or equal than ${min} (l)')),
}).noUnknown();
