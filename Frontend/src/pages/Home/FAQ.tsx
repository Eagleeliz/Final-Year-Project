import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Brand Colors
  const midnightTeal = "#002e33";
  const aquaAccent = "#f0fdfa"; // Very light teal for active state

  const faqs = [
    {
      question: "Is my personal health data safe and private?",
      answer: "Absolutely. We use hospital-grade encryption and secure AI processing to ensure your data is never shared. Your journey is private, secure, and protected under strict data privacy standards."
    },
    {
      question: "How does the AI assistant help me specifically?",
      answer: "Our AI is trained on clinical maternal health guidelines. It can help you understand trimester symptoms, track baby growth, and identify 'danger signs' that require immediate medical attention."
    },
    {
      question: "Can I use this app instead of seeing a doctor?",
      answer: "No. This platform is a supportive companion designed to empower you with information. It does not replace professional medical advice or treatment from a qualified healthcare provider."
    },
    {
      question: "Is this service available for mothers in rural areas?",
      answer: "Yes! We have optimized the platform to work efficiently on low-bandwidth networks, ensuring mothers across Kenya can access vital health guidance regardless of their location."
    },
    {
      question: "How do I start tracking my pregnancy milestones?",
      answer: "Simply register and enter your last menstrual period (LMP) or expected due date. Our system will immediately calibrate to your specific week and start providing tailored insights."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: midnightTeal }}>
            Frequently Asked Questions
          </h2>
          <div className="h-1.5 w-20 bg-teal-900 mx-auto rounded-full"></div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border rounded-2xl transition-all duration-300 overflow-hidden"
                style={{ 
                  borderColor: isOpen ? midnightTeal : 'transparent',
                  backgroundColor: isOpen ? aquaAccent : '#e5e7eb'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  {/* Question text in Midnight Teal */}
                  <span 
                    className="text-xl font-bold leading-tight" 
                    style={{ color: midnightTeal }}
                  >
                    {faq.question}
                  </span>
                  
                  <div style={{ color: midnightTeal }}>
                    {isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                  </div>
                </button>

                {/* Animated Answer Section */}
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;