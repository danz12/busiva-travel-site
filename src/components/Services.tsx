import React from 'react';
import { Compass, Plane, Briefcase, ChevronRight, Check } from 'lucide-react';
import { services } from '../data/siteData';

interface ServicesProps {
  onOpenTicketing: () => void;
  onOpenCorporate: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenTicketing, onOpenCorporate }) => {
  const scrollToTours = () => {
    const element = document.querySelector('#tours');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'compass':
        return <Compass className="w-8 h-8" />;
      case 'plane':
        return <Plane className="w-8 h-8" />;
      case 'briefcase':
        return <Briefcase className="w-8 h-8" />;
      default:
        return <Compass className="w-8 h-8" />;
    }
  };

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
      case 'tours':
        scrollToTours();
        break;
      case 'ticketing':
        onOpenTicketing();
        break;
      case 'corporate':
        onOpenCorporate();
        break;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Travel Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From adventure tours to corporate travel management, we provide comprehensive 
            services to meet all your travel needs in Ethiopia and beyond.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full" />
              
              {/* Icon */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                {getIcon(service.icon)}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleServiceClick(service.id)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all group/btn"
              >
                {service.id === 'tours' ? 'View Tours' : 'Inquire Now'}
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
