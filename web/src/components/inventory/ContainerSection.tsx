import React, { useState } from 'react';
import { Slot } from '../../typings';
import InventorySlot from './InventorySlot';

interface ContainerSectionProps {
  title: string;
  icon: string;
  weight: string;
  items: Slot[];
  isExpanded: boolean;
}

const ContainerSection: React.FC<ContainerSectionProps> = ({ 
  title, 
  icon, 
  weight, 
  items, 
  isExpanded: initialExpanded 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className="container-section">
      <div 
        className="container-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="container-title">
          <span className="container-icon">{icon}</span>
          <span className="container-name">{title}</span>
          <span className="expand-arrow" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
        <div className="container-weight">{weight}</div>
      </div>
      
      {isExpanded && (
        <div className="container-content">
          <div className="container-grid">
            {Array.from({ length: 20 }, (_, index) => {
              const item = items.find(item => item.slot === index + 1) || { slot: index + 1 };
              return (
                <InventorySlot
                  key={`container-${title}-${index + 1}`}
                  item={item}
                  inventoryType="container"
                  inventoryGroups={{}}
                  inventoryId={`container-${title.toLowerCase()}`}
                />
              );
            })}
          </div>
          
          {/* Container Weight Bar */}
          <div className="container-weight-bar">
            <div className="container-weight-fill" style={{ width: '2%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerSection;