import { Button, Flex, Text, FlexProps, ButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

// @ts-ignore
const MotionFlex = motion<FlexProps | ButtonProps>(Flex);

interface QuantityButtonProps {
  quantity?: number;
  onIncrement?(): void;
  onDecrement?(): void;
}

export function QuantityButton({
  quantity = 1,
  onIncrement,
  onDecrement,
}: QuantityButtonProps) {
  return (
    <Flex
      w={"50%"}
      justifyContent={"center"}
      mt={"32px"}
      p={"0.2rem"}
      alignItems={"center"}
      bg={"#1D3750"}
    >
      <MotionFlex
        as={Button}
        w={"30px"}
        h={"30px"}
        alignItems={"center"}
        justifyContent={"center"}
        onClick={onDecrement}
        bgColor={"#4294F7"}
        disabled={quantity === 1}
        borderRadius={"0"}
        bg={"#4294F7"}
        color={"#fff"}
      >
        -
      </MotionFlex>
      <Flex flex={1} justifyContent={"center"} alignItems={"center"}>
        <Text
          fontWeight={700}
          color={"#fff"}
        >
          {quantity}
        </Text>
      </Flex>

      <MotionFlex
        as={Button}
        w={"30px"}
        h={"30px"}
        alignItems={"center"}
        justifyContent={"center"}
        onClick={onIncrement}
        bgColor={"#4294F7"}
        disabled={quantity === 10}
        borderRadius={"0"}
        bg={"#4294F7"}
        color={"#fff"}
      >
        +
      </MotionFlex>
    </Flex>
  );
}
