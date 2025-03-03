import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate =  useNavigate()
  const dispatch = useDispatch()
  const {user} =  useSelector(store => store.auth)
  
  
  useEffect(()=>{
    if(user){
        navigate("/");
    }
    
},[])
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log("Login input", input);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message);
        navigate('/')
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center text-gray-500">
            Login to see photos and videos from your friends.
          </p>
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <div>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please wait
          </div>
        ):(
           <Button type="submit">Login</Button>
        )}
        <span className='text-center'>Doesn't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
      </form>
    </div>
  );
};

export default Login;
