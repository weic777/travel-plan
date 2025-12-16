import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

import {
    Colors, TPE_TZ, VIE_TZ,
    getCurrentTime, formatDate, generateUniqueId,
    CalendarIcon, MoneyIcon, ShoppingIcon, PackageIcon, SettingsIcon, LoadingSpinner,
    PlusIcon, MapIcon, EditIcon, DeleteIcon // Ensure Icons used in Itinerary view are imported
} from './UtilsAndComponents';

import { initialTripData, initialSettings } from './initialData';

// Component Imports
import FlightHeader from './components/FlightHeader';
import DaySelector from './components/DaySelector';
import ActivityCard from './components/ActivityCard';
import SyncStatusModal from './components/SyncStatusModal';
import ExpenseModal from './components/ExpenseModal';
import ActivityModal from './components/ActivityModal';
import CategoryEditModal from './components/CategoryEditModal';
import ShoppingModal from './components/ShoppingModal';
import PackingModal from './components/PackingModal';

// Page Imports
import FinancePage from './pages/FinancePage';
import ShoppingPage from './pages/ShoppingPage';
import PackingPage from './pages/PackingPage';
import SettingsPage from './pages/SettingsPage';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8kuPhbcCwDvkyPX2psh48MZkAr4HaSQQ",
    authDomain: "teavel-plan.firebaseapp.com",
    projectId: "teavel-plan",
    storageBucket: "teavel-plan.firebasestorage.app",
    messagingSenderId: "774661526446",
    appId: "1:774661526446:web:611723c1a725956bbc2e3f",
    measurementId: "G-JNHQ7DPDPH"
};

let db, auth;
let firebaseEnabled = false;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseEnabled = true;
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    firebaseEnabled = false;
}

// --- MAIN APP ---
const App = () => {
    // 從 localStorage 讀取或使用初始數據
    const [tripData, setTripData] = useState(() => {
        const saved = localStorage.getItem('tripData_v5');
        return saved ? JSON.parse(saved) : initialTripData;
    });
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('settings_v5');
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
    const [currentShoppingItem, setCurrentShoppingItem] = useState(null);
    const [isIndependentExpense, setIsIndependentExpense] = useState(false);
    const [syncStatusModalOpen, setSyncStatusModalOpen] = useState(false);
    const [isEditingDayCity, setIsEditingDayCity] = useState(false);
    const [editDayCityValue, setEditDayCityValue] = useState('');

    const [syncStatus, setSyncStatus] = useState('init'); // init, connected, error
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [dbError, setDbError] = useState(null);

    const dataRef = firebaseEnabled ? doc(db, 'trips', 'vienna-2026-v2') : null;
    const settingsRef = firebaseEnabled ? doc(db, 'trips', 'settings-vienna-2026-v2') : null;

    useEffect(() => {
        if (!firebaseEnabled) {
            setIsLoading(false);
            setSyncStatus('error');
            return;
        }

        // Authentication
        const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u) {
                console.log("User authenticated:", u.uid);
                setAuthError(null);
            } else {
                setAuthError("User not logged in");
            }
        });

        signInAnonymously(auth).catch((error) => {
            console.error("Auth Error:", error);
            setAuthError(error.message);
            setSyncStatus('error');
        });

        // Real-time Listeners
        const unsubscribeTrip = onSnapshot(dataRef, (docSnapshot) => {
            setSyncStatus('connected');
            setLastSyncTime(new Date());
            setDbError(null);
            if (docSnapshot.exists()) {
                console.log("Received remote trip data update");
                const data = docSnapshot.data();
                // Only update if data is different to avoid loops (though React handles this usually)
                setTripData(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
                localStorage.setItem('tripData_v5', JSON.stringify(data));
            } else {
                console.log("Initializing remote trip data...");
                // If remote doesn't exist, upload our local initial data
                // We use initialTripData here to ensure we start with the intended fresh state
                // ignoring any potentially stale local storage if we want a hard reset
                setDoc(dataRef, initialTripData).catch(err => console.error("Error initializing remote data:", err));
            }
        }, (error) => {
            console.error("Trip Data Sync Error:", error);
            setDbError(error.message);
            setSyncStatus('error');
        });

        const unsubscribeSettings = onSnapshot(settingsRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                console.log("Received remote settings update");
                const data = docSnapshot.data();
                setSettings(data);
                localStorage.setItem('settings_v5', JSON.stringify(data));
            } else {
                console.log("Initializing remote settings...");
                setDoc(settingsRef, initialSettings).catch(err => console.error("Error initializing remote settings:", err));
            }
        }, (error) => {
            console.error("Settings Sync Error:", error);
            // Don't override main sync status for settings error alone, but log it
            setDbError(prev => prev || error.message);
        });

        setIsLoading(false);

        return () => {
            unsubscribeAuth();
            unsubscribeTrip();
            unsubscribeSettings();
        };
    }, []);

    const saveData = useCallback((data) => {
        setTripData(data);
        // 保存到 localStorage
        localStorage.setItem('tripData_v3', JSON.stringify(data));
        // 如果啟用 Firebase 也保存到雲端
        if (firebaseEnabled && dataRef) {
            setDoc(dataRef, data, { merge: true }).catch(e => {
                console.error("Save Error:", e);
                setDbError("Save failed: " + e.message);
                setSyncStatus('error');
            });
        }
    }, [dataRef]);
    const handleUpdateDayCity = useCallback((dayIndex, newCity) => {
        const newDays = tripData.days.map(day => {
            if (day.index === dayIndex) {
                return { ...day, city: newCity };
            }
            return day;
        });
        saveData({ ...tripData, days: newDays });
    }, [tripData, saveData]);

    const handleUpdateFlight = useCallback((direction, field, value) => {
        const newFlightInfo = { ...tripData.flightInfo };

        if (field === 'time') {
            newFlightInfo[direction] = {
                ...newFlightInfo[direction],
                departure: {
                    ...newFlightInfo[direction].departure,
                    time: value
                }
            };
        } else if (field === 'note') {
            newFlightInfo[direction] = {
                ...newFlightInfo[direction],
                note: value
            };
        }

        saveData({ ...tripData, flightInfo: newFlightInfo });
    }, [tripData, saveData]);
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
                // Find the day that contains the expense we're editing
                const dayContainsExpense = day.activities.some(act =>
                    act.expenses?.some(e => e.id === expenseData.id)
                );

                if (day.index === selectedDayIndex || dayContainsExpense) {
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
        setCurrentShoppingItem(null);
        setShoppingModalOpen(true);
    }, []);

    const handleEditShoppingItem = useCallback((item) => {
        setCurrentShoppingItem(item);
        setShoppingModalOpen(true);
    }, []);

    const handleSaveShoppingItem = useCallback((itemData) => {
        if (itemData.id) {
            // Edit existing item
            const newShoppingList = (tripData.shoppingList || []).map(item =>
                item.id === itemData.id ? itemData : item
            );
            saveData({ ...tripData, shoppingList: newShoppingList });
        } else {
            // Add new item
            const newItem = {
                id: generateUniqueId(),
                ...itemData,
                purchased: false
            };
            saveData({ ...tripData, shoppingList: [...(tripData.shoppingList || []), newItem] });
        }
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

    const handleUpdateSettings = useCallback((newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('settings_v3', JSON.stringify(newSettings));
        if (firebaseEnabled && settingsRef) {
            setDoc(settingsRef, newSettings, { merge: true }).catch(e => console.error("Settings Save Error:", e));
        }
    }, [settingsRef]);

    const selectedDay = useMemo(() => {
        const day = tripData.days.find(d => d.index === selectedDayIndex);
        if (!day) return null;

        // Sort activities by time
        const sortedActivities = [...day.activities].sort((a, b) => {
            const timeA = a.time || '00:00';
            const timeB = b.time || '00:00';
            return timeA.localeCompare(timeB);
        });

        return { ...day, activities: sortedActivities };
    }, [tripData.days, selectedDayIndex]);

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
                    onEditItem={handleEditShoppingItem}
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
            case 'settings':
                return <SettingsPage
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                />;
            default: {
                const startEditCity = () => {
                    // Use city if set, otherwise fallback to derived
                    const currentLocation = selectedDay.city || selectedDay.activities.find(a => a.type === 'sightseeing' || a.type === 'accommodation')?.location?.split(',')[0] || '';
                    setEditDayCityValue(currentLocation);
                    setIsEditingDayCity(true);
                };

                const saveEditCity = () => {
                    handleUpdateDayCity(selectedDay.index, editDayCityValue);
                    setIsEditingDayCity(false);
                };

                const derivedLocation = selectedDay?.activities?.find(a => a.type === 'sightseeing' || a.type === 'accommodation')?.location?.split(',')[0];
                // Display priority: city -> derived -> empty
                const displayLocation = selectedDay?.city || derivedLocation || '';


                return (
                    <>
                        <DaySelector
                            days={tripData.days}
                            selectedDayIndex={selectedDayIndex}
                            onSelectDay={setSelectedDayIndex}
                            onUpdateDayCity={handleUpdateDayCity}
                        />
                        <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
                            <div className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} rounded-xl p-4 mb-4 ${Colors.GLASS_SHADOW}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className={`text-lg font-bold ${Colors.TEXT_PRIMARY}`}>
                                            {selectedDay?.date ? formatDate(selectedDay.date) : ''}
                                        </h2>
                                        {isEditingDayCity ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="text"
                                                    value={editDayCityValue}
                                                    onChange={(e) => setEditDayCityValue(e.target.value)}
                                                    className={`${Colors.GLASS_BG} ${Colors.GLASS_BORDER} ${Colors.TEXT_PRIMARY} rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500`}
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEditCity();
                                                        if (e.key === 'Escape') setIsEditingDayCity(false);
                                                    }}
                                                />
                                                <button onClick={saveEditCity} className="text-emerald-500 hover:text-emerald-400">✓</button>
                                                <button onClick={() => setIsEditingDayCity(false)} className="text-rose-500 hover:text-rose-400">✕</button>
                                            </div>
                                        ) : (
                                            <span
                                                onClick={startEditCity}
                                                className={`text-base font-normal ${Colors.TEXT_SECONDARY} cursor-pointer hover:bg-white/5 rounded px-1 transition-colors`}
                                                title="點擊編輯地點"
                                            >
                                                • {displayLocation || '點擊新增地點'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-3">
                                            {Object.entries(dailyExpenses).map(([currency, total]) => (
                                                <div key={currency} className="text-right">
                                                    <div className={`text-xs ${Colors.TEXT_MUTED}`}>{currency}</div>
                                                    <div className={`text-lg font-bold ${currency === 'EUR' ? 'text-emerald-400' :
                                                        currency === 'TWD' ? 'text-blue-400' :
                                                            Colors.TEXT_PRIMARY
                                                        }`}>
                                                        {total.toFixed(currency === 'TWD' ? 0 : 2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => {
                                                // If we have a location, pass it as default
                                                setActivityModalOpen(true);
                                            }}
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
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                            {selectedDay?.activities.map((activity, index) => (
                                                <Draggable key={activity.id} draggableId={activity.id} index={index}>
                                                    {(provided) => (
                                                        <ActivityCard
                                                            activity={activity}
                                                            dayIndex={selectedDayIndex}
                                                            onEdit={handleEditActivity}
                                                            onDelete={handleDeleteActivity}
                                                            onAddExpense={handleAddExpense}
                                                            onEditExpense={handleEditExpense}
                                                            onDeleteExpense={handleDeleteExpense}
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
        }
    };

    const tabs = [
        { id: 'itinerary', name: '行程', icon: CalendarIcon },
        { id: 'finance', name: '財務', icon: MoneyIcon },
        { id: 'shopping', name: '購物', icon: ShoppingIcon },
        { id: 'packing', name: '準備', icon: PackageIcon },
        { id: 'settings', name: '設定', icon: SettingsIcon },
    ];

    return (
        <div className={`min-h-screen ${Colors.BG_CANVAS}`}>
            <FlightHeader
                flightInfo={tripData.flightInfo}
                syncStatus={syncStatus}
                onOpenStatus={() => setSyncStatusModalOpen(true)}
                onUpdateFlight={handleUpdateFlight}
            />

            <SyncStatusModal
                isOpen={syncStatusModalOpen}
                onClose={() => setSyncStatusModalOpen(false)}
                syncStatus={syncStatus}
                lastSyncTime={lastSyncTime}
                authUser={user}
                authError={authError}
                dbError={dbError}
                firebaseEnabled={firebaseEnabled}
            />

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
                item={currentShoppingItem}
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
