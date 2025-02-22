import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "@/apis/users/createUser";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export const ConnectWallet = () => {
  const [account, setAccount] = useState<string | undefined>();
  const [user, setUser] = useState<string | undefined>();
  const { sdk, connected } = useSDK();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userdetails = await createUser();
        console.log("User Details:", userdetails);

        if (userdetails?.data?._id) {
          const userId = userdetails.data._id;
          setUser(userId);
          localStorage.setItem("userId", userId);

          if (userdetails.message === "User already exists") {
            navigate("/");
          } else {
            navigate("/sign-up");
          }
          console.log("User ID stored:", userId);
        } else {
          console.error("User ID not found in response");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (account) {
      getUser();
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
                  {localStorage.getItem("walletAddress").slice(0, 10) + "..."}
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
