import { useContext } from "react";
import HomeUser from "../Components/HomeUser";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user && <HomeUser user={user} />}
      <h1>You are on home page!</h1>
    </div>
  );
};

export default Home;
