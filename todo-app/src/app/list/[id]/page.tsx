import { notFound } from "next/navigation";
import { getTodosAction, getListsAction } from "@/actions/todo-actions";
import { TodoList } from "@/components/todo/todo-list";

interface ListPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListPage({ params }: ListPageProps) {
  const { id } = await params;
  const [todos, lists] = await Promise.all([getTodosAction(), getListsAction()]);

  const list = lists.find((l) => l.id === id);
  if (!list) {
    notFound();
  }

  const listTodos = todos.filter((todo) => todo.list_id === id);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: list.color }}
          />
          <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          {listTodos.filter((t) => t.status === "pending").length}개의 할 일
        </p>
      </div>
      <TodoList
        todos={listTodos}
        lists={lists}
        title={`${list.name} 할 일`}
        selectedListId={id}
      />
    </div>
  );
}
