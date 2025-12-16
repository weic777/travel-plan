import React from 'react';
import { Colors, EditIcon, DeleteIcon, PlusIcon } from '../UtilsAndComponents';
import ProgressBar from '../components/ProgressBar';

const ShoppingPage = ({ shoppingList, onTogglePurchased, onAddItem, onEditItem, onDeleteItem }) => {
    const total = shoppingList.length;
    const purchased = shoppingList.filter(i => i.purchased).length;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${Colors.TEXT_PRIMARY}`}>購物清單</h2>
                <button onClick={onAddItem} className={`px-4 py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                    <PlusIcon className="w-4 h-4 inline mr-1" /> 新增項目
                </button>
            </div>

            <ProgressBar total={total} current={purchased} colorClass="bg-emerald-500" />

            <div className="space-y-2">
                {shoppingList.map(item => (
                    <div key={item.id} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={item.purchased}
                                onChange={() => onTogglePurchased(item.id)}
                                className="w-5 h-5 rounded border-slate-500 bg-slate-700"
                            />
                            <div className="flex-1">
                                <div className={`font-semibold ${item.purchased ? 'line-through opacity-50' : ''} ${Colors.TEXT_PRIMARY}`}>
                                    {item.item}
                                </div>
                                <div className={`text-sm ${Colors.TEXT_MUTED} flex flex-wrap gap-2 mt-1`}>
                                    <span>負責人: {item.assignedTo}</span>
                                    <span>• 數量: {item.quantity}</span>
                                    {item.location && <span>• 地點: {item.location}</span>}
                                </div>
                                {item.note && <div className={`text-xs ${Colors.TEXT_SECONDARY} mt-1`}>備註: {item.note}</div>}
                            </div>
                            <button onClick={() => onEditItem(item)} className={`p-2 rounded-lg ${Colors.BTN_GHOST}`}>
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDeleteItem(item.id)} className={`p-2 rounded-lg ${Colors.BTN_GHOST} text-rose-500 hover:bg-rose-500/10`}>
                                <DeleteIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingPage;
