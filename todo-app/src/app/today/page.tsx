import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import { TodoList } from "@/components/todo/todo-list";

export default async function TodayPage() {
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTodos = todos.filter((todo) => {
    if (!todo.due_date) return false;
    const dueDate = new Date(todo.due_date);
    return dueDate >= today && dueDate < tomorrow;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">오늘</h1>
        <p className="text-muted-foreground mt-1">
          오늘 완료해야 할 일들입니다 ({new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })})
        </p>
      </div>
      <TodoList todos={todayTodos} lists={lists} title="오늘 할 일" />
    </div>
  );
}
