import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

import {
    Colors, TPE_TZ, VIE_TZ,
    getCurrentTime, formatDate, getGoogleMapsLink, generateUniqueId,
    MapIcon, EditIcon, TimeIcon, WalletIcon, DeleteIcon, DragIcon, UserIcon, PlusIcon,
    CurrencyIcon, PlaneIcon, MoneyIcon, CalendarIcon, DownloadIcon, ShoppingIcon, PackageIcon,
    LoadingSpinner, Modal
} from './UtilsAndComponents';

import { initialTripData, initialSettings } from './initialData';

// Firebase Configuration
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let db, auth;
let firebaseEnabled = false;

if (firebaseConfig && firebaseConfig.projectId) {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        firebaseEnabled = true;
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
        firebaseEnabled = false;
    }
} else {
    firebaseEnabled = false;
}

// --- DUAL CLOCK ---
const DualClock = () => {
    const [tpeTime, setTpeTime] = useState(getCurrentTime(TPE_TZ));
    const [vieTime, setVieTime] = useState(getCurrentTime(VIE_TZ));

    useEffect(() => {
        const interval = setInterval(() => {
            setTpeTime(getCurrentTime(TPE_TZ));
            setVieTime(getCurrentTime(VIE_TZ));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
                <span className={Colors.TEXT_MUTED}>🇹🇼</span>
                <span className={`font-mono font-semibold ${Colors.TEXT_SECONDARY}`}>{tpeTime}</span>
            </div>
            <div className={`w-px h-4 bg-slate-300`}></div>
            <div className="flex items-center gap-1.5">
                <span className={Colors.TEXT_MUTED}>🇦🇹</span>
                <span className={`font-mono font-semibold ${Colors.TEXT_SECONDARY}`}>{vieTime}</span>
            </div>
        </div>
    );
};

// --- FLIGHT HEADER ---
const FlightHeader = ({ flightInfo }) => {
    return (
        <div className={`sticky top-0 z-30 ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} border-b ${Colors.GLASS_SHADOW}`}>
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <h1 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} flex items-center gap-2`}>
                        <PlaneIcon className="w-5 h-5" />
                        維也納之旅
                    </h1>
                    <DualClock />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-2`}>
                        <div className={`${Colors.TEXT_MUTED} mb-0.5 flex items-center gap-1`}>
                            <PlaneIcon className="w-3 h-3" /> 去程 ({flightInfo?.outbound?.airline} {flightInfo?.outbound?.flightNumber})
                        </div>
                        <div className={`${Colors.TEXT_PRIMARY} font-semibold`}>{flightInfo?.outbound?.departure?.time}</div>
                        <div className={Colors.TEXT_SECONDARY}>{flightInfo?.outbound?.departure?.code} → {flightInfo?.outbound?.arrival?.code}</div>
                    </div>
                    <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-2`}>
                        <div className={`${Colors.TEXT_MUTED} mb-0.5 flex items-center gap-1`}>
                            <PlaneIcon className="w-3 h-3" /> 回程 ({flightInfo?.inbound?.airline} {flightInfo?.inbound?.flightNumber})
                        </div>
                        <div className={`${Colors.TEXT_PRIMARY} font-semibold`}>{flightInfo?.inbound?.departure?.time}</div>
                        <div className={Colors.TEXT_SECONDARY}>{flightInfo?.inbound?.departure?.code} → {flightInfo?.inbound?.arrival?.code}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DAY SELECTOR ---
const DaySelector = ({ days, selectedDayIndex, onSelectDay }) => {
    return (
        <div className={`sticky top-[120px] z-20 ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} border-b ${Colors.GLASS_SHADOW} touch-pan-x`}>
            <div className="max-w-6xl mx-auto px-2 py-3 overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                    {days.map((day) => {
                        const dateObj = new Date(day.date);
                        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
                        const isSelected = selectedDayIndex === day.index;

                        return (
                            <button
                                key={day.index}
                                onClick={() => onSelectDay(day.index)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex flex-col items-center min-w-[90px] active:scale-95 ${isSelected
                                    ? `${Colors.BTN_PRIMARY} shadow-xl`
                                    : `${Colors.BTN_INACTIVE} hover:scale-105`
                                    }`}
                            >
                                <div className="font-bold text-base mb-0.5">Day {day.index + 1}</div>
                                <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{dateStr}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- ACTIVITY CARD ---
const ActivityCard = ({ activity, dayIndex, onEdit, onDelete, onAddExpense, provided }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(activity);

    const handleSave = () => {
        onEdit(dayIndex, editData);
        setIsEditing(false);
    };

    const totalExpenses = useMemo(() => {
        if (!activity.expenses || activity.expenses.length === 0) return {};
        return activity.expenses.reduce((acc, exp) => {
            acc[exp.currency] = (acc[exp.currency] || 0) + exp.amount;
            return acc;
        }, {});
    }, [activity.expenses]);

    if (isEditing) {
        return (
            <div ref={provided.innerRef} {...provided.draggableProps} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 mb-3 ${Colors.GLASS_SHADOW}`}>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs ${Colors.TEXT_MUTED} mb-1 block`}>時間</label>
                            <input
                                type="time"
                                value={editData.time}
                                onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY}`}
                            />
                        </div>
                        <div>
                            <label className={`text-xs ${Colors.TEXT_MUTED} mb-1 block`}>地點</label>
                            <input
                                type="text"
                                value={editData.location}
                                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY}`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs ${Colors.TEXT_MUTED} mb-1 block`}>活動名稱</label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY}`}
                        />
                    </div>
                    <div>
                        <label className={`text-xs ${Colors.TEXT_MUTED} mb-1 block`}>備註</label>
                        <textarea
                            value={editData.note || ''}
                            onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY}`}
                            rows={2}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className={`flex-1 py-2 rounded-lg ${Colors.BTN_ACCENT}`}>
                            儲存
                        </button>
                        <button onClick={() => setIsEditing(false)} className={`flex-1 py-2 rounded-lg ${Colors.BTN_PRIMARY}`}>
                            取消
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={provided.innerRef} {...provided.draggableProps} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 mb-3 ${Colors.GLASS_SHADOW} ${Colors.GLASS_HOVER}`}>
            <div className="flex items-start gap-3">
                <div {...provided.dragHandleProps} className={`${Colors.TEXT_MUTED} cursor-grab active:cursor-grabbing`}>
                    <DragIcon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <TimeIcon className={`w-4 h-4 ${Colors.TEXT_MUTED}`} />
                            <span className={`font-bold ${Colors.TEXT_PRIMARY}`}>{activity.time}</span>
                        </div>
                        <div className="flex gap-1">
                            <a
                                href={getGoogleMapsLink(activity.location)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}
                            >
                                <MapIcon className="w-4 h-4" />
                            </a>
                            <button onClick={() => setIsEditing(true)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDelete(dayIndex, activity.id)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-600`}>
                                <DeleteIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h4 className={`font-semibold ${Colors.TEXT_PRIMARY} mb-1`}>{activity.name}</h4>
                    <p className={`text-sm ${Colors.TEXT_MUTED} mb-2`}>{activity.location}</p>

                    {activity.note && (
                        <p className={`text-sm ${Colors.TEXT_SECONDARY} mb-2`}>{activity.note}</p>
                    )}

                    {activity.expenses && activity.expenses.length > 0 && (
                        <div className={`mt-3 pt-3 border-t ${Colors.GLASS_BORDER}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-semibold ${Colors.TEXT_MUTED}`}>花費記錄</span>
                                <div className="flex gap-2">
                                    {Object.entries(totalExpenses).map(([currency, total]) => (
                                        <span key={currency} className={`text-sm font-bold ${Colors.TEXT_PRIMARY}`}>
                                            {total.toFixed(currency === 'TWD' ? 0 : 2)} {currency}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                {activity.expenses.map(exp => (
                                    <div key={exp.id} className="flex justify-between text-xs">
                                        <span className={Colors.TEXT_SECONDARY}>{exp.description}</span>
                                        <span className={Colors.TEXT_PRIMARY}>{exp.amount} {exp.currency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => onAddExpense(dayIndex, activity.id)}
                        className={`mt-3 w-full py-2 rounded-lg ${Colors.BTN_PRIMARY} text-sm`}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增花費
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- EXPENSE MODAL ---
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
                                <option key={c.code} value={c.code}>{c.code}</option>
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
                        required
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
                                <option key={m} value={m}>{m}</option>
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
                                <option key={c} value={c}>{c}</option>
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

// --- ACTIVITY MODAL ---
const ActivityModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        time: '09:00',
        name: '',
        location: '',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ time: '09:00', name: '', location: '', note: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新增活動">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>時間</label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-slate-500"
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>活動名稱</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-slate-500"
                        placeholder="例如: 參觀博物館"
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>地點</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-slate-500"
                        placeholder="例如: 羅浮宮"
                    />
                </div>

                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>備註</label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-slate-500"
                        rows={3}
                        placeholder="例如: 記得提前預約"
                    />
                </div>

                <button type="submit" className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}>
                    新增活動
                </button>
            </form>
        </Modal>
    );
};

// --- PROGRESS BAR ---
const ProgressBar = ({ total, current, colorClass = "bg-blue-500" }) => {
    const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

    return (
        <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
                <span className={Colors.TEXT_MUTED}>完成進度</span>
                <span className={Colors.TEXT_PRIMARY}>{percentage}% ({current}/{total})</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// --- CATEGORY EDIT MODAL ---
const CategoryEditModal = ({ isOpen, onClose, onSave, category, items }) => {
    const [categoryName, setCategoryName] = useState('');
    const [editingItems, setEditingItems] = useState([]);

    useEffect(() => {
        if (isOpen && category) {
            setCategoryName(category);
            setEditingItems(JSON.parse(JSON.stringify(items))); // Deep copy
        }
    }, [isOpen, category, items]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newItems = Array.from(editingItems);
        const [reorderedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, reorderedItem);
        setEditingItems(newItems);
    };

    const handleItemChange = (id, field, value) => {
        setEditingItems(editingItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDeleteItem = (id) => {
        setEditingItems(editingItems.filter(item => item.id !== id));
    };

    const handleAddItem = () => {
        const newItem = {
            id: `temp-${Date.now()}`, // Temporary ID
            item: '',
            category: categoryName,
            packed: false
        };
        setEditingItems([...editingItems, newItem]);
    };

    const handleSave = () => {
        onSave(category, categoryName, editingItems);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="編輯類別與項目">
            <div className="space-y-4">
                <div>
                    <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY} block mb-1`}>類別名稱</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className={`text-sm font-medium ${Colors.TEXT_PRIMARY}`}>項目列表 (可拖曳排序)</label>
                        <button onClick={handleAddItem} className={`text-xs px-2 py-1 rounded ${Colors.BTN_SECONDARY}`}>
                            + 新增項目
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-1">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="category-items">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                        {editingItems.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`${Colors.GLASS_BG} border border-white/5 rounded-lg p-2 flex items-center gap-2`}
                                                    >
                                                        <div className="text-slate-500 cursor-grab">⋮⋮</div>
                                                        <input
                                                            type="text"
                                                            value={item.item}
                                                            onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                                                            className="flex-1 bg-transparent border-none text-white focus:ring-0 text-sm"
                                                            placeholder="項目名稱"
                                                        />
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-rose-500 hover:bg-white/10 p-1 rounded"
                                                        >
                                                            <DeleteIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                <button onClick={handleSave} className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}>
                    保存變更
                </button>
            </div>
        </Modal>
    );
};

// --- SHOPPING MODAL ---
const ShoppingModal = ({ isOpen, onClose, onSave, familyMembers = [] }) => {
    const [formData, setFormData] = useState({
        item: '',
        assignedTo: familyMembers[0] || '',
        quantity: '1',
        location: '',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ item: '', assignedTo: familyMembers[0] || '', quantity: '1', location: '', note: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新增購物項目">
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
                                <option key={m} value={m} className="text-slate-800">{m}</option>
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
                    新增項目
                </button>
            </form>
        </Modal>
    );
};

// --- PACKING MODAL ---
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
                                    <option key={c} value={c} className="text-slate-800">{c}</option>
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

// --- FINANCE PAGE ---
const FinancePage = ({ tripData, settings, onAddIndependentExpense, onEditExpense, onDeleteExpense }) => {
    const allExpenses = useMemo(() => {
        const activityExpenses = [];
        tripData.days.forEach(day => {
            day.activities.forEach(act => {
                if (act.expenses) {
                    act.expenses.forEach(exp => {
                        activityExpenses.push({
                            ...exp,
                            date: day.date,
                            activityName: act.name,
                            source: 'activity',
                            dayIndex: day.index,
                            activityId: act.id
                        });
                    });
                }
            });
        });

        const independent = (tripData.independentExpenses || []).map(exp => ({
            ...exp,
            source: 'independent'
        }));

        return [...activityExpenses, ...independent].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [tripData]);

    const totalsByCurrency = useMemo(() => {
        const totals = {};
        allExpenses.forEach(exp => {
            totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
        });
        return totals;
    }, [allExpenses]);

    const settlements = useMemo(() => {
        const result = {};

        settings.currencies.forEach(({ code }) => {
            const expensesInCurrency = allExpenses.filter(e => e.currency === code);
            if (expensesInCurrency.length === 0) return;

            const total = expensesInCurrency.reduce((sum, e) => sum + e.amount, 0);
            const perPerson = total / settings.familyMembers.length;

            const balances = {};
            settings.familyMembers.forEach(member => {
                const paid = expensesInCurrency
                    .filter(e => e.payer === member)
                    .reduce((sum, e) => sum + e.amount, 0);
                balances[member] = paid - perPerson;
            });

            const debtors = Object.entries(balances).filter(([_, bal]) => bal < 0).sort((a, b) => a[1] - b[1]);
            const creditors = Object.entries(balances).filter(([_, bal]) => bal > 0).sort((a, b) => b[1] - a[1]);

            const transactions = [];
            let i = 0, j = 0;
            while (i < debtors.length && j < creditors.length) {
                const [debtor, debtAmount] = debtors[i];
                const [creditor, creditAmount] = creditors[j];
                const amount = Math.min(-debtAmount, creditAmount);

                if (amount > 0.01) {
                    transactions.push({ from: debtor, to: creditor, amount });
                }

                debtors[i][1] += amount;
                creditors[j][1] -= amount;

                if (Math.abs(debtors[i][1]) < 0.01) i++;
                if (Math.abs(creditors[j][1]) < 0.01) j++;
            }

            result[code] = { total, perPerson, transactions };
        });

        return result;
    }, [allExpenses, settings]);

    return (
        <div className="p-4 space-y-4 pb-24">
            <h2 className={`text-2xl font-bold ${Colors.TEXT_PRIMARY} mb-4`}>財務總覽</h2>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} mb-3`}>總花費</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(totalsByCurrency).map(([currency, total]) => (
                        <div key={currency} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-3 text-center`}>
                            <div className={`text-2xl font-bold ${Colors.TEXT_PRIMARY}`}>
                                {total.toFixed(currency === 'TWD' ? 0 : 2)}
                            </div>
                            <div className={`text-sm ${Colors.TEXT_MUTED}`}>{currency}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>結算明細</h3>
                    <button className={`px-3 py-1.5 rounded-lg ${Colors.BTN_PRIMARY} text-sm`}>
                        <DownloadIcon className="w-4 h-4 inline mr-1" /> 匯出
                    </button>
                </div>

                {Object.entries(settlements).map(([currency, data]) => (
                    <div key={currency} className="mb-4 last:mb-0">
                        <div className={`font-bold ${Colors.TEXT_PRIMARY} mb-2`}>{currency} 結算</div>
                        <div className={`text-sm ${Colors.TEXT_SECONDARY} mb-2`}>
                            每人應付: {data.perPerson.toFixed(currency === 'TWD' ? 0 : 2)} {currency}
                        </div>
                        <div className="space-y-1">
                            {data.transactions.map((t, i) => (
                                <div key={i} className={`text-sm ${Colors.TEXT_PRIMARY} bg-white/5 rounded px-2 py-1`}>
                                    {t.from} → {t.to}: {t.amount.toFixed(currency === 'TWD' ? 0 : 2)} {currency}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 ${Colors.GLASS_SHADOW}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>所有花費</h3>
                    <button onClick={onAddIndependentExpense} className={`px-3 py-1.5 rounded-lg ${Colors.BTN_ACCENT} text-sm`}>
                        <PlusIcon className="w-4 h-4 inline mr-1" /> 新增獨立花費
                    </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allExpenses.map(exp => (
                        <div key={exp.id} className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-3`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className={`font-semibold ${Colors.TEXT_PRIMARY}`}>{exp.description}</div>
                                    <div className={`text-xs ${Colors.TEXT_MUTED} mt-1`}>
                                        {formatDate(exp.date)} • {exp.payer} • {exp.category}
                                        {exp.activityName && ` • ${exp.activityName}`}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`font-bold ${Colors.TEXT_PRIMARY} text-lg`}>
                                        {exp.amount} {exp.currency}
                                    </div>
                                    <button onClick={() => onEditExpense(exp)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST}`}>
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDeleteExpense(exp)} className={`p-1.5 rounded-lg ${Colors.BTN_GHOST} text-rose-600`}>
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- SHOPPING PAGE ---
const ShoppingPage = ({ shoppingList, onTogglePurchased, onAddItem, onDeleteItem }) => {
    const total = shoppingList.length;
    const purchased = shoppingList.filter(i => i.purchased).length;

    return (
        <div className="p-4 space-y-4 pb-24">
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

// --- PACKING PAGE ---
const PackingPage = ({ packingList, onTogglePacked, onAddItem, onDeleteItem, onOpenCategoryEdit, onDeleteCategory }) => {
    const categories = [...new Set(packingList.map(item => item.category))];
    const total = packingList.length;
    const packed = packingList.filter(i => i.packed).length;

    return (
        <div className="p-4 space-y-4 pb-24">
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

// --- MAIN APP ---
const App = () => {
    // 從 localStorage 讀取或使用初始數據
    const [tripData, setTripData] = useState(() => {
        const saved = localStorage.getItem('tripData_v3');
        return saved ? JSON.parse(saved) : initialTripData;
    });
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('settings_v3');
        return saved ? { ...initialSettings, ...JSON.parse(saved) } : initialSettings;
    });
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('itinerary');
    const [selectedDayIndex, setSelectedDayIndex] = useState(1);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [activityModalOpen, setActivityModalOpen] = useState(false);
    const [shoppingModalOpen, setShoppingModalOpen] = useState(false);
    const [packingModalOpen, setPackingModalOpen] = useState(false);
    const [categoryEditModalOpen, setCategoryEditModalOpen] = useState(false);
    const [currentEditingCategory, setCurrentEditingCategory] = useState(null);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [currentActivityId, setCurrentActivityId] = useState(null);
    const [isIndependentExpense, setIsIndependentExpense] = useState(false);

    const dataRef = firebaseEnabled ? doc(db, 'trips', 'vienna-2026') : null;

    useEffect(() => {
        if (!firebaseEnabled) {
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }, []);

    const saveData = useCallback((data) => {
        setTripData(data);
        // 保存到 localStorage
        localStorage.setItem('tripData_v3', JSON.stringify(data));
        // 如果啟用 Firebase 也保存到雲端
        if (firebaseEnabled && user && dataRef) {
            setDoc(dataRef, data, { merge: true });
        }
    }, [user, dataRef]);

    const handleEditActivity = useCallback((dayIndex, updatedActivity) => {
        const newDays = tripData.days.map(day => {
            if (day.index === dayIndex) {
                return {
                    ...day,
                    activities: day.activities.map(act =>
                        act.id === updatedActivity.id ? updatedActivity : act
                    )
                };
            }
            return day;
        });
        saveData({ ...tripData, days: newDays });
    }, [tripData, saveData]);

    const handleDeleteActivity = useCallback((dayIndex, activityId) => {
        if (!window.confirm('確定要刪除這個活動嗎?')) return;
        const newDays = tripData.days.map(day => {
            if (day.index === dayIndex) {
                return {
                    ...day,
                    activities: day.activities.filter(act => act.id !== activityId)
                };
            }
            return day;
        });
        saveData({ ...tripData, days: newDays });
    }, [tripData, saveData]);

    const handleAddActivity = useCallback(() => {
        setActivityModalOpen(true);
    }, []);

    const handleSaveActivity = useCallback((activityData) => {
        const newActivity = {
            id: generateUniqueId(),
            ...activityData,
            expenses: []
        };

        const newDays = tripData.days.map(day => {
            if (day.index === selectedDayIndex) {
                return {
                    ...day,
                    activities: [...day.activities, newActivity]
                };
            }
            return day;
        });
        saveData({ ...tripData, days: newDays });
        setActivityModalOpen(false);
    }, [tripData, selectedDayIndex, saveData]);

    const handleAddExpense = useCallback((dayIndex, activityId) => {
        setCurrentActivityId(activityId);
        setCurrentExpense(null);
        setIsIndependentExpense(false);
        setExpenseModalOpen(true);
    }, []);

    const handleAddIndependentExpense = useCallback(() => {
        setCurrentActivityId(null);
        setCurrentExpense(null);
        setIsIndependentExpense(true);
        setExpenseModalOpen(true);
    }, []);

    const handleEditExpense = useCallback((expense) => {
        setCurrentExpense(expense);
        setIsIndependentExpense(expense.source === 'independent');
        setCurrentActivityId(expense.activityId || null);
        setExpenseModalOpen(true);
    }, []);

    const handleDeleteExpense = useCallback((expense) => {
        if (!window.confirm('確定要刪除這筆花費嗎?')) return;

        if (expense.source === 'independent') {
            const newIndependentExpenses = (tripData.independentExpenses || []).filter(e => e.id !== expense.id);
            saveData({ ...tripData, independentExpenses: newIndependentExpenses });
        } else {
            const newDays = tripData.days.map(day => {
                if (day.index === expense.dayIndex) {
                    return {
                        ...day,
                        activities: day.activities.map(act => {
                            if (act.id === expense.activityId) {
                                return {
                                    ...act,
                                    expenses: (act.expenses || []).filter(e => e.id !== expense.id)
                                };
                            }
                            return act;
                        })
                    };
                }
                return day;
            });
            saveData({ ...tripData, days: newDays });
        }
    }, [tripData, saveData]);

    const handleSaveExpense = useCallback((expenseData) => {
        if (isIndependentExpense) {
            const independentExpenses = tripData.independentExpenses || [];
            const existingIndex = independentExpenses.findIndex(e => e.id === expenseData.id);

            if (existingIndex >= 0) {
                independentExpenses[existingIndex] = expenseData;
            } else {
                independentExpenses.push(expenseData);
            }

            saveData({ ...tripData, independentExpenses });
        } else {
            const newDays = tripData.days.map(day => {
                if (day.index === selectedDayIndex) {
                    return {
                        ...day,
                        activities: day.activities.map(act => {
                            if (act.id === currentActivityId) {
                                const expenses = act.expenses || [];
                                const existingIndex = expenses.findIndex(e => e.id === expenseData.id);
                                if (existingIndex >= 0) {
                                    expenses[existingIndex] = expenseData;
                                } else {
                                    expenses.push(expenseData);
                                }
                                return { ...act, expenses };
                            }
                            return act;
                        })
                    };
                }
                return day;
            });
            saveData({ ...tripData, days: newDays });
        }
    }, [tripData, selectedDayIndex, currentActivityId, isIndependentExpense, saveData]);

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;

        const dayIndex = selectedDayIndex;
        const newDays = tripData.days.map(day => {
            if (day.index === dayIndex) {
                const activities = Array.from(day.activities);
                const [removed] = activities.splice(result.source.index, 1);
                activities.splice(result.destination.index, 0, removed);
                return { ...day, activities };
            }
            return day;
        });
        saveData({ ...tripData, days: newDays });
    }, [tripData, selectedDayIndex, saveData]);

    const handleToggleShoppingPurchased = useCallback((itemId) => {
        const newShoppingList = tripData.shoppingList.map(item =>
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
        );
        saveData({ ...tripData, shoppingList: newShoppingList });
    }, [tripData, saveData]);

    const handleTogglePackingPacked = useCallback((itemId) => {
        const newPackingList = tripData.packingList.map(item =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
        );
        saveData({ ...tripData, packingList: newPackingList });
    }, [tripData, saveData]);



    const handleAddShoppingItem = useCallback(() => {
        setShoppingModalOpen(true);
    }, []);

    const handleSaveShoppingItem = useCallback((itemData) => {
        const newItem = {
            id: generateUniqueId(),
            ...itemData,
            purchased: false
        };
        saveData({ ...tripData, shoppingList: [...(tripData.shoppingList || []), newItem] });
        setShoppingModalOpen(false);
    }, [tripData, saveData]);

    const handleDeleteShoppingItem = useCallback((itemId) => {
        if (!window.confirm('確定要刪除這個項目嗎?')) return;
        const newShoppingList = (tripData.shoppingList || []).filter(item => item.id !== itemId);
        saveData({ ...tripData, shoppingList: newShoppingList });
    }, [tripData, saveData]);

    const handleAddPackingItem = useCallback(() => {
        setPackingModalOpen(true);
    }, []);

    const handleSavePackingItem = useCallback((itemData) => {
        const newItem = {
            id: generateUniqueId(),
            ...itemData,
            packed: false
        };
        saveData({ ...tripData, packingList: [...(tripData.packingList || []), newItem] });
        setPackingModalOpen(false);
    }, [tripData, saveData]);

    const handleDeletePackingItem = useCallback((itemId) => {
        if (!window.confirm('確定要刪除這個項目嗎?')) return;
        const newPackingList = (tripData.packingList || []).filter(item => item.id !== itemId);
        saveData({ ...tripData, packingList: newPackingList });
    }, [tripData, saveData]);

    const handleEditCategory = useCallback((category) => {
        setCurrentEditingCategory(category);
        setCategoryEditModalOpen(true);
    }, []);

    const handleUpdateCategoryItems = useCallback((oldCategoryName, newCategoryName, updatedItems) => {
        // 1. Filter out items belonging to the old category
        const otherItems = (tripData.packingList || []).filter(item => item.category !== oldCategoryName);

        // 2. Prepare updated items with the new category name
        const newCategoryItems = updatedItems.map(item => ({
            ...item,
            category: newCategoryName,
            // Ensure ID is unique if it was a temp ID
            id: item.id.startsWith('temp-') ? generateUniqueId() : item.id
        }));

        // 3. Combine and save
        saveData({ ...tripData, packingList: [...otherItems, ...newCategoryItems] });
    }, [tripData, saveData]);

    const handleDeleteCategory = useCallback((category) => {
        const newPackingList = (tripData.packingList || []).filter(item => item.category !== category);
        saveData({ ...tripData, packingList: newPackingList });
    }, [tripData, saveData]);

    const selectedDay = tripData.days.find(d => d.index === selectedDayIndex);
    const dailyExpenses = useMemo(() => {
        if (!selectedDay) return {};
        const totals = {};
        selectedDay.activities.forEach(act => {
            if (act.expenses) {
                act.expenses.forEach(exp => {
                    totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
                });
            }
        });
        return totals;
    }, [selectedDay]);

    if (isLoading) {
        return (
            <div className={`min-h-screen ${Colors.BG_CANVAS} flex justify-center items-center`}>
                <LoadingSpinner />
            </div>
        );
    }

    const renderContent = () => {
        switch (selectedTab) {
            case 'finance':
                return <FinancePage
                    tripData={tripData}
                    settings={settings}
                    onAddIndependentExpense={handleAddIndependentExpense}
                    onEditExpense={handleEditExpense}
                    onDeleteExpense={handleDeleteExpense}
                />;
            case 'shopping':
                return <ShoppingPage
                    shoppingList={tripData.shoppingList || []}
                    onTogglePurchased={handleToggleShoppingPurchased}
                    onAddItem={handleAddShoppingItem}
                    onDeleteItem={handleDeleteShoppingItem}
                />;
            case 'packing':
                return <PackingPage
                    packingList={tripData.packingList || []}
                    onTogglePacked={handleTogglePackingPacked}
                    onAddItem={handleAddPackingItem}
                    onDeleteItem={handleDeletePackingItem}
                    onOpenCategoryEdit={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                />;
            default:
                return (
                    <>
                        <DaySelector days={tripData.days} selectedDayIndex={selectedDayIndex} onSelectDay={setSelectedDayIndex} />

                        <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
                            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 mb-4 ${Colors.GLASS_SHADOW}`}>
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>
                                        Day {selectedDay?.index} - {selectedDay?.city}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-3">
                                            {Object.entries(dailyExpenses).map(([currency, total]) => (
                                                <div key={currency} className="text-right">
                                                    <div className={`text-xs ${Colors.TEXT_MUTED}`}>{currency}</div>
                                                    <div className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>
                                                        {total.toFixed(currency === 'TWD' ? 0 : 2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleAddActivity}
                                            className={`px-3 py-2 rounded-lg ${Colors.BTN_SECONDARY} text-sm flex items-center gap-1`}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            新增活動
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="activities">
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {selectedDay?.activities.map((activity, index) => (
                                                <Draggable key={activity.id} draggableId={activity.id} index={index}>
                                                    {(provided) => (
                                                        <ActivityCard
                                                            activity={activity}
                                                            dayIndex={selectedDayIndex}
                                                            onEdit={handleEditActivity}
                                                            onDelete={handleDeleteActivity}
                                                            onAddExpense={handleAddExpense}
                                                            provided={provided}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </main>
                    </>
                );
        }
    };

    const tabs = [
        { id: 'itinerary', name: '行程', icon: CalendarIcon },
        { id: 'finance', name: '財務', icon: MoneyIcon },
        { id: 'shopping', name: '購物', icon: ShoppingIcon },
        { id: 'packing', name: '準備', icon: PackageIcon },
    ];

    return (
        <div className={`min-h-screen ${Colors.BG_CANVAS}`}>
            <FlightHeader flightInfo={tripData.flightInfo} />

            {renderContent()}

            <div className={`fixed bottom-0 left-0 right-0 ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} border-t ${Colors.GLASS_SHADOW}`}>
                <div className="max-w-6xl mx-auto flex justify-around items-center h-16">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${selectedTab === tab.id
                                ? `${Colors.SELECTED} border-t-2 border-amber-600`
                                : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            {typeof tab.icon === 'string' ? (
                                <span className="text-2xl mb-1">{tab.icon}</span>
                            ) : (
                                <tab.icon className={`w-6 h-6 ${Colors.TEXT_PRIMARY} mb-1`} />
                            )}
                            <span className={`text-xs ${Colors.TEXT_PRIMARY} font-semibold`}>{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <ExpenseModal
                isOpen={expenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                onSave={handleSaveExpense}
                expense={currentExpense}
                familyMembers={settings.familyMembers}
                currencies={settings.currencies}
                categories={settings.categories}
                isIndependent={isIndependentExpense}
            />

            <ActivityModal
                isOpen={activityModalOpen}
                onClose={() => setActivityModalOpen(false)}
                onSave={handleSaveActivity}
            />

            <ShoppingModal
                isOpen={shoppingModalOpen}
                onClose={() => setShoppingModalOpen(false)}
                onSave={handleSaveShoppingItem}
                familyMembers={settings.familyMembers}
            />

            <PackingModal
                isOpen={packingModalOpen}
                onClose={() => setPackingModalOpen(false)}
                onSave={handleSavePackingItem}
                existingCategories={[...new Set((tripData.packingList || []).map(item => item.category))]}
            />

            <CategoryEditModal
                isOpen={categoryEditModalOpen}
                onClose={() => setCategoryEditModalOpen(false)}
                onSave={handleUpdateCategoryItems}
                category={currentEditingCategory}
                items={(tripData.packingList || []).filter(item => item.category === currentEditingCategory)}
            />
        </div>
    );
};

export default App;
