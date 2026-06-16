import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(response.data);

      login(response.data.data.token);

      navigate("/dashboard");
    } catch (error) {
        console.log(error);
        console.log(error.response);

        alert(
          error.response?.data?.message ||
          error.message
        );
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 shadow rounded"
      >
        <h2 className="text-2xl font-bold mb-5">
          Asset Management Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border w-full p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border w-full p-2 mb-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;