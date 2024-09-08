import { createLazyFileRoute } from '@tanstack/react-router'

export const Route: any = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div>
      <main className="flex flex-1 flex-col h-full gap-4 p-2 lg:gap-6 lg:p-6">
        Dashboard to display favorites, latest community posts, and more
      </main>
    </div>
  );
}
