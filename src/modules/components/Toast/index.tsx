import { Flex, Link, Text } from "@chakra-ui/react";

interface ToastProps {
  title: string;
  message: string;
  messageLink?: string;
  isSuccess?: boolean;
}

export function Toast({ title, message, messageLink, isSuccess }: ToastProps) {
  return (
    <Flex
      color={"#000"}
      flexDir={"column"}
      p={3}
      bg={isSuccess ? "#7EEFAB" : "#EF7E7E"}
      borderRadius={"6px"}
      textAlign={"center"}
    >
      <Text>{title}</Text>
      <Text>{message}</Text>
      {messageLink && (
        <Link isExternal href={messageLink}>
          <Text color={"#2e6fbc"}>See transaction</Text>
        </Link>
      )}
    </Flex>
  );
}
