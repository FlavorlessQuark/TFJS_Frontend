export interface UserSelectorItem {
  text: string;
  onClick: () => void;
}

export interface UserSelectorItems {
  icon?: any;
  onClick: () => void;
  text: string;
  separator?: boolean;
  submenu?: UserSelectorItem[];
}

export interface Parameter {
  name: string;
  value: string | number | number[] | boolean;
}

export interface Layer {
  name: string;
  parameters: Parameter[];
}

export interface Model {
	_id: Id<"model">;
	name: string;
	layers: Layer[];
	_creationTime: number 
}

export interface Container {
	_id: Id<"container"> | string;
  creator: {
    _id: Id<"users">;
    _creationTime: number;
    name?: string;
    image?: string;
    email?: string;
    emailVerificationTime?: number;
    phone?: string;
    phoneVerificationTime?: number;
    isAnonymous?: boolean;
  };
	liked: boolean;
	description: string | null;
	models: Id<"model">[];
	name: string;
	public: boolean;
	sharedWith: Id<"users">[];
	views: number;
	_creationTime: number;
    compileOptions: {
        batchSize: number,
        epochs:number,
        loss:string,
        metrics:string
    }
    dataset?:{
        name: string,
        creator: any,
        description?: string,
        tags?: Array<string>,
        xshape:Array<number>,
        yshape:Array<number>,
        dataref?: any
    }
}

export interface LayerAttrs {
	[key: string]: {
		[key: string]: {
			[key: string]: any;
		};
	};
}

export interface LayerAttributes {
	[key: string]: {
		[key: string]: {
			desc: string;
			name: string;
			type: string[];
			options?: string[];
		};
	};
}

export interface Layer {
	name: string;
	parameters: Parameter[];
}

declare type SaveLayerFunction = (
	e: React.MouseEvent<HTMLButtonElement>,
	layerIdx: number,
	params: Parameter
) => Promise<void>;

export interface ModelContainerProps {
	layerAttrs?: LayerAttrs;
	model?: Model;
	container?: Container;
	addToLayer?: (e: React.MouseEvent<HTMLButtonElement>, layerIdx: number, params: Parameter) => Promise<void>;
}
