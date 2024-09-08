import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAction, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import ModelLayer from "./model.layer";
import { ModelContainerProps, SaveLayerFunction } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TrashIcon } from "lucide-react";
import { useDeleteModel } from "@/hooks/model/use-delete-model";
import { toast } from "sonner";

const ModelContainer = ({ layerAttrs, model }: ModelContainerProps) => {
	const testRun = useAction(api.tensorflow_fn.run_model)
	const [selectedLayer, setSelectedLayer] = useState("")
	const [openAccordions, setOpenAccordions] = useState<string[]>([]);
	const [hoveredAccordion, setHoveredAccordion] = useState<number | null>(null);

	const saveModel = useMutation(api.container.saveContainerModel)
	const { mutate: deleteModel } = useDeleteModel();

	if (!model) {
		return null;
	}

	const addSelectedLayer = async (e: any) => {
		e.preventDefault();
		if (selectedLayer != "") {
			if (!model.layers)
				model.layers = []

			model.layers.push({ name: selectedLayer, parameters: [] })

			console.log("updating model", model)

			await saveModel({ id: model._id, layers: model.layers })
		}
	}

	const saveLayer: SaveLayerFunction = async (e, layerIdx, params) => {
		console.log("saving layer", e, layerIdx, params)
		e.preventDefault()
		model.layers[layerIdx].parameters.push(params)
		await saveModel({ id: model._id, layers: model.layers })
	}

	return (
		<form className="grid w-96 items-start gap-6">
			<fieldset className="grid gap-6 rounded-lg border p-4">
				<legend className="-ml-1 px-1 text-sm font-medium">
					{model.name}
				</legend>
				<div className="grid gap-1">
					{model.layers && model.layers.map((layer, i) => (
						<Accordion
							key={i}
							type="single"
							collapsible
							value={openAccordions.includes(String(i)) ? String(i) : undefined}
							onValueChange={(value) => {
								setOpenAccordions(prev => 
									value 
										? [...prev, value]
										: prev.filter(item => item !== String(i))
								);
							}}
						>
							<AccordionItem 
								value={String(i)} 
								className="!bg-zinc-900 px-4 !border !border-purple-400/40 hover:!border-purple-400"
								onMouseEnter={() => setHoveredAccordion(i)}
								onMouseLeave={() => setHoveredAccordion(null)}
							>
								<AccordionTrigger className="!no-underline">
									<div className="flex flex-row items-center">
									<span className="font-medium card-title">{layer.name}</span>
									{hoveredAccordion === i && (
										<AlertDialog>
										<AlertDialogTrigger asChild>
										<Button 
											variant="outline" 
											className="ml-2 !h-4 !border-none !px-1 !bg-white !text-zinc-950 !hover:!bg-white/40 !text-xs !font-thin card-title"
										>
											Remove
										</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This will remove the layer from the model.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction onClick={(e) => {
												e.stopPropagation();
												const newLayers = [...model.layers];
												newLayers.splice(i, 1);
												saveModel({ id: model._id, layers: newLayers });
											}}>Remove Layer</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
									)}
									</div>
								</AccordionTrigger>
								<AccordionContent>
									{layer.parameters.map((e) => (
										<div key={e.name}> {e.name} : {e.value}</div>
									))}
									{layerAttrs && layerAttrs[layer.name] && (
										<ModelLayer
											layer={layer}
											layerIdx={i}
											params={layerAttrs[layer.name] as any}
											addToLayer={({ e, layerIdx, params }: any) => saveLayer(e, layerIdx, params)}
										/>
									)}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))
					}
					<div>
						<Select onValueChange={(e) => setSelectedLayer(e)}>
							<SelectTrigger id="model" className="items-start [&_[data-description]]:hidden">
								<SelectValue placeholder="Select a layer" />
							</SelectTrigger>
							<SelectContent>
								{layerAttrs && Object.keys(layerAttrs).map((key) =>
									<SelectItem key={key} value={key}>
										{key}
									</SelectItem>
								)}
							</SelectContent>
						</Select>
						<Button className="mt-1 w-full !bg-zinc-100 hover:!bg-zinc-300 hover:!text-zinc-950" onClick={(e) => addSelectedLayer(e)}> Add</Button>
						{/* <Button onClick={async () => await testRun({id:elem?._id})}> Run Model (test button)</Button> */}
						<div className="flex flex-row items-center mt-4 justify-between">
						<span className="text-xs text-muted-foreground card-title hover:!text-zinc-100 cursor-pointer hover:underline" onClick={async () => await testRun({ id: model?._id })}>
							Run Model (test button)
						</span>

						<Button 
							variant="outline" 
							size="icon" 
							className="h-5 w-5 border-none hover:!bg-zinc-900 hover:!text-zinc-50 !bg-transparent"
							onClick={(e) => {
								e.preventDefault();
								deleteModel({ id: model._id }, {
								onSuccess: (response: any) => {
									console.log("Model deleted", response)
									toast.success("Model deleted")
								},
								onError: (error: any) => {
									console.log("Error deleting model", error)
								},
								onFinally: () => {
									console.log("Deleted model finally")
								},
								throwError: true,
								})
							}}
						>
							<TrashIcon className="size-3.5 stroke-rose-500" />
						</Button>
						</div>
					</div>
				</div>
			</fieldset>
		</form>
	)
}

export default ModelContainer;
