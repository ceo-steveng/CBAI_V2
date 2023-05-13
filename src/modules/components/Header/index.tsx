import { Flex } from "@chakra-ui/react";
import { ButtonWallet } from "../ButtonWallet/ButtonWallet";

export function Header({}: { logo?: string }) {
  return (
    <Flex
      w={{ base: "100%", md: "100%", lg: "100%" }}
      justifyContent={"center"}
      position={"fixed"}
      backdropFilter={"blur(2px)"}
      bgColor={"#000000ca"}
      zIndex={99}
    >
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", lg: "end" }}
        minWidth={{ base: "100%", "2xl": "1360px" }}
        padding={"23px"}
      >
        <ButtonWallet isHeader />
      </Flex>
    </Flex>
  );
}
