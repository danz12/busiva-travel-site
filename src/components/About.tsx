import React from 'react';
import { CheckCircle, Award, Users, Globe, Heart } from 'lucide-react';
import { companyInfo, heroImages } from '../data/siteData';

const About: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Licensed & Certified",
      description: "Fully licensed tour operator registered with Ethiopian Tourism Organization"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Local Guides",
      description: "Passionate, multilingual guides with deep knowledge of Ethiopian heritage"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Nationwide Coverage",
      description: "Operating across all regions of Ethiopia with established local networks"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personalized Service",
      description: "Every itinerary tailored to your interests, pace, and preferences"
    }
  ];

  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Travelers" },
    { value: "50+", label: "Tour Packages" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Trusted Ethiopian Travel Partner
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Locally owned and operated in Addis Ababa, we bring authentic Ethiopian experiences 
            to travelers from around the world with professionalism and passion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Crafting Ethiopian Journeys Since 2014
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {companyInfo.name} is based in Addis Ababa and designs tailored trips that blend 
              local expertise with international service standards for authentic, seamless travel.
            </p>

            {/* Checklist */}
            <div className="space-y-3 mb-8">
              {[
                "Customized itineraries for every travel style",
                "Competitive pricing with no hidden fees",
                "Sustainable and responsible tourism practices",
                "Emergency support throughout your journey"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 shadow-lg">
                <img
                  src={heroImages.main}
                  alt="Ethiopian landscape"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
              </div>
            </div>
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Promise to You</h3>
          <p className="text-emerald-100 text-lg max-w-3xl mx-auto leading-relaxed">
            "We create immersive journeys that respect local communities and leave you with 
            lasting memories of Ethiopia."
          </p>
          <p className="text-amber-400 font-semibold mt-4">- The Busiva Team</p>
        </div>
      </div>
    </section>
  );
};

export default About;
