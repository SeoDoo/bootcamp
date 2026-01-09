import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import { TodoList } from "@/components/todo/todo-list";

export default async function UpcomingPage() {
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTodos = todos.filter((todo) => {
    if (!todo.due_date) return false;
    return new Date(todo.due_date) > today;
  });

  // 날짜순 정렬
  upcomingTodos.sort((a, b) => {
    if (!a.due_date || !b.due_date) return 0;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">예정</h1>
        <p className="text-muted-foreground mt-1">
          앞으로 해야 할 일들입니다
        </p>
      </div>
      <TodoList todos={upcomingTodos} lists={lists} title="예정된 할 일" showCompleted={false} />
    </div>
  );
}
