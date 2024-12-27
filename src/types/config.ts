import { z } from 'zod';

import { modelTypeEnum } from '@/types/inference';

export const inferenceConfigSchema = z.object({
  modelType: modelTypeEnum,
  modelName: z.string(),
  temperature: z.number(),
});

export type InferenceConfig = z.infer<typeof inferenceConfigSchema>;

// Centrally defines the default inference config used
export const defaultInferenceConfig: InferenceConfig = {
  modelType: modelTypeEnum.Values.openai,
  modelName: 'gpt-4o-2024-11-20', // TODO: If necessary, validate that the model name belongs to the client family
  temperature: 0,
};
