import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEthers } from "@usedapp/core";

type WalletProviderProps<T> = {
  children: T;
};

type WalletContextProps = {
  wallet: any;
  active: boolean;
  activateBrowserWallet: () => void;
  chainId: number | undefined;
  deactivate: () => void;
  setWallet?(wallet: string | undefined): void;
};

const WalletContext = createContext({} as WalletContextProps);

function WalletProvider({ children }: WalletProviderProps<ReactNode>) {
  const [wallet, setWallet] = useState();
  const { activateBrowserWallet, account, active, chainId, deactivate } =
    useEthers();

  useEffect(() => {
    if (account) {
      activateBrowserWallet();
      // @ts-ignore
      setWallet(account || undefined);
    }
  }, [account]);

  return (
    <WalletContext.Provider
      value={{
        activateBrowserWallet,
        wallet,
        active,
        chainId,
        deactivate,
        // @ts-ignore
        setWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

const useWallet = () => useContext(WalletContext);

export { WalletProvider, useWallet };
