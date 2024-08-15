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