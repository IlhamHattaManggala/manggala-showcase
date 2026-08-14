import React from 'react';

export interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  group?: string;
  onSelect: (action: SpotlightAction) => void;
}

export interface SpotlightActionGroup {
  group: string;
  actions: SpotlightAction[];
}

export interface SpotlightContextType {
  isOpen: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  actions: SpotlightActionGroup[];
  setActions: React.Dispatch<React.SetStateAction<SpotlightActionGroup[]>>;
  registerActions: (groupName: string, actions: SpotlightAction[]) => () => void;
}
