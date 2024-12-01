"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { MyContext } from "@/context/context";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    batch: "",
    department: "",
    role: "guest",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    context.setLogin(true);

    try {
      const response = await axios.post("/api/user/registeruser", formData);
      if (response.data.success) {
        context.customToast(response.data);
        context?.setUser(response.data.data);

        switch (response.data.data.role) {
          case "guest":
            router.push("/guest");
            break;
          case "user":
            router.push("/portal");
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            break;
        }
      } else {
        context.customToast(response.data);
      }
    } catch (err) {
      context.customToast(err.response?.data || { success: false, message: "Registration failed." });
    } finally {
      setLoading(false);
      setTimeout(() => {
        context.setLogin(false);
      }, 5000);
    }
  };

  return (
    <div className="bg-green-200 w-full rounded-md flex justify-center items-center">
      <div className="min-h-[80vh] justify-center flex flex-col gap-16">
        <div className="min-w-[600px] text-center text-black flex flex-col justify-center items-center bg-green-400 p-5 rounded-md gap-5">
          <b className="text-xl font-mono">Create User</b>
          <form
            className="text-xs flex flex-col items-center gap-3"
            onSubmit={handleRegister}
          >
            <div className="grid gap-3">
              <input
                type="text"
                className="w-[350px] py-1 px-2 rounded-sm"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="w-[350px] flex justify-between">
                <input
                  type="text"
                  className="w-[30%] py-1 px-2 rounded-sm"
                  placeholder="Roll"
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="w-[30%] py-1 px-2 rounded-sm"
                  placeholder="Batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  className="w-[30%] py-1 px-2 rounded-sm"
                  placeholder="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <select
                className="w-[350px] py-1 px-2 rounded-sm"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="guest">Guest</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              <input
                type="email"
                className="w-[350px] py-1 px-2 rounded-sm"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                className="w-[350px] py-1 px-2 rounded-sm"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-sm py-1 px-3 w-max text-white rounded-md mt-4"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
