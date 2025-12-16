import React, { useState, useEffect } from 'react';
import { Colors, Modal } from '../UtilsAndComponents';

const ShoppingModal = ({ isOpen, onClose, onSave, item, familyMembers = [] }) => {
    const [formData, setFormData] = useState({
        item: '',
        assignedTo: familyMembers[0] || '',
        quantity: '1',
        location: '',
        note: ''
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            setFormData({
                item: '',
                assignedTo: familyMembers[0] || '',
                quantity: '1',
                location: '',
                note: ''
            });
        }
    }, [item, familyMembers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ item: '', assignedTo: familyMembers[0] || '', quantity: '1', location: '', note: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? "編輯購物項目" : "新增購物項目"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>商品名稱</label>
                    <input
                        type="text"
                        value={formData.item}
                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        placeholder="例如: 莫札特巧克力"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>負責人</label>
                        <select
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        >
                            {familyMembers.map(m => (
                                <option key={m} value={m} className="text-slate-900 bg-white">{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>數量</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        />
                    </div>
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>購買地點</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        placeholder="例如: 超市、免稅店"
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>備註</label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        rows={2}
                    />
                </div>

                <button type="submit" className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}>
                    {item ? "更新" : "新增項目"}
                </button>
            </form>
        </Modal>
    );
};

export default ShoppingModal;
