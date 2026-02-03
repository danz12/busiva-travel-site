import React from 'react';
import { Play, Star, Shield, Clock } from 'lucide-react';
import { companyInfo, heroImages, trustBadges } from '../data/siteData';

interface HeroProps {
  onOpenInquiry: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImages.main}
          alt="Lake Tana, Ethiopia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/45 to-gray-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
              Extraordinary Ethiopia
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
            Experience the cradle of humanity with Ethiopia's most trusted travel partner. 
            From ancient rock churches to dramatic landscapes, we craft unforgettable journeys 
            tailored to your dreams.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={onOpenInquiry}
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              Request a Quote
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => scrollToSection('#tours')}
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Explore Tours
            </button>
          </div>

          <div className="flex items-center gap-3 text-white/90 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.18l-2.2 1.1a11.04 11.04 0 005.52 5.52l1.1-2.2a1 1 0 011.18-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/70">Call us now</p>
              <a
                href={`tel:${companyInfo.phoneE164}`}
                className="text-lg font-semibold text-white hover:text-amber-300 transition-colors"
              >
                {companyInfo.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  {badge.icon === 'star' && <Star className="w-5 h-5 text-amber-400" />}
                  {badge.icon === 'clock' && <Clock className="w-5 h-5 text-emerald-400" />}
                  {badge.icon === 'users' && (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {badge.icon === 'award' && <Shield className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <p className="text-white font-bold">{badge.label}</p>
                  <p className="text-gray-300 text-sm">{badge.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('#about')}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
