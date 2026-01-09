import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import { TodoList } from "@/components/todo/todo-list";

export default async function CompletedPage() {
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  const completedTodos = todos.filter((todo) => todo.status === "completed");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">완료</h1>
        <p className="text-muted-foreground mt-1">
          완료한 할 일들입니다 ({completedTodos.length}개)
        </p>
      </div>
      <TodoList todos={completedTodos} lists={lists} title="완료된 할 일" showCompleted={true} />
    </div>
  );
}
