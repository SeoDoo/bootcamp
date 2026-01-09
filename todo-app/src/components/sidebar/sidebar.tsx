"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TodoList } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createListAction, deleteListAction } from "@/actions/todo-actions";
import {
  Home,
  CalendarDays,
  Calendar,
  CheckCircle2,
  List,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  lists: TodoList[];
  todoCount: {
    all: number;
    today: number;
    upcoming: number;
    completed: number;
  };
}

const colors = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
];

const navItems = [
  { href: "/", icon: Home, label: "모든 할 일", countKey: "all" as const },
  { href: "/today", icon: CalendarDays, label: "오늘", countKey: "today" as const },
  { href: "/upcoming", icon: Calendar, label: "예정", countKey: "upcoming" as const },
  { href: "/completed", icon: CheckCircle2, label: "완료", countKey: "completed" as const },
];

export function Sidebar({ lists, todoCount }: SidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const formData = new FormData();
    formData.set("name", newListName);
    formData.set("color", selectedColor);

    startTransition(async () => {
      await createListAction(formData);
      setNewListName("");
      setSelectedColor(colors[0]);
      setDialogOpen(false);
    });
  };

  const handleDeleteList = async (id: string) => {
    startTransition(async () => {
      await deleteListAction(id);
    });
  };

  return (
    <aside className="w-64 h-screen bg-card border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Todo App
        </h1>
        <p className="text-xs text-muted-foreground mt-1">할 일을 관리하세요</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 font-medium">{item.label}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {todoCount[item.countKey]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Lists Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              리스트
            </h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 리스트 만들기</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateList} className="space-y-4">
                  <Input
                    placeholder="리스트 이름"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    autoFocus
                  />
                  <div>
                    <label className="text-sm font-medium mb-2 block">색상 선택</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all",
                            selectedColor === color && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button type="submit" disabled={isPending || !newListName.trim()}>
                      {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      만들기
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            {lists.map((list) => {
              const isActive = pathname === `/list/${list.id}`;
              return (
                <div
                  key={list.id}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-accent",
                    isActive && "bg-accent"
                  )}
                >
                  <Link
                    href={`/list/${list.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="font-medium truncate">{list.name}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteList(list.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          Built with Next.js 15 & shadcn/ui
        </p>
      </div>
    </aside>
  );
}
