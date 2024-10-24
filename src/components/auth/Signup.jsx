import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        profilePicture: "https://example.com/default-avatar.jpg"
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!input.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!input.email.trim()) newErrors.email = "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(input.email)) newErrors.email = "Invalid email format";
        if (!input.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!/^\d{10}$/.test(input.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
        if (!input.password) newErrors.password = "Password is required";
        if (input.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!input.role) newErrors.role = "Please select a role";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            setLoading(true);
            
            const response = await axios.post('https://job-backend-8olc.onrender.com/api/auth/signup', input);

            if (response.data) {
                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(response.data));
                
                toast.success("Signup successful!");

                // Navigate based on role
                if (input.role === 'recruiter') {
                    navigate('/recruiter-dashboard');
                } else if (input.role === 'student') {
                    navigate('/student-dashboard');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <form onSubmit={submitHandler} 
                      className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-900">Sign Up</h1>
                    
                    <div className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium">Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullName}
                                name="fullName"
                                onChange={changeEventHandler}
                                placeholder="John Doe"
                                className={`mt-1 block w-full ${errors.fullName ? 'border-red-500' : ''}`}
                            />
                            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName}</span>}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium">Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="you@example.com"
                                className={`mt-1 block w-full ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium">Phone Number</Label>
                            <Input
                                type="tel"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="1234567890"
                                className={`mt-1 block w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.phoneNumber && <span className="text-xs text-red-500">{errors.phoneNumber}</span>}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium">Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="••••••••"
                                className={`mt-1 block w-full ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                        </div>

                        <div className="space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0">
                            <RadioGroup className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label>Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label>Recruiter</Label>
                                </div>
                            </RadioGroup>
                            {errors.role && <span className="text-xs text-red-500 block">{errors.role}</span>}
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;