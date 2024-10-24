import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Carousel className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto my-8 sm:my-12 lg:my-20">
        <CarouselContent className="-ml-2 md:-ml-4">
          {category.map((cat, index) => (
            <CarouselItem 
              key={index}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Button 
                  onClick={() => searchJobHandler(cat)} 
                  variant="outline" 
                  className="w-full rounded-full text-sm sm:text-base py-2 px-4 whitespace-normal h-auto min-h-[40px] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="left-0 -translate-x-full" />
          <CarouselNext className="right-0 translate-x-full" />
        </div>
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;