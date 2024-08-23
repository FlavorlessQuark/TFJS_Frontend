import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Settings} from "lucide-react";
import ModelContainer from "@/components/container/model-container";

const ModelDrawer = (container: any) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Settings className="size-4"/>
          <span className="sr-only">Modal A</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Configuration</DrawerTitle>
          <DrawerDescription>
            Configure the settings for the model.
          </DrawerDescription>
        </DrawerHeader>
        <ModelContainer container={container} />
      </DrawerContent>
    </Drawer>
  )
}

export default ModelDrawer;