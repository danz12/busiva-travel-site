import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabaseAnonKey, supabaseUrl } from '@/lib/supabase';

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTour: Tour | null;
  type: 'tour' | 'ticketing' | 'corporate';
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, selectedTour, type }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const modalRef = useRef<HTMLDivElement | null>(null);

  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const focusables = getFocusableElements();
    const focusTarget = focusables[0] || modalRef.current;
    focusTarget?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = getFocusableElements();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !modalRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const typeLabel = type === 'tour' ? 'Tour Inquiry' : type === 'ticketing' ? 'Flight Inquiry' : 'Corporate Inquiry';
      const subject = `Busiva ${typeLabel}${selectedTour?.name ? ` - ${selectedTour.name}` : ''}`;

      const response = await fetch(`${supabaseUrl}/functions/v1/submit-inquiry`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject,
          message: formData.message || '',
          inquiry_type: type,
          tour_name: selectedTour?.name || null
        })
      });

      const responseText = await response.text();
      let responseJson: { error?: string } | null = null;
      try {
        responseJson = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseJson = null;
      }
      if (!response.ok) {
        throw new Error(responseJson?.error || 'Failed to send inquiry. Please try again.');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title = type === 'tour' ? (selectedTour ? `Inquire: ${selectedTour.name}` : 'Custom Tour') : type === 'ticketing' ? 'Flight Inquiry' : 'Corporate Inquiry';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 id="inquiry-modal-title" className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Submission Failed</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Submitted!</h3>
              <p className="text-gray-600">We'll contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedTour && (
                <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">{selectedTour.name}</span>
                </div>
              )}
              <input type="text" required placeholder="Your Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="email" required placeholder="Email *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border rounded-lg" />
              <textarea placeholder="Message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="w-full px-4 py-3 border rounded-lg resize-none" />
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
                {isSubmitting ? 'Sending...' : <><Send className="w-4 h-4" /> Submit</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
