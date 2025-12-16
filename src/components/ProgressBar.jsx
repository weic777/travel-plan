import React from 'react';
import { Colors } from '../UtilsAndComponents';

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

export default ProgressBar;
