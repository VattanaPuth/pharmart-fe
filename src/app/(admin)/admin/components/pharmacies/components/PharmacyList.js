'use client';

import PharmacyCard from './PharmacyCard';

export default function PharmacyList({ pharmacies, onStatusChange }) {
  return (
    <div className="space-y-8">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard 
          key={pharmacy.id} 
          pharmacy={pharmacy} 
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}