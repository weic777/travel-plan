import React, { useState, useEffect } from 'react';
import { Colors, Modal, generateUniqueId } from '../UtilsAndComponents';

const ExpenseModal = ({ isOpen, onClose, onSave, expense, familyMembers = [], currencies = [], categories = [], isIndependent = false }) => {
    const [formData, setFormData] = useState(expense || {
        amount: '',
        description: '',
        currency: currencies[0]?.code || 'EUR',
        payer: familyMembers[0] || '',
        category: categories[0] || 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (expense) {
            setFormData(expense);
        } else {
            setFormData({
                amount: '',
                description: '',
                currency: currencies[0]?.code || 'EUR',
                payer: familyMembers[0] || '',
                category: categories[0] || 'Food',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [expense, currencies, familyMembers, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: formData.id || generateUniqueId(),
            amount: parseFloat(formData.amount)
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={expense ? "編輯花費" : "新增花費"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isIndependent && (
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>日期</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>幣別</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code} className="text-slate-900 bg-white">{c.code}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>金額</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        />
                    </div>
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>描述</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>付款人</label>
                        <select
                            value={formData.payer}
                            onChange={(e) => setFormData({ ...formData, payer: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        >
                            {familyMembers.map(m => (
                                <option key={m} value={m} className="text-slate-900 bg-white">{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>類別</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        >
                            {categories.map(c => (
                                <option key={c} value={c} className="text-slate-900 bg-white">{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}>
                    {expense ? "更新" : "新增"}
                </button>
            </form>
        </Modal>
    );
};

export default ExpenseModal;
