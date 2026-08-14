import { useContext, useEffect } from 'react';
import { SpotlightContext } from './SpotlightContext';
import type { SpotlightAction, SpotlightContextType } from './types';

export const useSpotlight = (): SpotlightContextType => {
  const context = useContext(SpotlightContext);
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return context;
};

export const useRegisterSpotlightActions = (
  groupName: string,
  actions: SpotlightAction[]
): void => {
  const { registerActions } = useSpotlight();

  useEffect(() => {
    const unregister = registerActions(groupName, actions);
    return () => {
      unregister();
    };
  }, [groupName, actions, registerActions]);
};
