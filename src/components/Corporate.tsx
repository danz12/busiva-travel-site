import React from 'react';
import { Briefcase, Users, Building2, CreditCard, FileText, HeadphonesIcon, ArrowRight, CheckCircle } from 'lucide-react';

interface CorporateProps {
  onOpenInquiry: () => void;
}

const Corporate: React.FC<CorporateProps> = ({ onOpenInquiry }) => {
  const benefits = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Corporate Accounts",
      description: "Streamlined billing and dedicated account management for your organization"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Travel Policy Integration",
      description: "We align with your company's travel policies and approval workflows"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Group Travel",
      description: "Efficient coordination for conferences, retreats, and team events"
    },
    {
      icon: <HeadphonesIcon className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Priority 24/7 assistance with a dedicated account manager"
    }
  ];

  const services = [
    "Executive Travel Arrangements",
    "Conference & Event Logistics",
    "Airport Meet & Greet Services",
    "Hotel Negotiations & Bookings",
    "Ground Transportation Fleet",
    "Travel Expense Reporting",
    "Emergency Travel Support",
    "Multi-destination Itineraries"
  ];

  const clients = [
    "NGOs & International Organizations",
    "Embassies & Government Agencies",
    "Corporate Enterprises",
    "Educational Institutions",
    "Healthcare Organizations",
    "Media & Production Companies"
  ];

  return (
    <section id="corporate" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            Corporate Travel
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Business Travel Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive travel management for businesses, NGOs, and institutions. 
            We handle the logistics so you can focus on what matters most.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Benefits Grid */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Busiva for Corporate Travel?</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onOpenInquiry}
              className="mt-8 group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg"
            >
              Open Corporate Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right - Services & Clients */}
          <div className="space-y-8">
            {/* Services List */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Corporate Services</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Types */}
            <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-200" />
                </div>
                <h3 className="text-xl font-bold">We Serve</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {clients.map((client, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <span className="text-emerald-100">{client}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-gray-100">
                <p className="text-2xl font-bold text-emerald-700">100+</p>
                <p className="text-gray-600 text-sm">Corporate Clients</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-gray-100">
                <p className="text-2xl font-bold text-emerald-700">15%</p>
                <p className="text-gray-600 text-sm">Avg. Savings</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-gray-100">
                <p className="text-2xl font-bold text-emerald-700">98%</p>
                <p className="text-gray-600 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Corporate;
