"use client";

import { useState } from "react";
import { Todo, TodoList, Priority } from "@/types/todo";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleTodoStatusAction, deleteTodoAction } from "@/actions/todo-actions";
import { Calendar, MoreVertical, Trash2, Edit, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  list?: TodoList;
  onEdit?: (todo: Todo) => void;
}

const priorityConfig: Record<Priority, { label: string; color: string; bgColor: string }> = {
  high: { label: "높음", color: "text-rose-600", bgColor: "bg-rose-100 dark:bg-rose-900/30" },
  medium: { label: "보통", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  low: { label: "낮음", color: "text-sky-600", bgColor: "bg-sky-100 dark:bg-sky-900/30" },
};

export function TodoItem({ todo, list, onEdit }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isCompleted = todo.status === "completed";
  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !isCompleted;

  const handleToggle = async () => {
    setIsLoading(true);
    await toggleTodoStatusAction(todo.id);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteTodoAction(todo.id);
    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "오늘";
    if (d.toDateString() === tomorrow.toDateString()) return "내일";
    
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isCompleted && "opacity-60 bg-muted/30",
        isOverdue && !isCompleted && "border-rose-300 dark:border-rose-800"
      )}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className="mt-1 h-5 w-5 rounded-full border-2"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={cn(
              "font-medium text-foreground truncate",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </h3>
          {list && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${list.color}20`, color: list.color }}
            >
              {list.name}
            </span>
          )}
        </div>

        {todo.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {todo.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-normal",
              priorityConfig[todo.priority].bgColor,
              priorityConfig[todo.priority].color
            )}
          >
            <Flag className="w-3 h-3 mr-1" />
            {priorityConfig[todo.priority].label}
          </Badge>

          {todo.due_date && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-normal",
                isOverdue && "border-rose-300 text-rose-600 dark:border-rose-700 dark:text-rose-400"
              )}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(todo.due_date)}
            </Badge>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.(todo)}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
