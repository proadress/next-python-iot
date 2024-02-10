import Logout from "./components/Logout";
import { UserData } from "./lib/model";
import React from "react";
import TokenList from "./components/TokenList";

const resetGet = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/findall`);
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
  // const user = await auth();
  const data = await resetGet();
  const lineLink = await getlinelink();
  if (!data || !lineLink) {
    return <div>error</div>
  }
  return (
    <div>
      <Logout />
      <div>
        {/* {user} */}
      </div>
      <TokenList inputdata={data} lineLink={lineLink} />
    </div>
  )
}

export default Home;