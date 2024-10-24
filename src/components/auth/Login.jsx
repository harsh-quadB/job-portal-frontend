import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.email || !input.password || !input.role) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('https://job-backend-8olc.onrender.com/api/auth/login', {
                email: input.email,
                password: input.password,
                role: input.role // Send role to backend
            });

            if (res.data.status === 'success') {
                // Store the token in localStorage
                localStorage.setItem('token', res.data.token);
                
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    ...res.data.user,
                    role: input.role // Ensure role is stored with user data
                }));
                
                // Navigate based on role
                if (input.role === 'recruiter') {
                    navigate('/recruiter-dashboard');
                } else if (input.role === 'student') {
                    navigate('/student-dashboard');
                }
                
                toast.success('Login successful');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred during login';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <form onSubmit={submitHandler} className='w-full md:w-1/2 border border-gray-200 rounded-md p-6 my-10 bg-white shadow-sm'>
                    <h1 className='font-bold text-2xl mb-6'>Login</h1>
                    
                    <div className='space-y-4'>
                        <div>
                            <Label className="block mb-2">Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="Enter your email"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <Label className="block mb-2">Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter your password"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <RadioGroup className="flex flex-wrap items-center gap-4 my-5">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full my-4 h-11"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </>
                        ) : 'Login'}
                    </Button>

                    <p className='text-sm text-center'>
                        Don't have an account? {' '}
                        <Link to="/signup" className='text-blue-600 hover:text-blue-700 font-medium'>
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
