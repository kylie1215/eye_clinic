import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ClockIcon, 
  CalendarDaysIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DoctorSchedule() {
  const [availability, setAvailability] = useState([
    { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Wednesday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Friday', enabled: true, start: '09:00', end: '17:00' },
    { day: 'Saturday', enabled: false, start: '09:00', end: '13:00' },
    { day: 'Sunday', enabled: false, start: '09:00', end: '13:00' },
  ]);

  const [timeSlots, setTimeSlots] = useState([
    { time: '09:00 AM', duration: '30 min', available: true },
    { time: '10:00 AM', duration: '30 min', available: true },
    { time: '11:00 AM', duration: '30 min', available: true },
    { time: '02:00 PM', duration: '30 min', available: true },
    { time: '03:00 PM', duration: '30 min', available: true },
    { time: '04:00 PM', duration: '30 min', available: true },
  ]);

  const toggleDay = (index) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const updateTime = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSave = () => {
    toast.success('Schedule updated successfully!');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">My Schedule</h1>
        <p className="text-gray-600 mt-1">Manage your availability and working hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <Card title="Weekly Availability" className="animate-fade-in-up">
            <div className="space-y-4">
              {availability.map((day, index) => (
                <div 
                  key={day.day}
                  className={`p-4 rounded-xl transition-all duration-300 animate-slide-in-right ${
                    day.enabled 
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDay(index)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          day.enabled ? 'bg-[#1ABC9C]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                            day.enabled ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                      <div>
                        <p className="font-semibold text-gray-900">{day.day}</p>
                        {!day.enabled && (
                          <p className="text-xs text-gray-500">Unavailable</p>
                        )}
                      </div>
                    </div>
                    <CalendarDaysIcon className={`h-5 w-5 ${
                      day.enabled ? 'text-[#1ABC9C]' : 'text-gray-400'
                    }`} />
                  </div>

                  {day.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => updateTime(index, 'start', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => updateTime(index, 'end', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="primary" onClick={handleSave} className="flex-1">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Save Schedule
              </Button>
            </div>
          </Card>
        </div>

        {/* Time Slots & Quick Settings */}
        <div className="space-y-6">
          {/* Default Time Slots */}
          <Card title="Default Time Slots" className="animate-fade-in-up animate-delay-100">
            <div className="space-y-2 mb-4">
              {timeSlots.map((slot, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-[#1ABC9C]" />
                    <div>
                      <p className="font-medium text-gray-900">{slot.time}</p>
                      <p className="text-xs text-gray-500">{slot.duration}</p>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Time Slot
            </Button>
          </Card>

          {/* Quick Stats */}
          <Card title="This Week" className="animate-fade-in-up animate-delay-200">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Working Days</p>
                  <CalendarDaysIcon className="h-5 w-5 text-[#1ABC9C]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {availability.filter(d => d.enabled).length}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <ClockIcon className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">40</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Appointments</p>
                  <CheckCircleIcon className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
