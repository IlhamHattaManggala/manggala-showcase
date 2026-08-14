import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SpotlightAction, SpotlightActionGroup, SpotlightContextType } from './types';

export const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

export interface SpotlightProviderProps {
  children: React.ReactNode;
  actions?: SpotlightActionGroup[];
  shortcut?: string;
}

export const SpotlightProvider: React.FC<SpotlightProviderProps> = ({
  children,
  actions: initialActions = [],
  shortcut = 'k',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState<SpotlightActionGroup[]>(initialActions);

  const openSpotlight = useCallback(() => setIsOpen(true), []);
  const closeSpotlight = useCallback(() => setIsOpen(false), []);
  const toggleSpotlight = useCallback(() => setIsOpen((prev) => !prev), []);

  const registerActions = useCallback((groupName: string, newActions: SpotlightAction[]) => {
    setActions((prevActions) => {
      const existingGroupIndex = prevActions.findIndex((g) => g.group === groupName);
      if (existingGroupIndex > -1) {
        const updated = [...prevActions];
        updated[existingGroupIndex] = {
          ...updated[existingGroupIndex],
          actions: [...updated[existingGroupIndex].actions, ...newActions],
        };
        return updated;
      }
      return [...prevActions, { group: groupName, actions: newActions }];
    });

    return () => {
      setActions((prevActions) =>
        prevActions
          .map((g) => {
            if (g.group !== groupName) return g;
            const actionIdsToRemove = new Set(newActions.map((a) => a.id));
            return {
              ...g,
              actions: g.actions.filter((a) => !actionIdsToRemove.has(a.id)),
            };
          })
          .filter((g) => g.actions.length > 0)
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      if (isCmdOrCtrl && event.key.toLowerCase() === shortcut.toLowerCase()) {
        event.preventDefault();
        toggleSpotlight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcut, toggleSpotlight]);

  return (
    <SpotlightContext.Provider
      value={{
        isOpen,
        openSpotlight,
        closeSpotlight,
        toggleSpotlight,
        actions,
        setActions,
        registerActions,
      }}
    >
      {children}
    </SpotlightContext.Provider>
  );
};
