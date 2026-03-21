import { createContext, useContext, type PropsWithChildren } from 'react';

const BuildReadOnlyContext = createContext<boolean>(false);

interface BuildReadOnlyProviderProps {
  value: boolean;
}

export const BuildReadOnlyProvider = ({
  value,
  children,
}: PropsWithChildren<BuildReadOnlyProviderProps>) => {
  return (
    <BuildReadOnlyContext.Provider value={value}>
      {children}
    </BuildReadOnlyContext.Provider>
  );
};

export const useBuildReadOnlyMode = (): boolean =>
  useContext(BuildReadOnlyContext);
