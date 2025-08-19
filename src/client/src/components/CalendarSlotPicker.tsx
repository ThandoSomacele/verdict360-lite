import React, { useState } from 'react';

interface TimeSlot {
  id: number;
  time: string;
  datetime: string;
  available: boolean;
}

interface CalendarSlotPickerProps {
  date: string;
  slots: TimeSlot[];
  onSlotSelect: (slot: TimeSlot) => void;
  theme?: 'light' | 'dark';
}

const CalendarSlotPicker: React.FC<CalendarSlotPickerProps> = ({ 
  date, 
  slots, 
  onSlotSelect, 
  theme = 'light' 
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      onSlotSelect(selectedSlot);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          Select a consultation time
        </h4>
        <p className="text-sm text-gray-600">
          {formatDate(date)}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-2 mb-4">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.available}
            className={`
              w-full p-3 text-left rounded-lg border transition-all duration-200
              ${!slot.available 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : selectedSlot?.id === slot.id
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{slot.time}</span>
              {selectedSlot?.id === slot.id && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {selectedSlot && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
          <div>
            <p className="text-sm font-medium text-blue-900">
              Selected time: {selectedSlot.time}
            </p>
            <p className="text-xs text-blue-600">
              {formatDate(date)}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={handleConfirm}
          disabled={!selectedSlot}
          className={`
            flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors
            ${selectedSlot
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {selectedSlot ? 'Book This Time' : 'Select a time slot'}
        </button>
        <button
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Different day
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Your consultation will be confirmed via email and calendar invitation
      </p>
    </div>
  );
};

export default CalendarSlotPicker;