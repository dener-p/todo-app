import { z } from "zod"
import { createRouter } from "./context"

export const todosRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await ctx.prisma.todo.findMany()
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string(),
      completed: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.todo.create({
        data: {
          title: input.title,
          completed: input.completed,
        },
      })
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          completed: input.completed,
        },
      })
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.todo.delete({
        where: { id: input.id },
      })
    },
  })
