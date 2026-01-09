// 데이터베이스 테이블 기반 타입 (Supabase 연동)
export type Priority = "high" | "medium" | "low";
export type TodoStatus = "pending" | "completed";

// 애플리케이션에서 사용하는 타입
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: TodoStatus;
  due_date: string | null;
  list_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
  created_at: string | null;
}

export interface CreateTodoInput {
  title: string;
  description?: string | null;
  priority?: Priority;
  due_date?: string | null;
  list_id: string;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: TodoStatus;
  due_date?: string | null;
  list_id?: string;
}

export interface CreateListInput {
  name: string;
  color: string;
}
