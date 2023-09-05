import React, { useContext, useEffect, useState } from 'react';
// import { logout } from '../utils/logout';
import { useWeb3 } from './Web3Context';

export const UserContext = React.createContext<any>([]);

export const UserProvider = ({ children }: any) => {
  const { setWeb3, provider  } = useWeb3();
  const [user, setUser] = useState<any>();

  const handleUserOnPageLoad = async () => {
    const accounts = await provider.request({ method: 'eth_accounts' });
    console.log('accounts', accounts);
    // If user wallet is no longer connected, logout
    if (!accounts[0] && user) {
    //   logout(setWeb3, setUser);
    }
    // Set user in localStorage, or clear localStorage if no wallet connected
    setUser(accounts[0]);
  };

  const value = React.useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser],
  );

  useEffect(() => {
    if(!provider)  return
    handleUserOnPageLoad();
  }, [provider]);

  return <UserContext.Provider value={{ ...value }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
