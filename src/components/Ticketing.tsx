import React from 'react';
import { Plane, Globe, Clock, Shield, CheckCircle, ArrowRight } from 'lucide-react';

interface TicketingProps {
  onOpenInquiry: () => void;
}

const Ticketing: React.FC<TicketingProps> = ({ onOpenInquiry }) => {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Worldwide Coverage",
      description: "Access to all major airlines and routes globally"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Best Price Guarantee",
      description: "Competitive rates with no hidden fees"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all bookings"
    }
  ];

  const airlines = [
    "Ethiopian Airlines",
    "Emirates",
    "Turkish Airlines",
    "Qatar Airways",
    "Kenya Airways",
    "EgyptAir"
  ];

  return (
    <section id="ticketing" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      {/* Airplane Path SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 1200 600">
        <path
          d="M0,300 Q300,100 600,300 T1200,300"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="10,10"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1 bg-white/10 text-blue-200 rounded-full text-sm font-semibold mb-4">
              Flight Ticketing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Seamless Flight Bookings for Every Journey
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Whether you're traveling domestically within Ethiopia or flying internationally, 
              our expert team ensures you get the best routes and rates for your journey.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-amber-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onOpenInquiry}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
            >
              Request Flight Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Content - Service Cards */}
          <div className="space-y-6">
            {/* Domestic Flights Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Plane className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Domestic Flights</h3>
                  <p className="text-blue-200 text-sm">Within Ethiopia</p>
                </div>
              </div>
              <ul className="space-y-2">
                {['Addis Ababa to Lalibela', 'Addis Ababa to Axum', 'Addis Ababa to Bahir Dar', 'Addis Ababa to Gondar'].map((route, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-blue-100">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {route}
                  </li>
                ))}
              </ul>
            </div>

            {/* International Flights Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">International Flights</h3>
                  <p className="text-blue-200 text-sm">Worldwide destinations</p>
                </div>
              </div>
              <p className="text-blue-100 mb-4">Partner airlines include:</p>
              <div className="flex flex-wrap gap-2">
                {airlines.map((airline, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                    {airline}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-blue-200 text-sm">Airlines</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">200+</p>
                <p className="text-blue-200 text-sm">Destinations</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-blue-200 text-sm">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ticketing;
