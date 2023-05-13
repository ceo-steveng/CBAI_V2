import React, { useEffect, useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";

interface ModalProps {
  wallet?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setWallet(wallet: string | undefined): void;
}

export function ConnectWalletModal({
  wallet,
  visible,
  setVisible,
  setWallet,
}: ModalProps) {
  const { activateBrowserWallet, deactivate } = useEthers();
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  function handleModalOpen() {
    setVisible(!visible);
  }

  async function handleMetamaskConnect() {
    activateBrowserWallet();
    setVisible(false);
  }

  function handleWalletConnect() {
    connector.createSession();

    setVisible(false);
  }

  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal,
  });

  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }

    const { accounts } = payload.params[0];
    setIsWalletConnect(true);

    if (accounts[0]) {
      setWallet(accounts[0]);
    }
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    const { accounts } = payload.params[0];
    setIsWalletConnect(true);

    if (accounts[0]) {
      setWallet(accounts[0]);
    }
  });

  connector.on("disconnect", (error) => {
    if (error) {
      throw error;
    }
  });

  useEffect(() => {
    if (connector.connected) {
      const accounts = connector.accounts;
      setIsWalletConnect(true);
      //const chainId = connector.chainId;

      // @ts-ignore
      if (accounts[0]) {
        setWallet(accounts[0]);
      }
    }
  }, []);

  return (
    <Modal isOpen={visible} onClose={handleModalOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose your preferred wallet</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDir={"column"}>
            <Button
              m={"0.5rem"}
              onClick={() => {
                handleMetamaskConnect();
              }}
            >
              Metamask
            </Button>
            <Button
              m={"0.5rem"}
              onClick={() => {
                handleWalletConnect();
              }}
              disabled
            >
              Wallet Connect
            </Button>

            {wallet && (
              <Button
                m={"0.5rem"}
                onClick={() => {
                  if (isWalletConnect) {
                    setIsWalletConnect(false);
                    connector.killSession();
                  } else {
                    deactivate();
                  }
                  setVisible(false);
                  setWallet(undefined);
                }}
              >
                Disconnect
              </Button>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
