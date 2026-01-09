"use client";

import { useState } from "react";
import { Todo, TodoList as TodoListType } from "@/types/todo";
import { TodoItem } from "./todo-item";
import { TodoForm } from "./todo-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  lists: TodoListType[];
  title?: string;
  showCompleted?: boolean;
  selectedListId?: string;
}

export function TodoList({
  todos,
  lists,
  title = "모든 할 일",
  showCompleted = true,
  selectedListId,
}: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const pendingTodos = todos.filter((todo) => todo.status === "pending");
  const completedTodos = todos.filter((todo) => todo.status === "completed");

  const getListById = (id: string) => lists.find((l) => l.id === id);

  return (
    <div className="space-y-6">
      {/* Quick Add Form */}
      <Card className="border-dashed border-2 bg-muted/30">
        <CardContent className="pt-4">
          <TodoForm lists={lists} defaultListId={selectedListId} />
        </CardContent>
      </Card>

      {/* Pending Todos */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Circle className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <Badge variant="secondary" className="font-normal">
              <ListTodo className="w-3 h-3 mr-1" />
              {pendingTodos.length}개
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {pendingTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>할 일이 없습니다</p>
              <p className="text-sm">위에서 새로운 할 일을 추가해보세요!</p>
            </div>
          ) : (
            pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                list={getListById(todo.list_id)}
                onEdit={setEditingTodo}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Completed Todos */}
      {showCompleted && completedTodos.length > 0 && (
        <Card className="opacity-75">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                완료됨
              </CardTitle>
              <Badge variant="outline" className="font-normal">
                {completedTodos.length}개
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                list={getListById(todo.list_id)}
                onEdit={setEditingTodo}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <TodoForm
        lists={lists}
        editTodo={editingTodo}
        open={!!editingTodo}
        onOpenChange={(open) => !open && setEditingTodo(null)}
      />
    </div>
  );
}
