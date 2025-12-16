import React, { useState } from 'react';
import { Colors, Modal } from '../UtilsAndComponents';

const PackingModal = ({ isOpen, onClose, onSave, existingCategories }) => {
    const [formData, setFormData] = useState({
        item: '',
        category: existingCategories[0] || '衣物',
        isNewCategory: false,
        newCategoryName: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryToSave = formData.isNewCategory ? formData.newCategoryName : formData.category;
        if (!categoryToSave) return;

        onSave({
            item: formData.item,
            category: categoryToSave
        });
        setFormData({ item: '', category: existingCategories[0] || '衣物', isNewCategory: false, newCategoryName: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新增打包項目">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>項目名稱</label>
                    <input
                        type="text"
                        value={formData.item}
                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        placeholder="例如: 充電器"
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>類別</label>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="existing"
                                checked={!formData.isNewCategory}
                                onChange={() => setFormData({ ...formData, isNewCategory: false })}
                                className="text-blue-500"
                            />
                            <label htmlFor="existing" className={Colors.TEXT_PRIMARY}>選擇現有類別</label>
                        </div>
                        {!formData.isNewCategory && (
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                            >
                                {existingCategories.map(c => (
                                    <option key={c} value={c} className="text-slate-900 bg-white">{c}</option>
                                ))}
                            </select>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="radio"
                                id="new"
                                checked={formData.isNewCategory}
                                onChange={() => setFormData({ ...formData, isNewCategory: true })}
                                className="text-blue-500"
                            />
                            <label htmlFor="new" className={Colors.TEXT_PRIMARY}>新增類別</label>
                        </div>
                        {formData.isNewCategory && (
                            <input
                                type="text"
                                value={formData.newCategoryName}
                                onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
                                placeholder="輸入新類別名稱"
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                            />
                        )}
                    </div>
                </div>

                <button type="submit" className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}>
                    新增項目
                </button>
            </form>
        </Modal>
    );
};

export default PackingModal;
