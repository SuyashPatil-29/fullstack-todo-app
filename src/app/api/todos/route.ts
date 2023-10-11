import { db } from "@/lib/db";
import { TodoValidator } from "@/lib/validators/todo";

export async function GET() {
  try {
    const todos = await db.todo.findMany({
      orderBy : {
        id : 'asc'
      }
    });
    return new Response(JSON.stringify(todos));
  } catch (error) {
    return new Response("Invalid Rquest");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = TodoValidator.parse(body);
    await db.todo.create({
      data: {
        title,
        completed: false,
      },
    });
    return new Response("OK");
  } catch (error) {
    return new Response("Invalid Rquest");
  }
}
