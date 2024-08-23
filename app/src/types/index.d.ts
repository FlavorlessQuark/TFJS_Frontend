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

export interface Container {
  id: string;
  name: string;
  description: string;
  creator: string;
  likes: string[];
  tags: string[];
  models: string[];
  dataset: any;
  public: boolean;
  sharedWith: string[];
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
  id: string;
  name: string;
  layers: Layer[];
}