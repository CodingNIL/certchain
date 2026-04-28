import { useState } from "react";

import { API } from "../../api/api";

import {
  useNavigate,
  Link
} from "react-router-dom";

const Register = ({ setIsAuth }) => {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/register",
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
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="w-[400px] p-8 bg-white/10 rounded-2xl">

        <h1 className="text-3xl font-bold mb-6">
          Register ✨
        </h1>

        <form
          onSubmit={handleRegister}
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

          <button className="bg-green-600 p-3 rounded">
            Register
          </button>

        </form>

        <p className="mt-4 text-sm">

          Already have account?

          <Link
            to="/login"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Register;
