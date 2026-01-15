import React from 'react';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';

interface Tour {
  id: string;
  name: string;
  location: string;
  category: string;
  duration: string;
  group_size: string;
  difficulty: string;
  price: string;
  description: string;
  image: string;
  highlights: string[] | null;
}

interface TourCardProps {
  tour: Tour;
  onInquire: (tour: Tour) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onInquire }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'moderate':
        return 'bg-amber-100 text-amber-700';
      case 'challenging':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'historical':
        return 'bg-purple-500';
      case 'nature':
        return 'bg-emerald-500';
      case 'cultural':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${getCategoryColor(tour.category)}`}>
          {tour.category}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-emerald-700 font-bold text-sm">{tour.price}</span>
        </div>

        {/* Location */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{tour.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {tour.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{tour.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users className="w-4 h-4" />
            <span>{tour.group_size} people</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tour.difficulty)}`}>
            {tour.difficulty}
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(tour.highlights || []).slice(0, 3).map((highlight, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onInquire(tour)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all group/btn"
        >
          Inquire Now
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TourCard;
