// UtilsAndComponents.jsx - Utility functions, constants, and basic components

import React from 'react';

// --- CONSTANTS ---

export const TPE_TZ = 'Asia/Taipei';
export const VIE_TZ = 'Europe/Vienna';

export const Colors = {
    // 深色玻璃擬態設計系統 (Muted Slate - 高對比度版本，適合老人閱讀)
    BG_CANVAS: 'bg-[#0a0a0a]',
    BG_GRADIENT: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-black to-black',

    // 玻璃卡片效果
    GLASS_BG: 'bg-slate-800/20 backdrop-blur-xl',
    GLASS_BORDER: 'border border-slate-700/30',
    GLASS_SHADOW: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]',
    GLASS_HOVER: 'hover:bg-slate-700/30 hover:border-slate-600/40 transition-all duration-300',

    // 文字顏色 (提高對比度，確保老人容易閱讀)
    TEXT_PRIMARY: 'text-slate-100',    // 主要文字：幾乎白色，高對比
    TEXT_SECONDARY: 'text-slate-300',  // 次要文字：淺灰
    TEXT_MUTED: 'text-slate-500',      // 模糊文字：適中灰度
    TEXT_ACCENT: 'text-slate-200',     // 強調文字：亮灰

    // 強調色
    ACCENT_PRIMARY: 'bg-gradient-to-r from-slate-700 to-slate-600',
    ACCENT_SECONDARY: 'bg-gradient-to-r from-slate-600 to-slate-700',

    // 按鈕樣式 (提高文字對比)
    BTN_PRIMARY: 'bg-slate-700/50 hover:bg-slate-600/60 text-white shadow-lg shadow-black/30 border border-slate-600/50 transition-all duration-300',
    BTN_INACTIVE: 'bg-slate-800/30 hover:bg-slate-700/40 text-slate-300 border border-slate-700/30 transition-all duration-300',
    BTN_SECONDARY: 'bg-slate-800/30 hover:bg-slate-700/40 text-slate-200 border border-slate-700/30 transition-all duration-300',
    BTN_ACCENT: 'bg-slate-600/50 hover:bg-slate-500/60 text-white shadow-lg shadow-black/30 transition-all duration-300',
    BTN_GHOST: 'hover:bg-slate-800/30 text-slate-400 hover:text-slate-200 transition-all duration-200',

    // 標籤顏色 (提高文字亮度)
    TAG_FOOD: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30',
    TAG_SOUVENIR: 'bg-purple-950/40 text-purple-400 border border-purple-900/30',
    TAG_RESERVATION: 'bg-rose-950/40 text-rose-400 border border-rose-900/30',
    TAG_DEFAULT: 'bg-slate-900/60 text-slate-300 border border-slate-800/60',

    // 選中狀態 (提高文字對比)
    SELECTED: 'bg-slate-700/50 border-slate-600/70 text-white',

    // Inputs
    INPUT_BG: "bg-slate-900/50 focus:bg-slate-800/60",
    INPUT_BORDER: "border-slate-700/30 focus:border-slate-600/50",
};

export const defaultCurrencies = [{ code: 'EUR', name: '歐元' }, { code: 'TWD', name: '新台幣' }];
export const defaultFamilyMembers = ["爸爸", "媽媽", "小孩A", "小孩B"];
export const defaultCategories = ["Food", "Ticket", "Transport", "Accommodation", "Insurance", "Others"];

// --- UTILITY FUNCTIONS ---

export const getCurrentTime = (timezone) => {
    return new Date().toLocaleTimeString('zh-TW', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatDate = (dateString) => {
    if (!dateString) return '待定';
    const date = new Date(dateString);
    if (isNaN(date)) return '待定';
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
};

export const getGoogleMapsLink = (location) => {
    if (!location) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

export const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

// --- ICON COMPONENTS ---

export const MapIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
export const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>);
export const TimeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
export const WalletIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14h.01" /><path d="M7 7h10" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3.5-2-3.5 2-3.5-2L5 21z" /></svg>);
export const DeleteIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>);
export const DragIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>);
export const UserIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
export const PlusIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
export const CurrencyIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8L7.8 16.2" /><path d="M13 3v2M13 19v2M3 11h2M19 11h2" /></svg>);
export const PlaneIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>);
export const MoneyIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>);
export const CalendarIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
export const SettingsIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 6v10M1 12h6m6 0h10" /></svg>);
export const DownloadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
export const ShoppingIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>);
export const PackageIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>);
export const TrashIcon = DeleteIcon;
export const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
export const MapPinIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);

// --- BASIC COMPONENTS ---

export const LoadingSpinner = () => (
    <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-slate-400 animate-spin"></div>
        </div>
        <div className="text-slate-400 text-sm font-medium tracking-wider animate-pulse">LOADING...</div>
    </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={`relative w-full max-w-md ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-2xl p-6 ${Colors.GLASS_SHADOW} animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-slate-200`}>
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
