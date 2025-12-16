import React from 'react';
import { Colors } from '../UtilsAndComponents';

const DaySelector = ({ days, selectedDayIndex, onSelectDay }) => {
    return (
        <div className={`sticky top-[53px] z-20 ${Colors.GLASS_BG} ${Colors.GLASS_BORDER} border-b ${Colors.GLASS_SHADOW} touch-pan-x`}>
            <div className="max-w-6xl mx-auto px-2 py-3 overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                    {days.map((day) => {
                        const dateObj = new Date(day.date);
                        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
                        const isSelected = selectedDayIndex === day.index;

                        // Get main location: Priority is explicit city > derived from activities > empty
                        const derivedLocation = day.activities && day.activities.length > 0
                            ? day.activities.find(a => a.type === 'sightseeing' || a.type === 'accommodation')?.location?.split(',')[0]?.split(' ')[0]
                            : '';
                        const mainLocation = day.city || derivedLocation || '';

                        return (
                            <button
                                key={day.index}
                                onClick={() => onSelectDay(day.index)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap flex flex-col items-center min-w-[110px] active:scale-95 ${isSelected
                                    ? `${Colors.BTN_PRIMARY} shadow-xl`
                                    : `${Colors.BTN_INACTIVE} hover:scale-105`
                                    }`}
                            >
                                <div className="font-bold text-base mb-0.5">Day {day.index + 1}</div>
                                <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{dateStr}</div>
                                {mainLocation && (
                                    <div className={`text-xs mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {mainLocation.length > 10 ? mainLocation.slice(0, 10) + '...' : mainLocation}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DaySelector;
