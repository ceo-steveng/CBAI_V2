import { useState } from "react";
import { Spinner, Button, Text } from "@chakra-ui/react";
import { useWallet } from "providers/WalletProvider";
import { ConnectWalletModal } from "../ConnectWalletModal";

// interface User {
//   name: string;
//   id: number;
// }
// const user: {
//   name: string;
//   id: number;
// } = {
//   name: "Luiz",
//   id: 0,

export function ButtonWallet({
  onPress,
  isHeader,
  isLoading,
}: {
  onPress?(): void;
  isHeader?: boolean;
  isLoading?: boolean;
}) {
  // const [quantity, setQuantity] = useState(1);
  const { wallet, setWallet } = useWallet();
  const [visible, setVisible] = useState(false);

  // if (isLoadingTransaction)
  //   return (
  //     <Spinner
  //       thickness="6px"
  //       speed="0.65s"
  //       emptyColor="gray.200"
  //       color="#000"
  //       size="xl"
  //     />
  //   );

  return (
    <>
      <Button
        bgColor={"#370054"}
        onClick={() => {
          wallet && onPress ? onPress() : setVisible(true);
        }}
        color={"#fff"}
        width={"316px"}
        borderRadius={"30px"}
        boxShadow={"0px 0px 20px #961ed7"}
        border={"1px solid #7119a0"}
        height={"45px"}
        fontSize={"18px"}
        letterSpacing={"2px"}
        transition={"filter 0.2s"}
        _hover={{
          filter: "brightness(1.2)",
        }}
        overflow={"hidden"}
        isLoading={!isHeader && isLoading}
      >
        {isLoading ? (
          <Spinner
            thickness="6px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#000"
            size="lg"
          />
        ) : (
          <Text ml={wallet ? "" : "1rem"} isTruncated>
            {wallet && !isHeader
              ? "Mint"
              : isHeader && wallet
              ? `${wallet.substring(0, 12)}...${wallet.substring(
                  wallet.length - 4,
                  wallet.length
                )}`
              : "CONNECT WALLET"}
          </Text>
        )}
      </Button>

      <ConnectWalletModal
        visible={visible}
        setVisible={setVisible}
        wallet={wallet}
        // @ts-ignore
        setWallet={setWallet}
      />
    </>
  );
}
