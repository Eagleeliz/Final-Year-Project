
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

const Services = () => {
  // Brand Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const services = [
    {
      title: "Trimester Tracking",
      description: "Receive personalized health milestones and baby growth updates tailored exactly to your current week.",
      icon: <Activity size={32} />,
    },
    {
      title: "24/7 AI Companion",
      description: "Get instant, secure answers to your pregnancy questions. Our AI is trained for localized health guidance.",
      icon: <MessageCircle size={32} />,
    },
    {
      title: "Emergency Detection",
      description: "AI-driven screening for 'danger signs' like pre-eclampsia, providing immediate alerts on when to seek care.",
      icon: <ShieldCheck size={32} />,
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: midnightTeal }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
            Comprehensive Care for Every Stage
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: aquaText }}>
            Combining medical expertise with advanced AI to ensure a safer journey for mothers across Kenya.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#ffffff08] p-10 rounded-3xl border border-[#ffffff15] hover:bg-[#ffffff12] transition-all duration-300 group hover:-translate-y-2 shadow-2xl"
            >
              {/* Icon Container */}
              <div className="mb-6 inline-block p-4 rounded-2xl bg-[#ffffff10] group-hover:bg-teal-500 transition-colors duration-300">
                <div style={{ color: aquaText }} className="group-hover:text-white">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                {service.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed text-md">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* High-Visibility Button Section */}
        <div className="mt-20 flex justify-center">
          <Link 
            to="/about" 
            className="group px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
            style={{ 
              backgroundColor: aquaText, 
              color: midnightTeal,
              boxShadow: `0 10px 25px -5px rgba(134, 217, 225, 0.4)` 
            }}
          >
            Learn More About Us
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Optional Decorative Line */}
        <div className="mt-16 flex justify-center">
          <div className="h-1 w-24 rounded-full opacity-10" style={{ backgroundColor: aquaText }}></div>
        </div>
      </div>
    </section>
  );
};

export default Services;