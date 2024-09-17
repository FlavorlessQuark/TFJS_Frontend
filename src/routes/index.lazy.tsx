import { createLazyFileRoute } from '@tanstack/react-router'
import { api } from "../../convex/_generated/api"
import { useQuery } from 'convex/react';
import { Star, TableProperties } from 'lucide-react';
import FavoritesCard from '@/components/FavoritesCard';
import DatasetCard from '@/components/DatasetCard';

export const Route: any = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const data = useQuery(api.container.getLikedContainers, {})
  const datasets = useQuery(api.data.getDatasets, {})

  return (
    <div>
      <main className="flex flex-1 flex-col h-full gap-4 p-2 lg:gap-6 lg:p-6">
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-2">Favorites <Star className="size-4 fill-yellow-500 stroke-yellow-500" /></span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.map((container) => (
              <FavoritesCard key={container._id} container={container} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-2">Datasets <TableProperties className="size-4" /></span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {datasets?.map((dataset) => (
              <DatasetCard key={dataset._id} dataset={dataset} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
