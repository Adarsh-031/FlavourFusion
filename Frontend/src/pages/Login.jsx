import React, { useState } from "react";
import { login, register } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const resp = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register(form);

      if (resp.error) {
        toast.error(resp.error);
        return;
      }

      if (resp.token) {
        // Save token and user
        localStorage.setItem("token", resp.token);
        setUser(resp.user);

        toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-orange-600 text-center mt-3 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "New here? Register" : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
