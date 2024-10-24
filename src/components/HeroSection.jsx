import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center gap-5 py-8 md:py-12 lg:py-16">
                    {/* Badge */}
                    <span className="px-4 py-2 text-sm md:text-base rounded-full bg-gray-100 text-[#F83002] font-medium">
                        No. 1 Job Hunt Website
                    </span>

                    {/* Heading */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                        Search, Apply & <br className="md:hidden" /> Get Your{" "}
                        <span className="text-[#6A38C2]">Dream Jobs</span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 max-w-xl text-center px-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!
                    </p>

                    {/* Search Bar */}
                    <div className="flex w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl 
                                  shadow-lg border border-gray-200 pl-3 rounded-full items-center 
                                  gap-2 md:gap-4">
                        <input
                            type="text"
                            placeholder="Find your dream jobs"
                            onChange={(e) => setQuery(e.target.value)}
                            className="outline-none border-none w-full text-sm md:text-base py-2"
                        />
                        <Button 
                            onClick={searchJobHandler} 
                            className="rounded-r-full bg-[#6A38C2] px-3 md:px-4"
                        >
                            <Search className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;