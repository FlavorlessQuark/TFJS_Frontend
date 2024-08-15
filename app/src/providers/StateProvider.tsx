import React, { createContext, useContext, useState, ReactNode } from 'react';

type State = {
  openContainerModal: boolean;
};

type StateContextType = {
  state: State;
  setState: (key: keyof State, value: any) => void;
};

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setInternalState] = useState<State>({
    openContainerModal: false,
  });

  const setState = (key: keyof State, value: any) => {
    setInternalState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useGlobalState = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a StateProvider');
  }
  return context;
};
