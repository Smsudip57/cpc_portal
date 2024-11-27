"use client";

import React, { createContext, useState, useEffect,useRef, } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

export const MyContext = createContext(); 

export const ThemeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false); 
  const router = useRouter();


  const customToast = (value) => {
    if(value.success){
      toast.success(value.message);
    }else{
      toast.error(value.message);
    }
  }


  useEffect(() => {
    if (fetchedOnce.current) return; 
    fetchedOnce.current = true;
    let response
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/findnvalidateuser", {
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.data); 
          customToast(response.data); // Show success toast
        } else {
          setUser(null); // Set null if user is not valid

          if(window.location.href.includes("/admin") || window.location.href.includes("/guest") || window.location.href.includes("/portal") ){
            router.push("/login");
          }
        }
      } catch (err) {
        customToast(err.response.data)
        setError(err.message); 
        setUser(null); 
        if(window.location.href.includes("/admin") || window.location.href.includes("/guest") || window.location.href.includes("/portal") ){
          router.push("/login");
        }
      } finally {
        setLoading(false); 
      }
    };

    if(!user || user.length === 0){
    fetchUserData();
  }
  }, [])
  

  return (
    <MyContext.Provider value={{ user, setUser, loading, error, customToast }}>
      {children}
    </MyContext.Provider>
  );
};
