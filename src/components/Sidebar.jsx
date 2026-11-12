import React from 'react';
import OrderForm from './OrderForm';
import RiskCalculator from './RiskCalculator';
import OrderBook from './OrderBook';

export default function Sidebar({ asset, price, onExecuteTrade }) {
  return (
    <div className="space-y-6">
      <OrderForm asset={asset} price={price} onExecuteTrade={onExecuteTrade} />
      <RiskCalculator price={price} />
      <OrderBook price={price} />
    </div>
  );
}