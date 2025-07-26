import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LayoutCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SortableCategory: React.FC<{ id: string }> = ({ id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-theme-primary p-3 rounded-lg flex items-center justify-between shadow">
            <span className="font-medium text-theme-primary">{id}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-secondary cursor-grab" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
        </div>
    );
};


const LayoutCustomizationModal: React.FC<LayoutCustomizationModalProps> = ({ isOpen, onClose }) => {
  const { sectionOrder, setSectionOrder } = useTheme();
  const [localOrder, setLocalOrder] = useState(sectionOrder);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
        setLocalOrder((items) => {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const handleSave = () => {
    setSectionOrder(localOrder);
    onClose();
  };

  const handleCancel = () => {
    setLocalOrder(sectionOrder); // Reset changes
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={handleCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md bg-theme-secondary rounded-xl shadow-2xl transform transition-transform animate-fade-in-down flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="layout-modal-title"
      >
        <header className="flex justify-between items-center p-4 border-b border-theme">
          <h2 id="layout-modal-title" className="text-xl font-bold text-theme-primary">Reorder Categories</h2>
          <button onClick={handleCancel} className="p-2 rounded-full hover:bg-black/10 text-theme-secondary" aria-label="Close layout settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        <main className="p-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-theme-secondary mb-4">Drag and drop the categories to change their order on the home page.</p>
             <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={localOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {localOrder.map(category => <SortableCategory key={category} id={category} />)}
                    </div>
                </SortableContext>
            </DndContext>
        </main>
        <footer className="flex justify-end p-4 border-t border-theme space-x-2">
            <button onClick={handleCancel} className="bg-theme-tertiary text-theme-primary font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-primary text-on-primary font-bold py-2 px-4 rounded-md hover:bg-primary-light transition-colors">Save Order</button>
        </footer>
      </div>
    </div>
  );
};

export default LayoutCustomizationModal;