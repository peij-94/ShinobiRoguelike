import React from 'react';
import { Player, Item } from '../types';
import { ITEMS } from '../constants';
import Button from './Button';
import { Coins, ShoppingBag, XCircle } from 'lucide-react';

interface Props {
  player: Player;
  onBuy: (item: Item) => void;
  onClose: () => void;
}

const ShopModal: React.FC<Props> = ({ player, onBuy, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-900 border-2 border-yellow-600 rounded-2xl p-6 md:p-8 flex flex-col space-y-6 shadow-[0_0_50px_rgba(202,138,4,0.3)]">
        
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
          <div className="flex items-center space-x-4">
            <ShoppingBag className="text-yellow-500" size={32} />
            <div>
              <h2 className="text-4xl font-comic text-yellow-500">忍具店</h2>
              <p className="text-gray-400 text-sm">补给你的装备，为下一场战斗做准备。</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-lg border border-yellow-800">
            <Coins className="text-yellow-400" size={24} />
            <span className="text-2xl font-mono text-yellow-400">{player.gold} G</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] flex-1">
          {Object.values(ITEMS).map((item) => {
            const canAfford = player.gold >= item.price;
            return (
              <div 
                key={item.id} 
                className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 flex justify-between items-center group hover:bg-gray-800 transition-all"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-yellow-200 transition-colors">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <div className="flex space-x-2 mt-2">
                    {item.selfDamage && (
                      <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">-{item.selfDamage} HP</span>
                    )}
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">{item.type}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 min-w-[100px]">
                  <span className={`font-mono font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.price} G
                  </span>
                  <Button 
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    variant={canAfford ? 'primary' : 'disabled'}
                    className="py-1 px-3 text-sm"
                  >
                    购买
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-gray-700 flex justify-end">
          <Button onClick={onClose} variant="secondary">
            <div className="flex items-center space-x-2">
              <XCircle size={20} />
              <span>离开商店</span>
            </div>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ShopModal;