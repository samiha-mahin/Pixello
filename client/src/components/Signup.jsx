import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import axios from 'axios'

const Signup = () => {

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({...input, [e.target.name]: e.target.value })
    };

    const signupHandler = async (e) => {
        e.preventDefault();
       try {
        setLoading(true);
        const res = await axios.post(`${USER_API}/register`, input, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        if (res.data.success) {
            navigate("/login");
            toast.success(res.data.message);
            setInput({
                username: "",
                email: "",
                password: ""
            });
        }
       } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Signup failed");
       } finally {
        setLoading(false);
       }
    }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <form 
        onSubmit={signupHandler} 
        className='w-full max-w-md bg-white p-6 rounded-xl shadow-md flex flex-col gap-5'
      >
        <div className='text-center mb-4'>
            <h1 className='font-bold text-2xl'>LOGO</h1>
            <p className='text-sm text-gray-500 mt-1'>Signup to see photos & videos from your friends</p>
        </div>

        <div>
            <label className='font-medium text-sm text-gray-700'>Username</label>
            <Input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent mt-1"
            />
        </div>

        <div>
            <label className='font-medium text-sm text-gray-700'>Email</label>
            <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent mt-1"
            />
        </div>

        <div>
            <label className='font-medium text-sm text-gray-700'>Password</label>
            <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent mt-1"
            />
        </div>

        {loading ? (
            <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
            </Button>
        ) : (
            <Button type='submit' className='w-full'>Signup</Button>
        )}

        <span className='text-center text-sm text-gray-600'>
            Already have an account? <Link to="/login" className='text-blue-600'>Login</Link>
        </span>
      </form>
    </div>
  )
}

export default Signup
