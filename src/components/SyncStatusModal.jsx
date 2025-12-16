import React from 'react';
import { Colors, Modal } from '../UtilsAndComponents';

const SyncStatusModal = ({ isOpen, onClose, syncStatus, lastSyncTime, authUser, authError, dbError, firebaseEnabled }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="系統連線狀態診斷">
            <div className="space-y-4">
                <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4`}>
                    <h4 className={`text-sm font-bold ${Colors.TEXT_MUTED} mb-2 uppercase tracking-wider`}>Firebase 設定</h4>
                    <div className="flex justify-between items-center mb-1">
                        <span className={Colors.TEXT_PRIMARY}>初始化狀態:</span>
                        <span className={firebaseEnabled ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                            {firebaseEnabled ? "成功 (Initialized)" : "失敗 (Failed)"}
                        </span>
                    </div>
                </div>

                <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4`}>
                    <h4 className={`text-sm font-bold ${Colors.TEXT_MUTED} mb-2 uppercase tracking-wider`}>認證狀態 (Auth)</h4>
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span className={Colors.TEXT_PRIMARY}>登入用戶:</span>
                            <span className="text-slate-300 font-mono text-xs">{authUser ? authUser.uid.slice(0, 8) + '...' : '未登入'}</span>
                        </div>
                        {authError && (
                            <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs break-all">
                                {authError}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4`}>
                    <h4 className={`text-sm font-bold ${Colors.TEXT_MUTED} mb-2 uppercase tracking-wider`}>資料庫連線 (Firestore)</h4>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className={Colors.TEXT_PRIMARY}>連線狀態:</span>
                            <span className={`font-bold ${syncStatus === 'connected' ? 'text-emerald-400' :
                                syncStatus === 'error' ? 'text-rose-400' : 'text-amber-400'
                                }`}>
                                {syncStatus === 'connected' ? '已連線 (Connected)' :
                                    syncStatus === 'error' ? '錯誤 (Error)' : '連線中 (Connecting...)'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={Colors.TEXT_PRIMARY}>最後同步:</span>
                            <span className="text-slate-300 text-xs">
                                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : '尚未同步'}
                            </span>
                        </div>
                        {dbError && (
                            <div className="mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded text-rose-400 text-xs break-all">
                                {dbError}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-xs text-slate-500 text-center">
                    <p>若顯示 Permission Denied，請檢查 Firebase Console 的 Rules。</p>
                    <p>若顯示 Network Error，請檢查網路連線。</p>
                </div>
            </div>
        </Modal>
    );
};

export default SyncStatusModal;
