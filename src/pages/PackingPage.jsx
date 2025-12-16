import React from 'react';
import { Colors, EditIcon, DeleteIcon, PlusIcon } from '../UtilsAndComponents';
import ProgressBar from '../components/ProgressBar';

const PackingPage = ({ packingList, onTogglePacked, onAddItem, onDeleteItem, onOpenCategoryEdit, onDeleteCategory }) => {
    const categories = [...new Set(packingList.map(item => item.category))];
    const total = packingList.length;
    const packed = packingList.filter(i => i.packed).length;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${Colors.TEXT_PRIMARY}`}>出國準備清單</h2>
                <button onClick={onAddItem} className={`px-4 py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                    <PlusIcon className="w-4 h-4 inline mr-1" /> 新增項目
                </button>
            </div>

            <ProgressBar total={total} current={packed} colorClass="bg-blue-500" />

            {categories.map(category => (
                <div key={category} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                        <h3 className={`font-bold ${Colors.TEXT_PRIMARY}`}>{category}</h3>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onOpenCategoryEdit(category)}
                                className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}
                            >
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm(`確定要刪除「${category}」類別及其下所有項目嗎?`)) onDeleteCategory(category);
                                }}
                                className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-500 hover:bg-rose-500/10`}
                            >
                                <DeleteIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {packingList.filter(item => item.category === category).map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={item.packed}
                                    onChange={() => onTogglePacked(item.id)}
                                    className="w-5 h-5 rounded border-slate-500 bg-slate-700"
                                />
                                <div className={`flex-1 ${item.packed ? 'line-through opacity-50' : ''} ${Colors.TEXT_PRIMARY}`}>
                                    {item.item}
                                </div>
                                <button onClick={() => onDeleteItem(item.id)} className={`p-2 rounded-lg ${Colors.BTN_GHOST} text-rose-500 hover:bg-rose-500/10`}>
                                    <DeleteIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PackingPage;
