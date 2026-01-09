import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar/sidebar";
import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App - 할 일 관리",
  description: "Next.js 15와 shadcn/ui로 만든 투두앱",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todoCount = {
    all: todos.filter((t) => t.status === "pending").length,
    today: todos.filter((t) => {
      if (!t.due_date || t.status === "completed") return false;
      const dueDate = new Date(t.due_date);
      return dueDate >= today && dueDate < tomorrow;
    }).length,
    upcoming: todos.filter((t) => {
      if (!t.due_date || t.status === "completed") return false;
      return new Date(t.due_date) >= tomorrow;
    }).length,
    completed: todos.filter((t) => t.status === "completed").length,
  };

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen bg-background">
          <Sidebar lists={lists} todoCount={todoCount} />
          <main className="flex-1 overflow-y-auto">
            <div className="container max-w-4xl mx-auto p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
