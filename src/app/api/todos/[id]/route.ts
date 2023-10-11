import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest,  context: { params:any }) {
  try {
    const id = context.params.id;
    await db.todo.delete({ where: { id: parseInt(id) } });
    return new Response("OK")
  } catch (error) {
    return new Response("Error")
  }
  }

  export async function PUT(req: NextRequest,  context: { params:any }) {
    try {
      const id = context.params.id;
      const {completed} = await req.json();
      await db.todo.update({ where: { id: parseInt(id) }, data: { completed: completed } });
      return new Response("OK")
    } catch (error) {
      return new Response("Error")
    }
  }
  