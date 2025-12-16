import React, { useState, useMemo } from 'react';
import { Colors, MapIcon, EditIcon, TimeIcon, DeleteIcon, DragIcon, PlusIcon, getGoogleMapsLink } from '../UtilsAndComponents';

const ActivityCard = ({ activity, dayIndex, onEdit, onDelete, onAddExpense, onEditExpense, onDeleteExpense, provided }) => {
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
                            更新
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
                                href={getGoogleMapsLink(
                                    activity.type === 'transport'
                                        ? (activity.location.split(/->|→|↔/)[0].trim())
                                        : activity.location
                                )}
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
                        <p className={`text-sm ${Colors.TEXT_SECONDARY} mb-2 whitespace-pre-line`}>{activity.note}</p>
                    )}

                    {activity.expenses && activity.expenses.length > 0 && (
                        <div className={`mt-3 pt-3 border-t ${Colors.GLASS_BORDER}`}>
                            {/* Total Section - Visually distinct */}
                            <div className="flex items-center justify-between mb-3 bg-slate-800/40 p-2 rounded-lg">
                                <span className={`text-xs font-semibold ${Colors.TEXT_MUTED}`}>總計</span>
                                <div className="flex gap-3">
                                    {Object.entries(totalExpenses).map(([currency, total]) => (
                                        <div key={currency} className="text-right">
                                            <span className={`text-sm font-bold block leading-none ${currency === 'EUR' ? 'text-emerald-400' :
                                                currency === 'TWD' ? 'text-blue-400' :
                                                    Colors.TEXT_PRIMARY
                                                }`}>
                                                {total.toFixed(currency === 'TWD' ? 0 : 2)} <span className="text-[10px] opacity-70">{currency}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-1 pl-1">
                                {activity.expenses.map(exp => (
                                    <div key={exp.id} className="flex justify-between items-center text-xs group py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-1 rounded transition-colors">
                                        <div className="flex-1 flex justify-between items-center mr-2">
                                            <span className={`${Colors.TEXT_SECONDARY} truncate mr-2`}>
                                                {exp.description || '未命名項目'}
                                            </span>
                                            <span className={`font-mono ${exp.currency === 'EUR' ? 'text-emerald-300' :
                                                exp.currency === 'TWD' ? 'text-blue-300' :
                                                    Colors.TEXT_PRIMARY
                                                }`}>
                                                {exp.amount} <span className="text-[10px] opacity-50">{exp.currency}</span>
                                            </span>
                                        </div>
                                        {/* Edit/Delete controls for expense - show on hover */}
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditExpense({ ...exp, activityId: activity.id, dayIndex });
                                                }}
                                                className="p-1 hover:bg-white/10 rounded text-amber-400"
                                                title="編輯"
                                            >
                                                <EditIcon className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteExpense({ ...exp, activityId: activity.id, dayIndex });
                                                }}
                                                className="p-1 hover:bg-white/10 rounded text-rose-500"
                                                title="刪除"
                                            >
                                                <DeleteIcon className="w-3 h-3" />
                                            </button>
                                        </div>
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

export default ActivityCard;
