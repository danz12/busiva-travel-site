import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import TourCard from './TourCard';
import { supabase } from '@/lib/supabase';
import { tours as fallbackTours } from '../data/siteData';

interface ToursProps {
  onInquire: (tour: Tour | null) => void;
}

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
  is_active: boolean | null;
  sort_order: number | null;
}

const Tours: React.FC<ToursProps> = ({ onInquire }) => {
  const initialFallbackTours = useMemo(() => {
    const mapFallbackTour = (tour: typeof fallbackTours[number]): Tour => ({
      id: String(tour.id),
      name: tour.name,
      location: tour.location,
      category: tour.category,
      duration: tour.duration,
      group_size: tour.groupSize,
      difficulty: tour.difficulty,
      price: tour.price,
      description: tour.description,
      image: tour.image,
      highlights: tour.highlights,
      is_active: true,
      sort_order: tour.id,
    });

    return fallbackTours.map(mapFallbackTour);
  }, []);

  const [tours, setTours] = useState<Tour[]>(initialFallbackTours);
  const [loading, setLoading] = useState(initialFallbackTours.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(initialFallbackTours.length > 0);
  const [searchQuery, setSearchQuery] = useState('');
  const defaultCategory = 'Historical';
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [hasSetDefaultCategory, setHasSetDefaultCategory] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      if (initialFallbackTours.length === 0) {
        setLoading(true);
      }
      setLoadError(null);

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        if (initialFallbackTours.length) {
          setTours(initialFallbackTours);
          setUsingFallback(true);
          setLoadError(null);
        } else {
          setLoadError(error.message);
        }
      } else {
        const nextTours = (data as Tour[]) || [];
        if (nextTours.length > 0) {
          setTours(nextTours);
          setUsingFallback(false);
        } else {
          if (initialFallbackTours.length) {
            setTours(initialFallbackTours);
            setUsingFallback(true);
          } else {
            setTours([]);
          }
        }
      }

      setLoading(false);
    };

    fetchTours();
  }, [initialFallbackTours]);

  const categories = useMemo(() => {
    const unique = new Set(tours.map((tour) => tour.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [tours]);

  const difficulties = useMemo(() => {
    const unique = new Set(tours.map((tour) => tour.difficulty).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [tours]);

  const normalizeCategory = (value: string) => value.trim().toLowerCase();

  const resolveDefaultCategory = React.useCallback(() => {
    const normalizedDefault = normalizeCategory(defaultCategory);
    const match = categories.find(
      (category) => normalizeCategory(category) === normalizedDefault
    );
    return match || 'All';
  }, [categories, defaultCategory]);

  useEffect(() => {
    if (hasSetDefaultCategory || categories.length <= 1) {
      return;
    }

    setSelectedCategory(resolveDefaultCategory());
    setHasSetDefaultCategory(true);
  }, [categories, hasSetDefaultCategory, resolveDefaultCategory]);

  const hasSelectedCategoryMatches = useMemo(() => {
    if (selectedCategory === 'All') {
      return true;
    }

    const normalizedSelected = normalizeCategory(selectedCategory);
    return tours.some(
      tour => normalizeCategory(tour.category || '') === normalizedSelected
    );
  }, [tours, selectedCategory]);

  useEffect(() => {
    if (loading || selectedCategory === 'All' || hasSelectedCategoryMatches) {
      return;
    }

    setSelectedCategory('All');
  }, [loading, selectedCategory, hasSelectedCategoryMatches]);

  const filteredTours = useMemo(() => {
    let result = [...tours];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        tour =>
          tour.name.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const normalizedSelected = normalizeCategory(selectedCategory);
      result = result.filter(
        tour => normalizeCategory(tour.category || '') === normalizedSelected
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      result = result.filter(tour => tour.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\D/g, ''));
          const priceB = parseInt(b.price.replace(/\D/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\D/g, ''));
          const priceB = parseInt(b.price.replace(/\D/g, ''));
          return priceB - priceA;
        });
        break;
      case 'duration':
        result.sort((a, b) => {
          const daysA = parseInt(a.duration);
          const daysB = parseInt(b.duration);
          return daysA - daysB;
        });
        break;
      default:
        // Featured - keep original order
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy, tours]);

  return (
    <section id="tours" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            Tours & Experiences
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Ethiopia's Treasures
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From ancient rock churches to dramatic landscapes, explore our carefully curated 
            collection of tours designed to showcase the best of Ethiopia.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours by name or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              {difficulties.slice(1).map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTours.length}</span> tours
            {usingFallback && <span className="text-gray-400"> (featured list)</span>}
          </p>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading tours...</h3>
            <p className="text-gray-600">Please wait while we fetch available tours.</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load tours</h3>
            <p className="text-gray-600">{loadError}</p>
          </div>
        ) : filteredTours.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} onInquire={onInquire} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(resolveDefaultCategory());
                setSelectedDifficulty('All');
              }}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-amber-100">
              We specialize in custom itineraries. Tell us your dream Ethiopia adventure!
            </p>
          </div>
          <button
            onClick={() => onInquire(null)}
            className="px-8 py-4 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition-colors whitespace-nowrap"
          >
            Request Custom Tour
          </button>
        </div>
      </div>
    </section>
  );
};

export default Tours;
