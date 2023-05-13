import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import Web3 from "web3";
import SmartContract from "../contracts/CBAI.json";
import { useWallet } from "../providers/WalletProvider";
import { Toast } from "../modules/components/Toast";

// const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractAddress = "0x2bAF0BECbF13E84498ba389007F2f3E0a87F4402";

interface MintProps {
  address: string;
  amount: number;
  isAdmin: boolean;
  isWhitelist: boolean;
}

export const useSmartContract = () => {
  const toast = useToast();
  const { active, wallet } = useWallet();
  const [web3, setWeb3] = useState<any>();
  const [contract, setContract] = useState<any>(null);
  const [currentSupplyValue, setCurrentSupplyValue] = useState(null);
  const [totalSupplyValue, setTotalSupplyValue] = useState(null);
  const [nftCost, setNftCost] = useState(0);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  const baseLink =
    process.env.NEXT_PUBLIC_CHAIN_ID === "5"
      ? "https://goerli.etherscan.io"
      : "https://etherscan.io";
  console.log({ web3 });

  useEffect(() => {
    initializeEngine().then((r) => r);
  }, [contract]);

  async function initializeEngine() {
    if (!contract) {
      await getContract();
    }

    if (contract && active && !currentSupplyValue && !totalSupplyValue) {
      const contractCurrentSupply = await contract.methods
        .getCurrentSupply()
        .call({
          from: wallet,
        });

      setCurrentSupplyValue(contractCurrentSupply);

      const contractTotalSupply = await contract.methods
        .getTotalSupply()
        .call();
      setTotalSupplyValue(contractTotalSupply);

      const contractNftCost = await contract.methods.getNFTCost().call();
      setNftCost(contractNftCost);
    }
  }

  async function getContract() {
    // @ts-ignore
    const web3instance = new Web3(window.ethereum);

    setWeb3(web3instance);

    // @ts-ignore
    const networkId = await window.ethereum.request({
      method: "net_version",
    });

    // @ts-ignore
    const NetworkData: any = await SmartContract.networks[networkId];

    if (NetworkData) {
      const smartContractObj = new web3instance.eth.Contract(
        // @ts-ignore
        SmartContract.abi,
        NetworkData.address
      );

      setContract(smartContractObj);
    }
  }

  async function requestMint({
    address,
    amount,
    isAdmin,
    isWhitelist,
  }: MintProps) {
    setIsLoadingTransaction(true);
    let transactionParameters;
    const etherCost = Web3.utils.fromWei(nftCost.toString(), "ether");

    if (isAdmin) {
      transactionParameters = {
        to: contractAddress,
        from: address,
        // @ts-ignore
        value: Web3.utils.toWei("0", "ether") * amount,
        gas: Web3.utils.toHex(120000 * amount),
      };
    } else {
      transactionParameters = {
        to: contractAddress,
        from: address,
        // @ts-ignore
        value: Web3.utils.toWei(etherCost, "ether") * amount,
        gas: Web3.utils.toHex(120000 * amount),
      };
    }

    let txHash: string;
    try {
      if (isWhitelist) {
        txHash = await contract.methods
          .whitelistMint(amount)
          .send(transactionParameters)
          .once("error", (err: any) => {
            return err;
          })
          .then((receipt: any) => {
            return receipt.transactionHash;
          });
      } else {
        txHash = await contract.methods
          .mint(amount)
          .send(transactionParameters)
          .once("error", (err: any) => {
            return err;
          })
          .then((receipt: any) => {
            return receipt.transactionHash;
          });
      }

      const contractCurrentSupply = await contract.methods
        .getCurrentSupply()
        .call({
          from: wallet,
        });

      setCurrentSupplyValue(contractCurrentSupply);
      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Transaction successful!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txHash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/${txHash}`,
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);

      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Transaction failed."}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }

      return {
        success: false,
        status: `😥 Something went wrong, check error at Etherscan: https://etherscan.io/tx/${error.receipt.transactionHash}`,
      };
    }
  }

  async function requestAddToWhitelist(
    connectedAccount: string,
    address: string
  ) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: connectedAccount,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .singleAddToWhitelist(address)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully added address to whitelist!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully added address to whitelist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to add to whitelist!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: `Failed to add address to whitelist, check error at Ethercan: https://etherscan.io/tx/${error.receipt.transactionHash}`,
      };
    }
  }

  async function requestAddToBlacklist(
    connectedAccount: string,
    address: string
  ) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: connectedAccount,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .singleAddToBlacklist(address)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully added address to blacklist!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully added address to blacklist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to add to blacklist!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to add address to blacklist: " + error.message,
      };
    }
  }

  async function requestRemoveFromWhitelist(
    connectedAccount: string,
    address: string
  ) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: connectedAccount,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .singleRemoveFromWhitelist(address)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully removed address from whitelist!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully removed address from whitelist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to remove address from whitelist!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to remove address from whitelist: " + error.message,
      };
    }
  }

  async function requestRemoveFromBlacklist(
    connectedAccount: string,
    address: string
  ) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: connectedAccount,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .singleRemoveFromBlacklist(address)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully removed address from blacklist!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        status: "Successfully removed address from blacklist",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to remove address from blacklist!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        status: "Failed to remove address from whitelist: " + error.message,
      };
    }
  }

  async function withdraw(address: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .withdraw()
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully withdrew from contract!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully withdrew from contract",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to withdrawn!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while withdrawing from contract: " + error.message,
      };
    }
  }

  async function activatePublicSale(address: string, state: boolean) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .adminManageSaleState(state)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully managed public sale!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully managed public sale",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage whitelist sale!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while managing whitelist sale: " + error.message,
      };
    }
  }



  async function activateWhitelist(address: string, state: boolean) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .adminManageWhitelistState(state)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully managed whitelist!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully managed whitelist sale ",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage whitelist state!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message:
          "An error ocurred while managing whitelist sale: " + error.message,
      };
    }
  }

  async function changeOwnership(address: string, ownerAddress: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .transferOwnership(ownerAddress)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed owner!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed owner",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change owner!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing owner: " + error.message,
      };
    }
  }

  async function setBaseUri(address: string, baseUri: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .setBaseURI(baseUri)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed base URI!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed base URI",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change base URI!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing base URI: " + error.message,
      };
    }
  }

  async function manageNFTCost(address: string, newCost: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .setNFTCost(newCost)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      const contractNftCost = await contract.methods.getNFTCost().call();
      setNftCost(contractNftCost);

      setIsLoadingTransaction(false);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed NFT Cost!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed NFT Cost",
      };
    } catch (error: any) {
      console.log({ error });
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to change NFT Cost!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing NFT Cost: " + error.message,
      };
    }
  }

  async function manageSupply(address: string, newSupply: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei("0", "ether"),
      gas: Web3.utils.toHex(100000),
    };

    try {
      const txhash = await contract.methods
        .adminIncreaseMaxSupply(newSupply)
        .send(transactionParameters)
        .once("error", (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);
      const contractTotalSupply = await contract.methods
        .getTotalSupply()
        .call();
      setTotalSupplyValue(contractTotalSupply);
      toast({
        status: "success",
        duration: 20000,
        isClosable: true,
        render: () => (
          <Toast
            title={"Successfully changed supply!"}
            message={"Check out your transaction on Etherscan:"}
            messageLink={`${baseLink}/tx/${txhash}`}
            isSuccess
          />
        ),
      });
      return {
        success: true,
        message: "Successfully changed supply",
      };
    } catch (error: any) {
      setIsLoadingTransaction(false);
      if (error.receipt) {
        toast({
          status: "error",
          duration: 20000,
          isClosable: true,
          render: () => (
            <Toast
              title={"Failed to manage supply!"}
              message={"😥 Something went wrong, check error at Etherscan!"}
              messageLink={
                error.receipt
                  ? `${baseLink}/tx/${error.receipt.transactionHash}`
                  : ""
              }
            />
          ),
        });
      }
      return {
        success: false,
        message: "An error occurred while changing supply: " + error.message,
      };
    }
  }

  return {
    requestMint,
    isLoadingTransaction,
    contract,
    totalSupplyValue,
    currentSupplyValue,
    requestAddToWhitelist,
    requestAddToBlacklist,
    requestRemoveFromWhitelist,
    requestRemoveFromBlacklist,
    withdraw,
    activatePublicSale,
    activateWhitelist,
    changeOwnership,
    setBaseUri,
    manageNFTCost,
    nftCost,
    manageSupply,
  };
};
