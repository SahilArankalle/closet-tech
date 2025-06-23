
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { ClothingItem, WeeklySchedule } from '../types/wardrobe';

interface WeeklyPlannerProps {
  clothingItems: ClothingItem[];
}

const WeeklyPlanner: React.FC<WeeklyPlannerProps> = ({ clothingItems }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState<WeeklySchedule>({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const formatDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Weekly Outfit Planner</h2>
            <p className="text-gray-600">{formatDateRange()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => {
          const date = weekDates[index];
          const dateKey = date.toISOString().split('T')[0];
          const daySchedule = schedule[dateKey];

          return (
            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{day}</h3>
                <p className="text-sm text-gray-600">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="p-4 space-y-3 min-h-[200px]">
                {daySchedule?.items?.length ? (
                  daySchedule.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center text-xs">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          '👕'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No outfit planned</p>
                    <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center space-x-1 mx-auto">
                      <Plus className="w-3 h-3" />
                      <span>Plan outfit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Planning Tools */}
      {clothingItems.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-purple-100 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Planning Your Week</h3>
          <p className="text-gray-600 mb-4">Add some clothing items to your wardrobe first to start planning outfits</p>
          <p className="text-sm text-gray-500">
            Once you have items in your wardrobe, you'll be able to drag and drop them into daily outfit plans
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;
