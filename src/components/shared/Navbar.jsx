import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className='bg-white shadow-sm'>
            <div className='relative px-4 mx-auto max-w-7xl'>
                <div className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <div>
                        <h1 className='text-xl md:text-2xl font-bold'>
                            Job<span className='text-[#F83002]'>Portal</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8'>
                        <ul className='flex font-medium items-center gap-5'>
                            {user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )}
                        </ul>

                        {/* Desktop Auth Buttons */}
                        {!user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className="text-sm">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-sm">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer h-8 w-8">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 md:w-80">
                                    <div>
                                        <div className='flex gap-2 items-start'>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col mt-4 text-gray-600'>
                                            {user && user.role === 'student' && (
                                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                    <User2 size={18} />
                                                    <Button variant="link" className="p-0">
                                                        <Link to="/profile">View Profile</Link>
                                                    </Button>
                                                </div>
                                            )}
                                            <div className='flex w-fit items-center gap-2 cursor-pointer mt-2'>
                                                <LogOut size={18} />
                                                <Button onClick={logoutHandler} variant="link" className="p-0">
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className='md:hidden p-2 text-gray-600'
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className='md:hidden absolute top-16 left-0 right-0 bg-white border-t py-4 px-4 shadow-lg'>
                        <ul className='space-y-4 mb-4'>
                            {user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" onClick={toggleMenu}>Companies</Link></li>
                                    <li><Link to="/admin/jobs" onClick={toggleMenu}>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                                    <li><Link to="/jobs" onClick={toggleMenu}>Jobs</Link></li>
                                    <li><Link to="/browse" onClick={toggleMenu}>Browse</Link></li>
                                </>
                            )}
                        </ul>

                        {!user ? (
                            <div className='flex flex-col gap-2'>
                                <Link to="/login" onClick={toggleMenu}>
                                    <Button variant="outline" className="w-full">Login</Button>
                                </Link>
                                <Link to="/signup" onClick={toggleMenu}>
                                    <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-3 pt-4 border-t'>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="Profile" />
                                </Avatar>
                                <div>
                                    <h4 className='font-medium'>{user?.fullname}</h4>
                                    <div className='flex gap-4 mt-1'>
                                        {user.role === 'student' && (
                                            <Link to="/profile" onClick={toggleMenu}>
                                                <Button variant="link" className="p-0 h-auto">
                                                    Profile
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            onClick={() => {
                                                logoutHandler();
                                                toggleMenu();
                                            }}
                                            variant="link"
                                            className="p-0 h-auto text-red-600"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar