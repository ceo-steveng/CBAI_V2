import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import Web3 from 'web3';
import SmartContract from '../contracts/CBAI.json';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

interface MintProps {
  address: string,
  amount: number,
  isAdmin: boolean
}

export const useEthereum = () => {
  const { activateBrowserWallet, account, active, chainId } = useEthers();
  const [contract, setContract] = useState<any>(null);
  const [currentSupplyValue, setCurrentSupplyValue] = useState(null);
  const [totalSupplyValue, setTotalSupplyValue] = useState(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  useEffect(() => {
    activateBrowserWallet();
    initializeEngine();
  }, [contract, active, account]);

  async function initializeEngine() {
    if(!contract) {
      await getContract();
    }

    if(contract && active && !currentSupplyValue && !totalSupplyValue) {
      const contractCurrentSupply = await contract.methods.getCurrentSupply().call({
        from: account
      });

      setCurrentSupplyValue(contractCurrentSupply);

      const contractTotalSupply = await contract.methods.getTotalSupply().call();
      setTotalSupplyValue(contractTotalSupply);
    }
  }

  async function getContract() {
    // @ts-ignore
    const web3 = new Web3(window.ethereum);

    // @ts-ignore
    const networkId = await window.ethereum.request({
      method: 'net_version'
    });

    // @ts-ignore
    const NetworkData: any = await SmartContract.networks[networkId];

    if(NetworkData) {
      const smartContractObj = new web3.eth.Contract(
        // @ts-ignore
        SmartContract.abi,
        NetworkData.address
      );

      setContract(smartContractObj);
    }
  }

  async function requestMint({ address, amount, isAdmin }: MintProps) {
    setIsLoadingTransaction(true);
    let transactionParameters;

    if(isAdmin) {
      transactionParameters = {
        to: contractAddress,
        from: address,
        // @ts-ignore
        value: Web3.utils.toWei('0', 'ether') * amount,
        gas: Web3.utils.toHex(100000 * amount)
      };
    } else {
      transactionParameters = {
        to: contractAddress,
        from: address,
        // @ts-ignore
        value: Web3.utils.toWei('0.085', 'ether') * amount,
        gas: Web3.utils.toHex(100000 * amount)
      };
    }

    try {
      const txHash = await contract.methods
        .mint(amount)
        .send(transactionParameters)
        .once('error', (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      const contractCurrentSupply = await contract.methods
        .getCurrentSupply()
        .call({
          from: account
        });

      setCurrentSupplyValue(contractCurrentSupply);
      setIsLoadingTransaction(false);

      return {
        success: true,
        status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/${txHash}`
      };
    } catch(error: any) {
      setIsLoadingTransaction(false);
      return {
        success: false,
        status: '😥 Something went wrong: ' + error.message
      };
    }
  }

  async function requestAddToWhitelist(connectedAccount: string, address: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: connectedAccount,
      // @ts-ignore
      value: Web3.utils.toWei('0', 'ether'),
      gas: Web3.utils.toHex(100000)
    };

    try {
      await contract.methods
        .addAddressToWhitelist(address)
        .send(transactionParameters)
        .once('error', (err: any) => {
          return err;
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);

      return {
        success: true,
        status: 'Successfully added address to whitelist'
      }
    } catch (error: any) {
      setIsLoadingTransaction(false);

      return {
        success: false,
        status: 'Failed to add address to whitelist: ' + error.message
      }
    }
  }

  async function withdraw(address: string) {
    setIsLoadingTransaction(true);

    const transactionParameters = {
      to: contractAddress,
      from: address,
      // @ts-ignore
      value: Web3.utils.toWei('0', 'ether'),
      gas: Web3.utils.toHex(100000)
    };

    try {
      await contract.methods
        .withdraw()
        .send(transactionParameters)
        .once('error', (err: any) => {
          return err
        })
        .then((receipt: any) => {
          return receipt.transactionHash;
        });

      setIsLoadingTransaction(false);

      return {
        success: true,
        message: 'Successfully withdrew from contract'
      }
    } catch (error: any) {
      setIsLoadingTransaction(false);

      return {
        success: false,
        message: 'An error ocurred while withdrawing from contract: ' + error.message
      }
    }

  }

  return {
    requestMint,
    account,
    active,
    isLoadingTransaction,
    contract,
    totalSupplyValue,
    currentSupplyValue,
    chainId,
    activateBrowserWallet,
    requestAddToWhitelist,
    withdraw
  }
}
