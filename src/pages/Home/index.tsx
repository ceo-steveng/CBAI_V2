import React from "react";
import { Flex } from "@chakra-ui/react";
import { MintCard } from "modules/components/MintingCard";


export default function Home() {
  return (
    <>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        backgroundImage={"/img/page-background.jpg"}
        backgroundRepeat={"no-repeat"}
        backgroundPosition={'center'}
        backgroundSize={"cover"}
        w={"100%"}
        h={'100vh'}
      >
        <MintCard />


      </Flex>

    </>
  );
}
