"use client";
import React, { useState,useContext, useEffect } from "react";
import axios from "axios";
import { MyContext } from "@/context/context";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); 
  const context = useContext(MyContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null); 

    try {
      const response = await axios.post("/api/user/login", { email, password });
      
      if (response.data.success) {
        context.customToast(response.data)
        setSuccess(true); 
        context?.setUser(response.data.data);
        if(response.data.data.role === 'guest'){
          router.push("/guest"); 
        }else if(response.data.data.role === 'user'){
          router.push("/portal");
        }else if(response.data.data.role === 'admin'){
          router.push("/admin");
        }
        
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      context.customToast(err.response.data)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context.user) {
      context.customToast({success:false, message:'Already Logged In!'});
      router.replace("/");
    }
  }, [context.user]);

  return (
    <div className="bg-green-200 min-w-screen min-h-screen flex justify-center items-center">
      <div className="min-h-[80vh] flex flex-col gap-16">
        {/* Header Section */}
        <div
          className="flex flex-col justify-center items-center gap-8 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <p className="text-xl font-semibold text-stone-700">
            DIU Computer Programming Club
          </p>
          <div className="logo flex gap-5">
            <img
              className="w-[130px]"
              src="https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png"
              width={100}
              alt="Logo 1"
            />
            <img
              className="w-[130px]"
              src="https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png"
              width={100}
              alt="Logo 2"
            />
          </div>
        </div>

        {/* Login Section */}
        <div className="min-w-[600px] text-center text-black flex flex-col justify-center items-center bg-green-400 p-5 rounded-md gap-5">
          <b className="text-xl font-mono">Login</b>
          <form
            className="text-xs flex flex-col items-center gap-3"
            onSubmit={handleLogin}
          >
            <div className="grid gap-3">
              {/* Email Input */}
              <input
                type="text"
                className="w-[350px] py-1 px-2 rounded-sm"
                placeholder="Email"
                title="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* Password Input */}
              <input
                type="password"
                className="w-[350px] py-1 px-2 rounded-sm"
                placeholder="Password"
                title="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-700 text-sm py-1 px-3 w-max text-white rounded-md mt-8"
              title="Log In"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
