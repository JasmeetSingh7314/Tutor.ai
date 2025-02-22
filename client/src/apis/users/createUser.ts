import axios from "axios";
export const createUser = async () => {
  const address = localStorage.getItem("walletAddress");
  let data = JSON.stringify({
    walletAddress: address,
  });

  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/api/users/create-user",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios.request(config);

  return response.data;
};
