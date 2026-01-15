import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '../data/siteData';

const Faq: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Answers for Confident Planning
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Clear guidance on bookings, custom itineraries, and what to expect on the ground.
            </p>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">
                Our team replies fast by WhatsApp and email, and we can schedule a quick call.
              </p>
              <button
                onClick={() => scrollToSection('#contact')}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left text-base md:text-lg text-gray-900">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
