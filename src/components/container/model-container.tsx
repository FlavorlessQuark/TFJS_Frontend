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
import { cn } from "@/lib/utils";
import RunModal from "../RunModal";

const ModelContainer = ({ layerAttrs, model }: ModelContainerProps) => {
	const testRun = useAction(api.tensorflow.tf_model.run_model)
	const [selectedLayer, setSelectedLayer] = useState("")
	const [openAccordions, setOpenAccordions] = useState<string[]>([]);
	const [hoveredParam, setHoveredParam] = useState<number | null>(null);
	const [selectedParam, setSelectedParam] = useState<string | null>(null);
	const [selectedParamValue, setSelectedParamValue] = useState<any>(null);
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

			setOpenAccordions(prev => [...prev, String(model.layers.length - 1)])
			await saveModel({ id: model._id, layers: model.layers })
		}
	}

	const saveLayer: SaveLayerFunction = async (e, layerIdx, params) => {
		e.preventDefault()
		model.layers[layerIdx].parameters.push(params)
		await saveModel({ id: model._id, layers: model.layers })
	}

	return (
		<form className="grid w-96 items-start gap-6">
			<fieldset className="grid gap-6 border p-4">
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
											onClick={(e) => e.stopPropagation()}
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
									<div className={cn(layer.parameters.length > 0 && "mb-4")}>
									{layer.parameters.length > 0 && (
										<div className="uppercase text-[10px] text-zinc-500">
											Current Parameters
										</div>
									)}
									{layer.parameters.map((e, paramIdx) => (
										<div
											className="card-title text-xs flex items-center"
											key={e.name}
											onMouseEnter={() => setHoveredParam(paramIdx)}
											onMouseLeave={() => setHoveredParam(null)}
										>
											{e.name}: <span className="ml-2 text-zinc-500 card-title bg-zinc-950 px-1">{e.value}</span>
											{hoveredParam === paramIdx && (
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button
															variant="outline"
															className="ml-2 !h-4 !border-none !px-1 !bg-white !text-zinc-950 !hover:!bg-white/40 !text-xs !font-thin card-title"
														>
															Edit
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Edit Parameter</AlertDialogTitle>
															<AlertDialogDescription>
																This will allow you to edit the parameter and remove the current value.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction onClick={(e) => {
																e.stopPropagation();
																const newLayers = [...model.layers];
																const paramToEdit = newLayers[i].parameters.splice(paramIdx, 1)[0];
																saveModel({ id: model._id, layers: newLayers });
																setSelectedLayer(layer.name);
																setSelectedParam(paramToEdit.name);
																setSelectedParamValue(paramToEdit.value);
															}}>Edit Parameter</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											)}
										</div>
									))}
									</div>
									{layerAttrs && layerAttrs[layer.name] && (
										<ModelLayer
											layer={layer}
											layerIdx={i}
											params={layerAttrs[layer.name] as any}
											addToLayer={saveLayer}
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
