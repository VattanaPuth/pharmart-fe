import React from 'react';
import { Search, ShieldCheck, Truck } from 'lucide-react';


const STEPS = [
  {
    id: '01',
    title: 'Search & Browse',
    description: 'Find medicines and health products from verified pharmacies near you using our smart search.',
    Icon: Search,
    colorClass: 'bg-pink-50 text-pink-400',
  },
  {
    id: '02',
    title: 'Order & Pay',
    description: 'Add items to cart, choose pickup or delivery, and complete payment securely.',
    Icon: ShieldCheck,
    colorClass: 'bg-pink-50 text-pink-500',
  },
  {
    id: '03',
    title: 'Receive Your Order',
    description: 'Pick up at the pharmacy or arrange delivery. Track your order every step of the way.',
    Icon: Truck,
    colorClass: 'bg-pink-50 text-pink-500',
  },
];

const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">How PharmaMarket Works</h2>
        <p className="text-slate-400 max-w-md mx-auto">Simple, safe, and secure ordering in 3 steps</p>
      </div>

      {/* Steps Grid */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
        
        {/* Subtle connecting line for Desktop */}
        <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-slate-100 z-0" />

        {STEPS.map((step) => (
          <div key={step.id} className="flex-1 flex flex-col items-center text-center relative z-10">
            {/* Step Icon Container */}
            <div className={`w-20 h-20 rounded-3xl ${step.colorClass} flex items-center justify-center mb-6 shadow-sm`}>
              <step.Icon size={32} />
            </div>

            {/* Step Identifier */}
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300 uppercase mb-2">
              Step {step.id}
            </span>

            {/* Text Content */}
            <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-70">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;