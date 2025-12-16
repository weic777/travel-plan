import React, { useState } from 'react';
import { Colors, PlaneIcon } from '../UtilsAndComponents';
import DualClock from './DualClock';

const FlightHeader = ({ flightInfo, syncStatus, onOpenStatus, onUpdateFlight }) => {
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEdit = (direction, field, currentValue) => {
        setEditingField(`${direction}-${field}`);
        setEditValue(currentValue || '');
    };

    const handleSave = (direction, field) => {
        if (onUpdateFlight) {
            onUpdateFlight(direction, field, editValue);
        }
        setEditingField(null);
        setEditValue('');
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const renderEditableField = (direction, field, value, className = '') => {
        const fieldKey = `${direction}-${field}`;
        const isEditing = editingField === fieldKey;

        if (isEditing) {
            return (
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY} rounded px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave(direction, field);
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                    <button
                        onClick={() => handleSave(direction, field)}
                        className="text-emerald-500 hover:text-emerald-400 px-1 text-base"
                        type="button"
                    >
                        ✓
                    </button>
                    <button
                        onClick={handleCancel}
                        className="text-rose-500 hover:text-rose-400 px-1 text-base"
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            );
        }

        return (
            <div
                onClick={() => handleEdit(direction, field, value)}
                className={`${className} cursor-pointer hover:bg-white/5 rounded px-1 transition-colors`}
                title="點擊編輯"
            >
                {value || '點擊編輯'}
            </div>
        );
    };

    return (
        <div className={`relative ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} border-b ${Colors.GLASS_SHADOW}`}>
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <h1 className={`text-lg font-bold ${Colors.TEXT_PRIMARY} flex items-center gap-2`}>
                        <PlaneIcon className="w-5 h-5" />
                        維也納之旅
                        {syncStatus && (
                            <button
                                onClick={onOpenStatus}
                                className={`flex h-2 w-2 rounded-full cursor-pointer transition-transform hover:scale-150 ${syncStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
                                    syncStatus === 'error' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 animate-pulse'
                                    }`}
                                title={syncStatus === 'connected' ? '已連線 (點擊查看詳情)' : '連線異常 (點擊查看詳情)'}
                            ></button>
                        )}
                    </h1>
                    <DualClock />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-2`}>
                        <div className={`${Colors.TEXT_MUTED} mb-0.5 flex items-center gap-1`}>
                            <PlaneIcon className="w-3 h-3" /> 去程 ({flightInfo?.outbound?.airline} {flightInfo?.outbound?.flightNumber})
                        </div>
                        {renderEditableField('outbound', 'time', flightInfo?.outbound?.departure?.time, `${Colors.TEXT_PRIMARY} font-semibold`)}
                        <div className={Colors.TEXT_SECONDARY}>
                            {flightInfo?.outbound?.departure?.code} → {flightInfo?.outbound?.arrival?.code}
                        </div>
                        {renderEditableField('outbound', 'note', flightInfo?.outbound?.note, `${Colors.TEXT_MUTED} mt-1 text-[10px] italic`)}
                    </div>
                    <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-lg p-2`}>
                        <div className={`${Colors.TEXT_MUTED} mb-0.5 flex items-center gap-1`}>
                            <PlaneIcon className="w-3 h-3" /> 回程 ({flightInfo?.inbound?.airline} {flightInfo?.inbound?.flightNumber})
                        </div>
                        {renderEditableField('inbound', 'time', flightInfo?.inbound?.departure?.time, `${Colors.TEXT_PRIMARY} font-semibold`)}
                        <div className={Colors.TEXT_SECONDARY}>
                            {flightInfo?.inbound?.departure?.code} → {flightInfo?.inbound?.arrival?.code}
                        </div>
                        {renderEditableField('inbound', 'note', flightInfo?.inbound?.note, `${Colors.TEXT_MUTED} mt-1 text-[10px] italic`)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightHeader;