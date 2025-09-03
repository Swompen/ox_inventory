import React, { useState } from 'react';
import { useAppSelector } from '../../store';
import { selectLeftInventory, selectRightInventory } from '../../store/inventory';
import InventorySlot from './InventorySlot';
import { Locale } from '../../store/locale';
import { fetchNui } from '../../utils/fetchNui';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { useDrop } from 'react-dnd';
import { DragSource } from '../../typings';
import { isSlotWithItem } from '../../helpers';
import ContainerSection from './ContainerSection';

const ModernInventoryLayout: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const rightInventory = useAppSelector(selectRightInventory);
  const [selectedAmount, setSelectedAmount] = useState(1);

  // Container items that should appear in the sidebar
  const containerItems = leftInventory.items.filter(item => 
    isSlotWithItem(item) && (
      item.name === 'paperbag' || 
      item.name === 'wallet' || 
      item.name === 'laptop' || 
      item.name === 'phone' ||
      item.metadata?.container
    )
  );

  const [, useDropRef] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onUse(source.item);
    },
  }));

  const [, giveDropRef] = useDrop<DragSource, void, any>(() => ({
    accept: 'SLOT',
    drop: (source) => {
      source.inventory === 'player' && onGive(source.item);
    },
  }));

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.floor(event.target.valueAsNumber || 0));
    setSelectedAmount(value);
  };

  return (
    <div className="modern-inventory-wrapper">
      {/* Left Sidebar - Container Items */}
      <div className="inventory-sidebar">
        {containerItems.map((item) => (
          <div key={`sidebar-${item.slot}`} className="sidebar-item">
            <InventorySlot
              item={item}
              inventoryType={leftInventory.type}
              inventoryGroups={leftInventory.groups}
              inventoryId={leftInventory.id}
            />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="inventory-main-content">
        {/* Player Info Header */}
        <div className="player-info-header">
          <div className="player-name">
            <span className="player-icon">👤</span>
            {leftInventory.label}
          </div>
          <div className="weight-display">
            {Math.floor((leftInventory.weight || 0) / 10) / 100} / {(leftInventory.maxWeight || 0) / 1000} KG
          </div>
        </div>

        {/* Main Inventory Grid */}
        <div className="main-inventory-container">
          <div className="inventory-grid-modern">
            {leftInventory.items.slice(0, 50).map((item, index) => (
              <InventorySlot
                key={`main-${item.slot}`}
                item={item}
                inventoryType={leftInventory.type}
                inventoryGroups={leftInventory.groups}
                inventoryId={leftInventory.id}
              />
            ))}
          </div>

          {/* Weight Bar */}
          <div className="modern-weight-bar">
            <div 
              className="weight-fill"
              style={{ 
                width: `${leftInventory.maxWeight ? ((leftInventory.weight || 0) / leftInventory.maxWeight) * 100 : 0}%` 
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <input
            type="number"
            value={selectedAmount}
            onChange={handleAmountChange}
            className="amount-input"
            min="0"
            placeholder="0"
          />
          <button className="action-button use-button" ref={useDropRef}>
            {Locale.ui_use || 'USE'}
          </button>
          <button className="action-button give-button" ref={giveDropRef}>
            {Locale.ui_give || 'GIVE'}
          </button>
          <button className="action-button close-button" onClick={() => fetchNui('exit')}>
            {Locale.ui_close || 'CLOSE'}
          </button>
        </div>
      </div>

      {/* Right Side - Container Sections */}
      <div className="container-sections">
        <ContainerSection 
          title="WALLET" 
          icon="💳"
          weight="0.00 / 50 KG"
          items={rightInventory.type === 'container' ? rightInventory.items : []}
          isExpanded={true}
        />
        <ContainerSection 
          title="LAPTOP" 
          icon="💻"
          weight="0.00 / 50 KG"
          items={[]}
          isExpanded={false}
        />
        <ContainerSection 
          title="PHONE" 
          icon="📱"
          weight="0.01 / 50 KG"
          items={rightInventory.type === 'container' && rightInventory.id.includes('phone') ? rightInventory.items : []}
          isExpanded={false}
        />
      </div>
    </div>
  );
};

export default ModernInventoryLayout;