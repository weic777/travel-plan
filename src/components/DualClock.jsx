import React, { useState, useEffect } from 'react';
import { Colors, TPE_TZ, VIE_TZ, getCurrentTime } from '../UtilsAndComponents';

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

export default DualClock;
