import { useState } from "react";

import { API } from "../../api/api";

import {
  useNavigate,
  Link
} from "react-router-dom";

const Login = ({ setIsAuth }) => {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      setIsAuth(true);

      navigate("/upload");

    } catch (err) {

      alert(
        err.response?.data?.msg ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-[400px] p-8 bg-white/10 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6">
          Login 🔐
        </h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded text-black"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded text-black"
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button className="bg-blue-600 p-3 rounded">
            Login
          </button>

        </form>

        <p className="mt-4 text-sm">

          No account?

          <Link
            to="/register"
            className="text-green-400 ml-2"
          >
            Register
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Login;
