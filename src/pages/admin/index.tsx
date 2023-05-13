import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { useSmartContract } from "hooks/useSmartContract";

import { useWallet } from "providers/WalletProvider";

import { QuantityButton } from "../../modules/components/MintingCard/QuantityButton";
import Web3 from "web3";

export default function Admin() {
  const { wallet } = useWallet();
  const {
    requestAddToWhitelist,
    requestAddToBlacklist,
    requestRemoveFromWhitelist,
    requestRemoveFromBlacklist,
    withdraw,
    requestMint,
    totalSupplyValue,
    currentSupplyValue,
    nftCost,
    manageNFTCost,
    changeOwnership,
    setBaseUri,
    activatePublicSale,
    activateWhitelist,
    manageSupply,
    isLoadingTransaction,
  } = useSmartContract();
  const [whitelistAddressAdd, setWhitelistAddressAdd] = useState("");
  const [blacklistAddressAdd, setBlacklistAddressAdd] = useState("");
  const [whitelistAddressRemove, setWhitelistAddressRemove] = useState("");
  const [blacklistAddressRemove, setBlacklistAddressRemove] = useState("");

  const [publicQuantity, setPublicQuantity] = useState(1);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [baseURI, setBaseURI] = useState("");
  const [nftCostValue, setNftCostValue] = useState("");
  const [whitelistAdminMint, setWhitelistAdminMint] = useState("admin");
  const [mintType, setMintType] = useState("public");
  const [newSupply, setNewSupply] = useState("");

  async function handleAddToWhitelist() {
    await requestAddToWhitelist(wallet, whitelistAddressAdd);
    setWhitelistAddressAdd("");
  }

  async function handleAddToBlacklist() {
    await requestAddToBlacklist(wallet, blacklistAddressAdd);
    setBlacklistAddressAdd("");
  }

  async function handleRemoveFromWhitelist() {
    await requestRemoveFromWhitelist(wallet, whitelistAddressRemove);
    setWhitelistAddressRemove("");
  }
  async function handleRemoveFromBlacklist() {
    await requestRemoveFromBlacklist(wallet, blacklistAddressRemove);
    setBlacklistAddressRemove("");
  }

  async function handleWithdraw() {
    await withdraw(wallet);
  }

  async function handleMint() {
    await requestMint({
      address: wallet,
      amount: publicQuantity,
      isAdmin: whitelistAdminMint === "admin" ? true : false,
      isWhitelist: mintType === "whitelist" ? true : false,
    });
    setPublicQuantity(1);
  }

  async function managePublicSale(state: boolean) {
    await activatePublicSale(wallet, state);
  }

  async function manageWhitelistState(state: boolean) {
    await activateWhitelist(wallet, state);
  }


  async function setNFTCostOnContract() {
    await manageNFTCost(wallet, nftCostValue);
    setNftCostValue("");
  }

  async function changeOwnershipOnContract() {
    await changeOwnership(wallet, ownerAddress);
    setOwnerAddress("");
  }

  async function manageBaseURI() {
    await setBaseUri(wallet, baseURI);
    setBaseURI("");
  }

  async function handleChangeSupply() {
    await manageSupply(wallet, newSupply);
    setNewSupply("");
  }

  return (
    <Flex
      flexDir={"column"}
      alignItems={"center"}
      backgroundImage={"/img/page-background.jpg"}
      backgroundRepeat={"no-repeat"}
      backgroundPosition={"center"}
      backgroundSize={"cover"}
      w={"100%"}
      pt={"8rem"}
    >
      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Change contract ownership</Text>

          <Input
            value={ownerAddress}
            placeholder="0x00e1656e45f18ec6747F5a8496Fd39B50b38396D"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setOwnerAddress(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                changeOwnershipOnContract();
              }}
              isLoading={isLoadingTransaction}
            >
              CHANGE OWNERSHIP
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Change IPFS Base URI</Text>

          <Input
            value={baseURI}
            placeholder="ipfs://0x00e1656e45f18ec6747F5a8496Fd39B50b38396D/"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setBaseURI(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                manageBaseURI();
              }}
              isLoading={isLoadingTransaction}
            >
              CHANGE URI
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Mint</Text>
          <Text color={"#FFF"}>
            NFT Price: {Web3.utils.fromWei(nftCost.toString(), "ether")} (
            {nftCost} WEI)
          </Text>
          <Text color={"#FFF"}>
            {currentSupplyValue}/{totalSupplyValue}
          </Text>

          <Flex>
            <RadioGroup onChange={setWhitelistAdminMint}>
              <Radio color={"#FFF"} value={"admin"} defaultChecked>
                As Admin
              </Radio>
              <Radio color={"#FFF"} value={"user"}>
                As User
              </Radio>
            </RadioGroup>
          </Flex>

          <Flex>
            <RadioGroup onChange={setMintType}>
              <Radio color={"#FFF"} value={"whitelist"} defaultChecked>
                Whitelist Mint
              </Radio>
              <Radio color={"#FFF"} value={"public"}>
                Public Mint
              </Radio>
            </RadioGroup>
          </Flex>

          <QuantityButton
            quantity={publicQuantity}
            onDecrement={() =>
              setPublicQuantity(
                publicQuantity === 0 ? publicQuantity : publicQuantity - 1
              )
            }
            onIncrement={() =>
              setPublicQuantity(
                publicQuantity === 10 ? publicQuantity : publicQuantity + 1
              )
            }
          />
          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleMint();
              }}
              isLoading={isLoadingTransaction}
            >
              MINT
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Add whitelist address</Text>

          <Input
            value={whitelistAddressAdd}
            placeholder="0x00e1656e45f18ec6747F5a8496Fd39B50b38396D"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setWhitelistAddressAdd(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleAddToWhitelist();
              }}
              isLoading={isLoadingTransaction}
            >
              ADD TO WHITELIST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Remove whitelist address</Text>

          <Input
            value={whitelistAddressRemove}
            placeholder="0x00e1656e45f18ec6747F5a8496Fd39B50b38396D"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setWhitelistAddressRemove(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleRemoveFromWhitelist();
              }}
              isLoading={isLoadingTransaction}
            >
              REMOVE FROM WHITELIST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Add blacklist address</Text>

          <Input
            value={blacklistAddressAdd}
            placeholder="0x00e1656e45f18ec6747F5a8496Fd39B50b38396D"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setBlacklistAddressAdd(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleAddToBlacklist();
              }}
              isLoading={isLoadingTransaction}
            >
              ADD TO BLACKLIST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Remove blacklist address</Text>

          <Input
            value={blacklistAddressRemove}
            placeholder="0x00e1656e45f18ec6747F5a8496Fd39B50b38396D"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setBlacklistAddressRemove(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleRemoveFromBlacklist();
              }}
              isLoading={isLoadingTransaction}
            >
              REMOVE FROM BLACKLIST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Change NFT cost (WEI)</Text>

          <Input
            value={nftCostValue}
            placeholder="10000000000000000"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setNftCostValue(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                setNFTCostOnContract();
              }}
              isLoading={isLoadingTransaction}
            >
              CHANGE NFT COST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"25rem auto 2rem auto"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Change Supply</Text>

          <Input
            value={newSupply}
            placeholder="10000000000000000"
            w={"100%"}
            bg={"#FFF"}
            color={"#000"}
            mt={"1rem"}
            onChange={(event) => {
              setNewSupply(event?.target.value);
            }}
          />

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#466AEA",
              }}
              onClick={() => {
                handleChangeSupply();
              }}
              isLoading={isLoadingTransaction}
            >
              CHANGE SUPPLY
            </Button>
          </Flex>
        </Box>
      </Flex>
      <Flex
        m={"0 auto"}
        pb={"1rem"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Manage Public Sale</Text>

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#C00EEC"}
              borderWidth={"1px"}
              borderColor={"#C00EEC"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#C00EEC",
              }}
              onClick={() => {
                managePublicSale(true);
              }}
              isLoading={isLoadingTransaction}
            >
              ACTIVATE SALE
            </Button>
          </Flex>
          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#C00EEC",
              }}
              onClick={() => {
                managePublicSale(false);
              }}
              isLoading={isLoadingTransaction}
            >
              DEACTIVATE SALE
            </Button>
          </Flex>
        </Box>
      </Flex>


      <Flex
        m={"0 auto"}
        pb={"1rem"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Manage Whitelist State</Text>

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#C00EEC"}
              borderWidth={"1px"}
              borderColor={"#C00EEC"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#C00EEC",
              }}
              onClick={() => {
                manageWhitelistState(true);
              }}
              isLoading={isLoadingTransaction}
            >
              ACTIVATE WHITELIST
            </Button>
          </Flex>
          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#466AEA"}
              borderWidth={"1px"}
              borderColor={"#466AEA"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#C00EEC",
              }}
              onClick={() => {
                manageWhitelistState(false);
              }}
              isLoading={isLoadingTransaction}
            >
              DEACTIVATE WHITELIST
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Flex
        m={"0 auto"}
        pb={"1rem"}
        w={{ base: "80%", lg: "50%", xl: "40%", "2xl": "25%" }}
        bg={"#101013"}
        mt={"1rem"}
        borderRadius={"16px"}
        borderWidth={"1px"}
        borderColor={"rgba(62, 62, 62, 0.2)"}
      >
        <Box p={"1rem 1.5rem"} w={"100%"}>
          <Text color={"#FFF"}>Withdraw amount</Text>

          <Flex m={"1rem 0 0 auto"}>
            <Button
              w={"100%"}
              p={"2rem 7rem"}
              bg={"#C00EEC"}
              borderWidth={"1px"}
              borderColor={"#C00EEC"}
              color={"#FFF"}
              fontWeight={600}
              _hover={{
                backgroundColor: "#FFF",
                color: "#C00EEC",
              }}
              onClick={() => {
                handleWithdraw();
              }}
              isLoading={isLoadingTransaction}
            >
              WITHDRAW
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/*<Footer />*/}
    </Flex>
  );
}
