import Logout from "./components/Logout";
import React from "react";
import TokenList from "./components/TokenList";

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
  const lineLink = await getlinelink();
  if (!lineLink) {
    return <div>error</div>
  }
  return (
    <div>
      <Logout />
      <TokenList lineLink={lineLink} />
    </div>
  )
}

export default Home;