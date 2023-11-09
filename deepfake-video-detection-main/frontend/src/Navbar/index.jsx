import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <nav>
      <div className="flex items-center justify-between flex-wrap bg-gray-800 p-3 text-white">
        <Link to="/">
          <h1 className="hover:cursor-pointer">DeepFake Detection</h1>
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/detection">Detection</Link>
              <button
                onClick={logoutUser}
                className="t-btn bg-error text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
