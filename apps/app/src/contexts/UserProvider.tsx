import React, { useContext, useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';

export const UserContext = React.createContext<any>([]);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>();

  const value = React.useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser],
  );


  return <UserContext.Provider value={{ ...value }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
