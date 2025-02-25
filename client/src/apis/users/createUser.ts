export const createUser = async (data: any) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: JSON.stringify(data),
    };

    const response = await fetch(
      "http://localhost:3000/api/users/create-user",
      requestOptions
    );

    const result = (await response).json();

    return result;
  } catch (error) {
    throw new Error("Creation of user failed");
  }
};
