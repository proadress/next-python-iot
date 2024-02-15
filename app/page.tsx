import Logout from "./components/Logout";
import { UserData } from "./lib/model";
import React from "react";
import TokenList from "./components/TokenList";
import { getToken } from "./lib/cookie";



const auth = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/user`, {
      headers: { "Authorization": "Bearer " + getToken() }
    });
    const data: string = await res.json();
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const resetGet = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/findall`, {
      headers: { "Authorization": "Bearer " + getToken() }, cache: "no-store"
    });
    const data: UserData[] = await res.json();
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const getlinelink = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/linelink`);
    const data: string = await res.json();
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const Home = async () => {
  const user = await auth();
  const data = await resetGet();
  const lineLink = await getlinelink();
  if (!data || !lineLink) {
    return <div>error</div>
  }
  return (
    <div>
      <Logout />
      {user}
      <TokenList inputdata={data} lineLink={lineLink} />
    </div>
  )
}

export default Home;