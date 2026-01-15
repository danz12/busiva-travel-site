import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Tours from './Tours';
import Ticketing from './Ticketing';
import Corporate from './Corporate';
import Testimonials from './Testimonials';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import InquiryModal from './InquiryModal';

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
}

const AppLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'tour' | 'ticketing' | 'corporate'>('tour');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const handleOpenTourInquiry = (tour: Tour | null) => {
    setSelectedTour(tour);
    setModalType('tour');
    setIsModalOpen(true);
  };

  const handleOpenTicketingInquiry = () => {
    setSelectedTour(null);
    setModalType('ticketing');
    setIsModalOpen(true);
  };

  const handleOpenCorporateInquiry = () => {
    setSelectedTour(null);
    setModalType('corporate');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onOpenInquiry={() => handleOpenTourInquiry(null)} />

        {/* About Section */}
        <About />

        {/* Services Overview */}
        <Services 
          onOpenTicketing={handleOpenTicketingInquiry}
          onOpenCorporate={handleOpenCorporateInquiry}
        />

        {/* Tours Section */}
        <Tours onInquire={handleOpenTourInquiry} />

        {/* Ticketing Section */}
        <Ticketing onOpenInquiry={handleOpenTicketingInquiry} />

        {/* Corporate Section */}
        <Corporate onOpenInquiry={handleOpenCorporateInquiry} />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <Faq />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedTour={selectedTour}
        type={modalType}
      />
    </div>
  );
};

export default AppLayout;
