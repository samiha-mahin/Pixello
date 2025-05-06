import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { USER_API } from '@/utils/constant' // Make sure this is defined properly
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                toast.success(res.data.message);
                navigate("/");
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
            <form 
                onSubmit={loginHandler} 
                className='w-full max-w-md bg-white p-6 rounded-xl shadow-md flex flex-col gap-5'
            >
                <div className='text-center mb-4'>
                    <h1 className='font-bold text-2xl'>LOGO</h1>
                    <p className='text-sm text-gray-500 mt-1'>Login to see photos & videos from your friends</p>
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
                    <Button type='submit' className='w-full'>Login</Button>
                )}

                <span className='text-center text-sm text-gray-600'>
                    Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link>
                </span>
            </form>
        </div>
    )
}

export default Login
