import {createFileRoute} from '@tanstack/react-router'
import { useGetCommunityContainers } from '@/hooks/container/use-get-community-containers';
import ContainerLayout from '@/components/container/layout';

export const Route: any = createFileRoute('/community/')({
  component: Index,
})

function Index() {
  const { data: containers } = useGetCommunityContainers();

  return (
    <ContainerLayout data={containers} />
  );
}
