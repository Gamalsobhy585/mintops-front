import React, { createContext, useState, ReactNode } from 'react';

interface RoleContextProps {
  role: string;
  setRole: (role: string) => void;
}

export const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const RoleContextProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string>('member');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
