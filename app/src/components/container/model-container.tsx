import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import ModelLayer from "./model.layer";
import { ModelContainerProps, SaveLayerFunction } from "../../types";

const ModelContainer = ({ layerAttrs, model }: ModelContainerProps) => {
	const [selectedLayer, setSelectedLayer] = useState("")
	const [openAccordions, setOpenAccordions] = useState<string[]>([]);
	const [hoveredAccordion, setHoveredAccordion] = useState<number | null>(null);

	const saveModel = useMutation(api.container.saveContainerModel)

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
										<Button 
											variant="outline" 
											className="ml-2 !h-4 !border-none !px-1 !bg-white !text-zinc-950 !hover:!bg-white/40 !text-xs !font-thin card-title"
											onClick={(e) => {
												e.stopPropagation();
												const newLayers = [...model.layers];
												newLayers.splice(i, 1);
												saveModel({ id: model._id, layers: newLayers });
											}}
										>
											Remove
										</Button>
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
					</div>
				</div>
			</fieldset>
		</form>
	)
}

export default ModelContainer;
