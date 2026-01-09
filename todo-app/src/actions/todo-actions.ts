"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Priority, Todo, TodoList } from "@/types/todo";

// Todo Actions
export async function getTodosAction(): Promise<Todo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("투두 조회 오류:", error);
    return [];
  }
  // 타입 단언 (데이터베이스 값이 우리 타입과 호환됨을 보장)
  return (data || []) as Todo[];
}

export async function getTodoByIdAction(id: string): Promise<Todo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("투두 조회 오류:", error);
    return null;
  }
  return data as Todo;
}

export async function createTodoAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const priority = (formData.get("priority") as Priority) || "medium";
  const listId = formData.get("listId") as string;
  const dueDateStr = formData.get("dueDate") as string | null;

  if (!title || !listId) {
    return { error: "제목과 리스트는 필수입니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .insert({
      title,
      description: description || null,
      priority,
      list_id: listId,
      due_date: dueDateStr || null,
    })
    .select()
    .single();

  if (error) {
    console.error("투두 생성 오류:", error);
    return { error: "투두 생성에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true, todo: data as Todo };
}

export async function updateTodoAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string | undefined;
  const description = formData.get("description") as string | undefined;
  const priority = formData.get("priority") as Priority | undefined;
  const listId = formData.get("listId") as string | undefined;
  const dueDateStr = formData.get("dueDate") as string | undefined;

  if (!id) {
    return { error: "ID는 필수입니다." };
  }

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description || null;
  if (priority !== undefined) updateData.priority = priority;
  if (listId !== undefined) updateData.list_id = listId;
  if (dueDateStr !== undefined) updateData.due_date = dueDateStr || null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todos")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("투두 수정 오류:", error);
    return { error: "투두 수정에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true, todo: data as Todo };
}

export async function deleteTodoAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    console.error("투두 삭제 오류:", error);
    return { error: "투두 삭제에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true };
}

export async function toggleTodoStatusAction(id: string) {
  const supabase = await createClient();
  
  // 현재 상태 조회
  const { data: todo, error: fetchError } = await supabase
    .from("todos")
    .select("status")
    .eq("id", id)
    .single();

  if (fetchError || !todo) {
    return { error: "투두를 찾을 수 없습니다." };
  }

  // 상태 토글
  const newStatus = todo.status === "pending" ? "completed" : "pending";
  const { data, error } = await supabase
    .from("todos")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("상태 변경 오류:", error);
    return { error: "상태 변경에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true, todo: data as Todo };
}

// List Actions
export async function getListsAction(): Promise<TodoList[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("리스트 조회 오류:", error);
    return [];
  }
  return (data || []) as TodoList[];
}

export async function createListAction(formData: FormData) {
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  if (!name || !color) {
    return { error: "이름과 색상은 필수입니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lists")
    .insert({ name, color })
    .select()
    .single();

  if (error) {
    console.error("리스트 생성 오류:", error);
    return { error: "리스트 생성에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true, list: data as TodoList };
}

export async function deleteListAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("lists").delete().eq("id", id);

  if (error) {
    console.error("리스트 삭제 오류:", error);
    return { error: "리스트 삭제에 실패했습니다." };
  }

  revalidatePath("/");
  return { success: true };
}
