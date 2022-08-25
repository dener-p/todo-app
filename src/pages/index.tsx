import { useAutoAnimate } from "@formkit/auto-animate/react"
import type { NextPage } from "next"
import { useRef } from "react"
import { trpc } from "../utils/trpc"
// card todo
const CardTodo = ({
  todo,
  id,
  completed,
}: {
  todo: string
  id: number
  completed: boolean
}) => {
  // todo with tailwindcss
  const trpcUtils = trpc.useContext()

  const { mutate: deleteTodo } = trpc.useMutation("todos.delete", {
    onMutate: (todo) => {
      trpcUtils.setQueryData(["todos.all"], (todos) => {
        return todos?.filter((t) => t.id !== todo.id) ?? []
      })
    },
  })
  const { mutate: updateTodo } = trpc.useMutation("todos.update", {
    onMutate: (todo) => {
      trpcUtils.setQueryData(["todos.all"], (todos) => {
        return (
          todos?.map((t) => {
            if (t.id === todo.id) {
              return {
                ...t,
                completed: todo.completed,
              }
            }
            return t
          }) ?? []
        )
      })
    },
    onSuccess: () => {
      trpcUtils.invalidateQueries(["todos.all"])
    },
  })

  const todoClass = completed ? "bg-green-200" : "bg-red-200"
  return (
    <div
      className={`flex flex-col  justify-center p-4 ${todoClass} rounded-md transition-colors duration-300 `}
    >
      <div className="flex justify-between">
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue
        rounded"
          onClick={() => {
            updateTodo({
              id: id,
              completed: !completed,
              title: todo,
            })
          }}
        >
          {completed ? "undo" : "done"}
        </button>
        <button
          className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red
          rounded"
          onClick={() => {
            deleteTodo({ id: id })
          }}
        >
          delete
        </button>
      </div>
      <p className="text-lg font-semibold mt-8">{todo}</p>
    </div>
  )
}

const Home: NextPage = () => {
  const trpcUtils = trpc.useContext()
  const { data, isLoading } = trpc.useQuery(["todos.all"])
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const [ele] = useAutoAnimate<HTMLDivElement>()
  const { mutate: add, isLoading: loadingAdd } = trpc.useMutation(
    "todos.create",
    {
      onSuccess: () => {
        trpcUtils.invalidateQueries(["todos.all"])
      },
    }
  )
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="bg-zinc-700 min-h-screen w-full">
      <main className="mx-auto max-w-6xl p-8 flex flex-col gap-8" ref={ele}>
        {isLoading && <p>Loading...</p>}
        <>
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault()
              add({
                title: ref.current!.value,
                completed: false,
              })
            }}
          >
            <input
              type="text"
              name="todo"
              ref={ref}
              placeholder="add todo"
              className="bg-transparent w-full hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue
            rounded"
            />
          </form>
          {loadingAdd ? <p>loading...</p> : null}

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4  "
            ref={parent}
          >
            {data?.map(({ id, title, completed }) => (
              <CardTodo key={id} todo={title} completed={completed} id={id} />
            ))}
          </div>
        </>
      </main>
    </div>
  )
}

export default Home
