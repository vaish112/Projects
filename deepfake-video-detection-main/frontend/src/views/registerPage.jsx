import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(username, password, password2);
  };

  return (
    <section className="w-full md:w-1/2 mx-auto mt-12">
      <form
        className="p-6 bg-slate-100 rounded-md shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6">Register</h1>
        <hr />
        <div className="mb-4">
          <label className="text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className={`t-input`}
            type="text"
            id="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`t-input`}
            type="text"
            id="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-bold mb-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className={`t-input`}
            type="text"
            id="confirm-password"
            onChange={e => setPassword2(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <p className="mt-0.5 text-error text-xs italic">
            {password2 !== password ? "Passwords do not match" : ""}
          </p>
        </div>
        <button className="t-btn bg-primary text-white">Register</button>
      </form>
    </section>
  );
}

export default Register;
