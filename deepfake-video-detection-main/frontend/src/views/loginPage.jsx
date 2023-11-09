import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  return (
    <section className="w-full md:w-1/2 mx-auto mt-12">
      <form
        onSubmit={loginUser}
        className="p-6 bg-slate-100 rounded-md shadow-md"
      >
        <h1>Login </h1>
        <hr />
        <label className="block text-sm font-bold mb-1 mt-4" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Enter Username"
          className="t-input mb-4"
        />
        <label className="block text-sm font-bold mb-1" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          className="t-input"
        />
        <button type="submit" className="t-btn bg-primary mt-4 text-white">
          Login
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
