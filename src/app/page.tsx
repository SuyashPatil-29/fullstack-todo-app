"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TodoRequest } from "@/lib/validators/todo";
import { Todo } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, TrashIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  type NewTodo = Pick<Todo, "title" | "id" | "completed">;

  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await axios.get("/api/todos");
      return data as NewTodo[];
    },
  });

  const { mutate: addTodo } = useMutation({
    mutationFn: async () => {
      const payload: TodoRequest = {
        title: input,
      };
      await axios.post("/api/todos", payload);
    },
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
      alert(error);
    },
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/todos/${id}`, { data: id.toString });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: handleComplete } = useMutation<
    void,
    unknown,
    { id: number; completed: boolean }
  >(
    async ({ id, completed }) => {
      await axios.put(`/api/todos/${id}`, { completed: !completed });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    }
  );

  return (
    <div className="container mx-auto p-4 md:px-44 px-4">
      <h1 className="text-2xl font-semibold mb-4">Todo List</h1>
      {isLoading ? (
        <div className=" grid place-content-center h-[75vh] w-[75vw]"><Loader2 className="animate-spin"/></div>
      ) : (
        <div className="mt-4 mb-6">
          {todos?.map((todo: NewTodo) => (
            <div
              key={todo.id}
              className={cn(
                "border border-gray-300 p-2 rounded-md mb-2 flex justify-between md:gap-10 gap-4",
                todo.completed ? "bg-green-500" : "bg-red-200"
              )}
            >
              <h1 className="flex-1">{todo.title}</h1>
              <Button
                onClick={() =>
                  handleComplete({ id: todo.id, completed: todo.completed })
                }
              >
                {todo.completed ? "Complete" : "Incomplete"}
              </Button>

              <Button onClick={() => handleDelete(todo.id)} variant="ghost">
                <TrashIcon className="w-6 h-6" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-5">
        <div className="mb-4 flex-1">
          <Input
            type="text"
            className="p-2 rounded-md w-full"
            placeholder="Add a new todo"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <Button onClick={() => addTodo()}>Add Todo</Button>
      </div>
    </div>
  );
}
