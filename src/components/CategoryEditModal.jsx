import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Colors, Modal, DeleteIcon } from '../UtilsAndComponents'; // Check imports

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

export default CategoryEditModal;
