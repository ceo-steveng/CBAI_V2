import { Flex, Image, Text, Heading } from "@chakra-ui/react";
import { QuantityButton } from "./QuantityButton";
import { useState } from "react";
// import { useWallet } from "providers/WalletProvider";
// import { useSmartContract } from "hooks/useSmartContract";
import { ButtonWallet } from "../ButtonWallet/ButtonWallet";
import Link from "next/link";
import { useWallet } from "../../../providers/WalletProvider";
import { useSmartContract } from "../../../hooks/useSmartContract";

export function MintCard() {
  const [quantity, setQuantity] = useState(1);

  const { wallet } = useWallet();

  const {
    requestMint,
    totalSupplyValue,
    currentSupplyValue,
    isLoadingTransaction,
  } = useSmartContract();

  return (
    <Flex w={"100%"} h={"100%"} align={"center"} justify={"center"}>
      <Flex
        backdropFilter={"blur(3px)"}
        bgColor={"#000000d8"}
        boxShadow={"0px 0px 20px 10px #2F71C0"}
        border={"1px #2F71C0"}
        borderRadius={"16px"}
        p={"0 2rem"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
      >
        <Flex
          borderRadius={"6px"}
          overflow={"hidden"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDir={"column"}
          color={"#fff"}
          pt={"2rem"}
        >
          <Image
            src={"img/cai-logo.png"}
            borderRadius={"4px"}
            objectFit={"cover"}
            w={"48px"}
          />
          <Flex pt={"1rem"}>
            <Text>TOTAL MINTED: </Text>
            <Text pl={"0.5rem"} color={"#2F71C0"} fontWeight={"600"}>
              {currentSupplyValue}/{totalSupplyValue}
            </Text>
          </Flex>
        </Flex>

        <Heading color={"#fff"} p={"1rem"} fontWeight={"400"} fontSize={"48px"}>
          Mint Cyborg.AI
        </Heading>

        <Text color={"#6D6F6E"} fontSize={"20px"} fontFamily={"Roobert"}>
          0.X ETH + Gas Fee
        </Text>
        <Text color={"#6D6F6E"} fontFamily={"Roobert"}>
          10 NFT's Max Per Transaction
        </Text>

        <QuantityButton
          quantity={quantity}
          onDecrement={() =>
            setQuantity(quantity === 0 ? quantity : quantity - 1)
          }
          onIncrement={() =>
            setQuantity(quantity === 10 ? quantity : quantity + 1)
          }
        />

        <Flex p={"2rem 1rem 1rem"}>
          <ButtonWallet
            isLoading={isLoadingTransaction}
            onPress={() =>
              requestMint({
                address: wallet,
                amount: quantity,
                isAdmin: false,
                isWhitelist: false,
              })
            }
          />
        </Flex>
        <Link href={"/"}>
          <Text
            p={"2rem 0 1rem"}
            color={"#6D6F6E"}
            textDecor={"underline"}
            fontSize={"14px"}
            cursor={"pointer"}
          >
            VIEW CONTRACT
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
}
