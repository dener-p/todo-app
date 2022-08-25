import { todosRouter } from "./todo"
// src/server/router/index.ts
import superjson from "superjson"
import { createRouter } from "./context"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("todos.", todosRouter)

// export type definition of API
export type AppRouter = typeof appRouter
