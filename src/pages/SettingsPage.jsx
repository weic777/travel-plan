import React, { useState } from 'react';
import { Colors, UserIcon, PlusIcon, WalletIcon, EditIcon, DeleteIcon, CurrencyIcon } from '../UtilsAndComponents';

const SettingsPage = ({ settings, onUpdateSettings }) => {
    const [editingSection, setEditingSection] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [newCurrencyCode, setNewCurrencyCode] = useState('');
    const [newCurrencyName, setNewCurrencyName] = useState('');

    // Edit State
    const [editingItemType, setEditingItemType] = useState(null); // 'member', 'category', 'currency'
    const [editingOriginalValue, setEditingOriginalValue] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editValue2, setEditValue2] = useState(''); // For currency name

    const handleAddMember = () => {
        if (!newItem.trim()) return;
        const updated = { ...settings, familyMembers: [...settings.familyMembers, newItem.trim()] };
        onUpdateSettings(updated);
        setNewItem('');
        setEditingSection(null);
    };

    const handleDeleteMember = (member) => {
        if (!window.confirm(`確定要刪除「${member}」嗎？`)) return;
        const updated = { ...settings, familyMembers: settings.familyMembers.filter(m => m !== member) };
        onUpdateSettings(updated);
    };

    const handleStartEditMember = (member) => {
        setEditingItemType('member');
        setEditingOriginalValue(member);
        setEditValue(member);
    };

    const handleSaveEditMember = () => {
        if (!editValue.trim() || editValue === editingOriginalValue) {
            setEditingItemType(null);
            return;
        }
        const updated = {
            ...settings,
            familyMembers: settings.familyMembers.map(m => m === editingOriginalValue ? editValue.trim() : m)
        };
        onUpdateSettings(updated);
        setEditingItemType(null);
    };

    const handleAddCategory = () => {
        if (!newItem.trim()) return;
        const updated = { ...settings, categories: [...settings.categories, newItem.trim()] };
        onUpdateSettings(updated);
        setNewItem('');
        setEditingSection(null);
    };

    const handleDeleteCategory = (category) => {
        if (!window.confirm(`確定要刪除「${category}」類別嗎？`)) return;
        const updated = { ...settings, categories: settings.categories.filter(c => c !== category) };
        onUpdateSettings(updated);
    };

    const handleStartEditCategory = (category) => {
        setEditingItemType('category');
        setEditingOriginalValue(category);
        setEditValue(category);
    };

    const handleSaveEditCategory = () => {
        if (!editValue.trim() || editValue === editingOriginalValue) {
            setEditingItemType(null);
            return;
        }
        const updated = {
            ...settings,
            categories: settings.categories.map(c => c === editingOriginalValue ? editValue.trim() : c)
        };
        onUpdateSettings(updated);
        setEditingItemType(null);
    };

    const handleAddCurrency = () => {
        if (!newCurrencyCode.trim() || !newCurrencyName.trim()) return;
        const updated = {
            ...settings,
            currencies: [...settings.currencies, { code: newCurrencyCode.trim().toUpperCase(), name: newCurrencyName.trim() }]
        };
        onUpdateSettings(updated);
        setNewCurrencyCode('');
        setNewCurrencyName('');
        setEditingSection(null);
    };

    const handleDeleteCurrency = (code) => {
        if (!window.confirm(`確定要刪除「${code}」幣別嗎？`)) return;
        const updated = { ...settings, currencies: settings.currencies.filter(c => c.code !== code) };
        onUpdateSettings(updated);
    };

    const handleStartEditCurrency = (currency) => {
        setEditingItemType('currency');
        setEditingOriginalValue(currency.code);
        setEditValue(currency.code);
        setEditValue2(currency.name);
    };

    const handleSaveEditCurrency = () => {
        if (!editValue.trim() || !editValue2.trim()) {
            setEditingItemType(null);
            return;
        }
        const updated = {
            ...settings,
            currencies: settings.currencies.map(c => c.code === editingOriginalValue ? { code: editValue.trim().toUpperCase(), name: editValue2.trim() } : c)
        };
        onUpdateSettings(updated);
        setEditingItemType(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
            <h2 className={`text-2xl font-bold ${Colors.TEXT_PRIMARY} mb-4`}>設定</h2>

            {/* Family Members */}
            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} flex items-center gap-2`}>
                        <UserIcon className="w-5 h-5" /> 家庭成員
                    </h3>
                    <button
                        onClick={() => setEditingSection(editingSection === 'members' ? null : 'members')}
                        className={`px-3 py-1.5 rounded-lg ${Colors.BTN_ACCENT} text-sm`}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增
                    </button>
                </div>

                {editingSection === 'members' && (
                    <div className="mb-3 flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="例如: 爸爸"
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                        />
                        <button onClick={handleAddMember} className={`px-4 py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                            新增
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {settings.familyMembers.map(member => (
                        <div key={member} className={`flex items-center justify-between p-3 rounded-lg ${Colors.GLASS_BG} ${Colors.GLASS_BORDER}`}>
                            {editingItemType === 'member' && editingOriginalValue === member ? (
                                <div className="flex-1 flex gap-2 mr-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
                                    />
                                    <button onClick={handleSaveEditMember} className={`px-3 py-1 rounded ${Colors.BTN_ACCENT} text-xs`}>儲存</button>
                                    <button onClick={() => setEditingItemType(null)} className={`px-3 py-1 rounded ${Colors.BTN_PRIMARY} text-xs`}>取消</button>
                                </div>
                            ) : (
                                <>
                                    <span className={Colors.TEXT_PRIMARY}>{member}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleStartEditMember(member)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteMember(member)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-500`}>
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Expense Categories */}
            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} flex items-center gap-2`}>
                        <WalletIcon className="w-5 h-5" /> 花費類別
                    </h3>
                    <button
                        onClick={() => setEditingSection(editingSection === 'categories' ? null : 'categories')}
                        className={`px-3 py-1.5 rounded-lg ${Colors.BTN_ACCENT} text-sm`}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增
                    </button>
                </div>

                {editingSection === 'categories' && (
                    <div className="mb-3 flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="例如: 紀念品"
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button onClick={handleAddCategory} className={`px-4 py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                            新增
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {settings.categories.map(category => (
                        <div key={category} className={`flex items-center justify-between p-3 rounded-lg ${Colors.GLASS_BG} ${Colors.GLASS_BORDER}`}>
                            {editingItemType === 'category' && editingOriginalValue === category ? (
                                <div className="flex-1 flex gap-2 mr-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
                                    />
                                    <button onClick={handleSaveEditCategory} className={`px-3 py-1 rounded ${Colors.BTN_ACCENT} text-xs`}>儲存</button>
                                    <button onClick={() => setEditingItemType(null)} className={`px-3 py-1 rounded ${Colors.BTN_PRIMARY} text-xs`}>取消</button>
                                </div>
                            ) : (
                                <>
                                    <span className={Colors.TEXT_PRIMARY}>{category}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleStartEditCategory(category)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-500`}>
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Currencies */}
            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} flex items-center gap-2`}>
                        <CurrencyIcon className="w-5 h-5" /> 幣別設定
                    </h3>
                    <button
                        onClick={() => setEditingSection(editingSection === 'currencies' ? null : 'currencies')}
                        className={`px-3 py-1.5 rounded-lg ${Colors.BTN_ACCENT} text-sm`}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增
                    </button>
                </div>

                {editingSection === 'currencies' && (
                    <div className="mb-3 space-y-2">
                        <input
                            type="text"
                            value={newCurrencyCode}
                            onChange={(e) => setNewCurrencyCode(e.target.value.toUpperCase())}
                            placeholder="幣別代碼 (例如: USD)"
                            maxLength={3}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        />
                        <input
                            type="text"
                            value={newCurrencyName}
                            onChange={(e) => setNewCurrencyName(e.target.value)}
                            placeholder="幣別名稱 (例如: 美元)"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                        />
                        <button onClick={handleAddCurrency} className={`w-full py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                            新增幣別
                        </button>
                    </div>
                )}

                <div className="space-y-2">
                    {settings.currencies.map(currency => (
                        <div key={currency.code} className={`flex items-center justify-between p-3 rounded-lg ${Colors.GLASS_BG} ${Colors.GLASS_BORDER}`}>
                            {editingItemType === 'currency' && editingOriginalValue === currency.code ? (
                                <div className="flex-1 flex gap-2 mr-2">
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                                        maxLength={3}
                                        className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-center"
                                    />
                                    <input
                                        type="text"
                                        value={editValue2}
                                        onChange={(e) => setEditValue2(e.target.value)}
                                        className="flex-1 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
                                    />
                                    <button onClick={handleSaveEditCurrency} className={`px-3 py-1 rounded ${Colors.BTN_ACCENT} text-xs`}>儲存</button>
                                    <button onClick={() => setEditingItemType(null)} className={`px-3 py-1 rounded ${Colors.BTN_PRIMARY} text-xs`}>取消</button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <span className={`${Colors.TEXT_PRIMARY} font-semibold`}>{currency.code}</span>
                                        <span className={`${Colors.TEXT_SECONDARY} text-sm ml-2`}>({currency.name})</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleStartEditCurrency(currency)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteCurrency(currency.code)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-500`}>
                                            <DeleteIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
