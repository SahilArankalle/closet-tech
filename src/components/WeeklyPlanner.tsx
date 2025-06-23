
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Shirt } from 'lucide-react';
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
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const addItemToDay = (dayKey: string, item: ClothingItem) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        items: [...(prev[dayKey]?.items || []), item]
      }
    }));
  };

  const removeItemFromDay = (dayKey: string, itemId: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        items: prev[dayKey]?.items?.filter(item => item.id !== itemId) || []
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Week Navigation Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Weekly Outfit Planner</h2>
            <p className="text-slate-600 font-medium">{formatDateRange()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {daysOfWeek.map((day, index) => {
          const date = weekDates[index];
          const dateKey = date.toISOString().split('T')[0];
          const daySchedule = schedule[dateKey];
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={day} className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 ${
              isToday ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200/50'
            }`}>
              {/* Day Header */}
              <div className={`p-4 border-b ${
                isToday 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white' 
                  : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/50'
              }`}>
                <h3 className={`font-semibold ${isToday ? 'text-white' : 'text-slate-900'}`}>
                  {day}
                </h3>
                <p className={`text-sm ${isToday ? 'text-indigo-100' : 'text-slate-600'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {isToday && <span className="ml-1 text-xs">(Today)</span>}
                </p>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-3 min-h-[280px]">
                {daySchedule?.items?.length ? (
                  <>
                    {daySchedule.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-slate-50 rounded-xl p-3 group hover:bg-slate-100 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-xs overflow-hidden shadow-sm">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            '👕'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-600 capitalize">{item.category} • {item.color}</p>
                        </div>
                        <button
                          onClick={() => removeItemFromDay(dateKey, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-all p-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="pt-2">
                      <button className="w-full text-xs text-indigo-600 hover:text-indigo-700 flex items-center justify-center space-x-1 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                        <Plus className="w-3 h-3" />
                        <span>Add More</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Shirt className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">No outfit planned</p>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 mx-auto bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Plan Outfit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Items */}
      {clothingItems.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Items</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {clothingItems.slice(0, 16).map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-slate-50 rounded-xl border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="text-2xl opacity-60">👕</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {clothingItems.length > 16 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all {clothingItems.length} items
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {clothingItems.length === 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-slate-200/50 text-center shadow-sm">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Start Planning Your Week</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Add some clothing items to your wardrobe first to start planning outfits for each day
          </p>
          <div className="bg-slate-50 rounded-xl p-4 max-w-sm mx-auto border border-slate-200/50">
            <p className="text-sm text-slate-600">
              💡 Once you have items in your wardrobe, you'll be able to drag and drop them into daily outfit plans
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;
