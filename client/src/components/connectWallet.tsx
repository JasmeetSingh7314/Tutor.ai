import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import getUser from "@/apis/users/getUser";

export const ConnectWallet = () => {
  const [account, setAccount] = useState<string | undefined>();
  const { sdk } = useSDK();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const walletAddress: string = localStorage.getItem("walletAddress");
        const userdetails = await getUser(walletAddress);
        console.log("User Details:", userdetails);

        if (userdetails.success && userdetails.data !== null) {
          const userId = userdetails.data._id;
          localStorage.setItem("userId", userId);

          console.log("User ID stored:", userId);
          navigate("/");
        } else {
          navigate("/sign-up");
          console.error("User ID not found in response");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (account) {
      checkUser();
    }
  }, [account]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);

      localStorage.setItem("walletAddress", accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const handleDisconnect = async () => {
    await sdk?.disconnect();
    setAccount(undefined);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("userId");
    localStorage.removeItem("userDetails");
    navigate("/");
    console.log("Metamask disconnected");
  };

  return (
    <div className=" font-urbanist">
      <span className="text-black font-semibold tracking-wider font-urbanist">
        {localStorage.getItem("walletAddress") ? (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="solid"
                size="lg"
                className="bg-[white] rounded-md text-black m-10"
              >
                <span>
                  {localStorage.getItem("walletAddress")?.slice(0, 10) + "..."}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              className="bg-black rounded-md p-4"
            >
              <DropdownItem key="new" className="font-urbanist">
                <Link to="/profile">Profile</Link>
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onPress={() => handleDisconnect()}
              >
                <span className="font-semibold tracking-tight ">
                  Disconnect Wallet
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            variant="solid"
            onPress={connect}
            size="lg"
            className="bg-[white] rounded-md text-black m-10"
          >
            Connect Wallet
          </Button>
        )}
      </span>
    </div>
  );
};
//  {
//    connected && (
//      <div>
//        <>
//          {chainId && `Connected chain: ${chainId}`}
//          <p></p>
//          {account && `Connected account: ${account}`}
//        </>
//      </div>
//    );
//  }
