import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import { TodoList } from "@/components/todo/todo-list";

export default async function HomePage() {
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">모든 할 일</h1>
        <p className="text-muted-foreground mt-1">
          모든 할 일을 한눈에 확인하세요
        </p>
      </div>
      <TodoList todos={todos} lists={lists} title="할 일" />
    </div>
  );
}
