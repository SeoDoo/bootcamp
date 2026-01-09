"use client";

import { useState, useTransition } from "react";
import { Todo, TodoList, Priority } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTodoAction, updateTodoAction } from "@/actions/todo-actions";
import { CalendarIcon, Plus, Flag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface TodoFormProps {
  lists: TodoList[];
  defaultListId?: string;
  editTodo?: Todo | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "high", label: "높음", color: "text-rose-500" },
  { value: "medium", label: "보통", color: "text-amber-500" },
  { value: "low", label: "낮음", color: "text-sky-500" },
];

export function TodoForm({ lists, defaultListId, editTodo, open, onOpenChange }: TodoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(editTodo?.title || "");
  const [description, setDescription] = useState(editTodo?.description || "");
  const [priority, setPriority] = useState<Priority>(editTodo?.priority || "medium");
  const [listId, setListId] = useState(editTodo?.list_id || defaultListId || lists[0]?.id || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    editTodo?.due_date ? new Date(editTodo.due_date) : undefined
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(undefined);
    setListId(defaultListId || lists[0]?.id || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.set("title", title);
    if (description) formData.set("description", description);
    formData.set("priority", priority);
    formData.set("listId", listId);
    if (dueDate) formData.set("dueDate", dueDate.toISOString());

    startTransition(async () => {
      if (editTodo) {
        formData.set("id", editTodo.id);
        await updateTodoAction(formData);
      } else {
        await createTodoAction(formData);
      }
      resetForm();
      onOpenChange?.(false);
    });
  };

  // Quick add form (인라인)
  if (!open && onOpenChange) {
    return null;
  }

  // Dialog form for editing
  if (editTodo && open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>투두 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="할 일을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="text-lg"
            />
            <Input
              placeholder="설명 (선택사항)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="리스트" />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: list.color }}
                        />
                        {list.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="우선순위" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className={cn("flex items-center gap-2", opt.color)}>
                        <Flag className="w-3 h-3" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP", { locale: ko }) : "마감일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange?.(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isPending || !title.trim()}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                저장
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Inline quick add form
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="새 할 일 추가... (Enter로 저장)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending || !title.trim()} size="icon">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={listId} onValueChange={setListId}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="리스트" />
          </SelectTrigger>
          <SelectContent>
            {lists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  {list.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className={cn("flex items-center gap-2", opt.color)}>
                  <Flag className="w-3 h-3" />
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 text-xs justify-start",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {dueDate ? format(dueDate, "M/d") : "마감일"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
}
