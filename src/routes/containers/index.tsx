import {createFileRoute} from '@tanstack/react-router'
import { useGetContainers } from '@/hooks/container/use-get-containers';
import ContainerLayout from '@/components/container/layout';

export const Route: any = createFileRoute('/containers/')({
  component: Index,
})

function Index() {
  const { data: containers } = useGetContainers();

  return (
    <ContainerLayout data={containers} />
  );
}
