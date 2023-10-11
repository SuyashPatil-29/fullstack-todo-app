import { Todo } from '@prisma/client'
import { z } from 'zod'

export const TodoValidator = z.object({
    title : z.string(),
    id: z.number().optional() || z.string().optional(),
})

export type TodoRequest = z.infer<typeof TodoValidator>