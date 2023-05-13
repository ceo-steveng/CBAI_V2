import {
  chakra,
  Container,
  Flex,
  Image,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";
import { ReactNode } from "react";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export function Footer() {
  return (
    <>
      <Flex
        color={useColorModeValue("gray.700", "gray.200")}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={"4.5rem"}
        bgColor={""}
      >
        <Image src="/img/logo.svg" />
        <Text color={"#FFF"} fontFamily={'Orbitron'} fontSize={'24px'} mt={'2.5rem'}>
          Join our community
        </Text>
        <Container
          as={Stack}
          w={'100%'}
          mt={"16px"}
          py={4}
          pb={'2rem'}
          direction={{ base: "column", md: "row" }}
          // spacing={4}
          justifyContent={{ base: "center", md: "space-between" }}
          alignItems={'center'}
        >
          <Stack direction={"row"} spacing={6} m={'0 auto'}>
            <SocialButton
              label={"Discord"}
              //href={"https://discord.gg/Rp9zjy8U"}
              href={"#"}
            >
              <FaDiscord color={"#FFF"} size={"32px"} />
            </SocialButton>
            <SocialButton label={"Instagram"} href={"#"}>
              <FaInstagram color={"#FFF"} size={"32px"} />
            </SocialButton>
            <SocialButton
              label={"Twitter"}
              href={"https://twitter.com/nftpowerranking"}
            >
              <FaTwitter color={"#FFF"} size={"32px"} />
            </SocialButton>
          </Stack>
        </Container>
      </Flex>
    </>
  );
}
