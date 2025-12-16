import React, { useState, useEffect } from 'react';
import { Colors, Modal } from '../UtilsAndComponents';

const ActivityModal = ({ isOpen, onClose, onSave, defaultLocation = '' }) => {
    const [formData, setFormData] = useState({
        time: '09:00',
        name: '',
        location: '',
        note: ''
    });

    // 當 modal 開啟且有預設地點時，自動填入
    useEffect(() => {
        if (isOpen && defaultLocation) {
            setFormData(prev => ({ ...prev, location: defaultLocation }));
        }
    }, [isOpen, defaultLocation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({ time: '09:00', name: '', location: '', note: '' });
    };

    const handleClose = () => {
        setFormData({ time: '09:00', name: '', location: '', note: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="新增活動">
            <div className="space-y-4">
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

                <button
                    onClick={handleSubmit}
                    className={`w-full py-3 rounded-lg ${Colors.BTN_ACCENT}`}
                >
                    新增活動
                </button>
            </div>
        </Modal>
    );
};

export default ActivityModal;