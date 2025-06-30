import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react';

const Main = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Start with today's date
  const [view, setView] = useState('Week');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Morning Standup',
      start: '9:00 AM',
      end: '10:00 AM',
      date: new Date().toISOString().split('T')[0], // Today's date
      color: 'bg-blue-200 border-blue-400',
      textColor: 'text-blue-700'
    },
    {
      id: 2,
      title: 'Team Meeting',
      start: '2:00 PM',
      end: '3:00 PM',
      date: new Date().toISOString().split('T')[0], // Today's date
      color: 'bg-green-200 border-green-400',
      textColor: 'text-green-700'
    }
  ]);
  
  const [upcomingEvents] = useState([
    { date: getFormattedDate(new Date()), time: '9:30 - 10:00 AM', title: 'Daily Standup', temp: '72°/58°' },
    { date: getFormattedDate(getTomorrowDate()), time: '10:00 - 11:00 AM', title: 'Project Review', temp: '74°/60°' },
    { date: getFormattedDate(getTomorrowDate()), time: '2:00 - 3:00 PM', title: 'Client Call', temp: '74°/60°' },
    { date: getFormattedDate(getDateInDays(2)), time: '9:00 - 10:00 AM', title: 'Sprint Planning', temp: '70°/55°' },
    { date: getFormattedDate(getDateInDays(2)), time: '11:00 - 12:00 PM', title: 'Design Review', temp: '70°/55°' },
    { date: getFormattedDate(getDateInDays(2)), time: '3:00 - 4:00 PM', title: 'Team Retrospective', temp: '70°/55°' },
    { date: getFormattedDate(getDateInDays(3)), time: '10:00 - 11:00 AM', title: 'Stakeholder Meeting', temp: '68°/52°' },
    { date: getFormattedDate(getDateInDays(4)), time: '1:00 - 2:00 PM', title: 'Product Demo', temp: '75°/62°' },
    { date: getFormattedDate(getDateInDays(4)), time: '4:00 - 5:00 PM', title: 'Weekly Wrap-up', temp: '75°/62°' }
  ]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    start: '',
    end: '',
    date: '',
    color: 'bg-blue-200 border-blue-400',
    textColor: 'text-blue-700'
  });

  const colorOptions = [
    { bg: 'bg-blue-200 border-blue-400', text: 'text-blue-700', name: 'Blue' },
    { bg: 'bg-green-200 border-green-400', text: 'text-green-700', name: 'Green' },
    { bg: 'bg-orange-200 border-orange-400', text: 'text-orange-700', name: 'Orange' },
    { bg: 'bg-purple-200 border-purple-400', text: 'text-purple-700', name: 'Purple' },
    { bg: 'bg-red-200 border-red-400', text: 'text-red-700', name: 'Red' },
    { bg: 'bg-yellow-200 border-yellow-400', text: 'text-yellow-700', name: 'Yellow' }
  ];

  const timeSlots = [
    '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
  ];

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Helper functions for date manipulation
  function getFormattedDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  function getDateInDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekDates = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(formatDate(date));
    }
    return dates;
  };

  const getWeekDatesDisplay = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.getDate().toString());
    }
    return dates;
  };

  const weekDatesList = getWeekDates();
  const weekDatesDisplay = getWeekDatesDisplay();

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  const getEventStyle = (event, timeSlot) => {
    const startHour = parseInt(event.start.split(':')[0]);
    const startPeriod = event.start.includes('PM') ? 'PM' : 'AM';
    const endHour = parseInt(event.end.split(':')[0]);
    const endPeriod = event.end.includes('PM') ? 'PM' : 'AM';
    
    let start24 = startHour;
    if (startPeriod === 'PM' && startHour !== 12) start24 += 12;
    if (startPeriod === 'AM' && startHour === 12) start24 = 0;
    
    let end24 = endHour;
    if (endPeriod === 'PM' && endHour !== 12) end24 += 12;
    if (endPeriod === 'AM' && endHour === 12) end24 = 0;
    
    const slotHour = timeSlot === '12 PM' ? 12 : 
                   timeSlot.includes('PM') ? parseInt(timeSlot) + 12 : 
                   parseInt(timeSlot);
    
    if (slotHour >= start24 && slotHour < end24) {
      const duration = end24 - start24;
      const height = duration * 60 - 4; // 60px per hour minus margin
      return {
        height: `${height}px`,
        position: 'absolute',
        top: '2px',
        left: '2px',
        right: '2px',
        zIndex: 10
      };
    }
    return null;
  };

  const handleTimeSlotClick = (date, timeSlot) => {
    setSelectedTimeSlot({ date, timeSlot });
    setEventForm({
      title: '',
      start: timeSlot,
      end: getNextHour(timeSlot),
      date: date,
      color: 'bg-blue-200 border-blue-400',
      textColor: 'text-blue-700'
    });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const getNextHour = (timeSlot) => {
    const hour = parseInt(timeSlot);
    const isPM = timeSlot.includes('PM');
    const nextHour = hour + 1;
    
    if (hour === 12 && !isPM) return '1 PM';
    if (hour === 11 && !isPM) return '12 PM';
    if (hour === 12 && isPM) return '1 PM';
    if (hour === 11 && isPM) return '12 AM';
    
    return `${nextHour} ${isPM ? 'PM' : 'AM'}`;
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      start: event.start,
      end: event.end,
      date: event.date,
      color: event.color,
      textColor: event.textColor
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title.trim()) return;

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventForm }
          : event
      ));
    } else {
      const newEvent = {
        id: Date.now(),
        ...eventForm
      };
      setEvents([...events, newEvent]);
    }
    
    setShowEventModal(false);
    resetForm();
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter(event => event.id !== editingEvent.id));
      setShowEventModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      start: '',
      end: '',
      date: '',
      color: 'bg-blue-200 border-blue-400',
      textColor: 'text-blue-700'
    });
    setEditingEvent(null);
    setSelectedTimeSlot(null);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    resetForm();
  };

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Get mini calendar days
  const getMiniCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        date: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        fullDate: date
      });
    }
    return days;
  };

  const miniCalendarDays = getMiniCalendarDays();

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 text-white p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Plus className="w-5 h-5 text-gray-400" />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <ChevronLeft 
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" 
            onClick={goToPreviousWeek}
          />
          <div>
            <span 
              className="text-gray-400 cursor-pointer hover:text-white"
              onClick={goToToday}
            >
              Today
            </span>
          </div>
          <ChevronRight 
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" 
            onClick={goToNextWeek}
          />
        </div>

        <h2 className="text-2xl font-light mb-6">
          {getCurrentMonthYear().split(' ')[0]} <span className="text-red-400">{getCurrentMonthYear().split(' ')[1]}</span>
        </h2>

        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center p-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {miniCalendarDays.map((day, i) => (
              <div 
                key={i} 
                className={`text-center p-1 cursor-pointer rounded ${
                  day.isToday 
                    ? 'bg-blue-600 text-white' 
                    : day.isCurrentMonth 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-600'
                }`}
                onClick={() => setCurrentDate(day.fullDate)}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Events */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <span className="text-purple-400 font-medium">TODAY</span>
            <span className="text-gray-400 ml-2 text-sm">{getFormattedDate(new Date())}</span>
            <span className="text-yellow-400 ml-auto text-sm">72°/58° ☀️</span>
          </div>
          {getEventsForDate(formatDate(new Date())).length > 0 ? (
            getEventsForDate(formatDate(new Date())).map(event => (
              <div key={event.id} className="bg-purple-600 rounded-lg p-3 mb-2">
                <div className="text-sm">{event.title}</div>
                <div className="text-xs text-purple-200">{event.start} - {event.end}</div>
              </div>
            ))
          ) : (
            <div className="bg-purple-600 rounded-lg p-3 mb-2">
              <div className="text-sm">No events today</div>
              <div className="text-xs text-purple-200">Click on the calendar to add events</div>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="text-gray-400 font-medium mb-3">TOMORROW {getFormattedDate(getTomorrowDate())}</div>
          <div className="space-y-2 text-sm">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{event.time}</div>
                  <div className="text-white">{event.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More upcoming events */}
        <div className="mt-4">
          <div className="text-gray-400 font-medium mb-3">UPCOMING</div>
          <div className="space-y-2 text-sm">
            {upcomingEvents.slice(3, 6).map((event, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{event.time}</div>
                  <div className="text-white text-xs">{event.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 rounded ${view === 'Day' ? 'bg-white shadow' : ''}`}
                  onClick={() => setView('Day')}
                >
                  Day
                </button>
                <button 
                  className={`px-3 py-1 rounded ${view === 'Week' ? 'bg-red-500 text-white' : ''}`}
                  onClick={() => setView('Week')}
                >
                  Week
                </button>
                <button 
                  className={`px-3 py-1 rounded ${view === 'Month' ? 'bg-white shadow' : ''}`}
                  onClick={() => setView('Month')}
                >
                  Month
                </button>
                <button 
                  className={`px-3 py-1 rounded ${view === 'Year' ? 'bg-white shadow' : ''}`}
                  onClick={() => setView('Year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Today
              </button>
              <input 
                type="text" 
                placeholder="Search" 
                className="px-3 py-1 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8 h-full">
            {/* Time Column */}
            <div className="border-r bg-gray-50">
              <div className="h-16 border-b"></div>
              {timeSlots.map((time, index) => (
                <div key={time} className="h-16 border-b flex items-start justify-end pr-2 pt-1">
                  <span className="text-sm text-gray-500">{time}</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={day} className="border-r">
                {/* Header */}
                <div className="h-16 border-b bg-gray-50 flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-500 font-medium">{day}</div>
                  <div className={`text-lg font-medium ${isToday(weekDatesList[dayIndex]) ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center' : ''}`}>
                    {weekDatesDisplay[dayIndex]}
                  </div>
                </div>

                {/* Time Slots */}
                {timeSlots.map((timeSlot, timeIndex) => {
                  const currentDate = weekDatesList[dayIndex];
                  const dayEvents = getEventsForDate(currentDate);
                  const eventsInSlot = dayEvents.filter(event => {
                    const eventStyle = getEventStyle(event, timeSlot);
                    return eventStyle !== null;
                  });

                  return (
                    <div 
                      key={`${day}-${timeSlot}`} 
                      className="h-16 border-b relative hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTimeSlotClick(currentDate, timeSlot)}
                    >
                      {eventsInSlot.map(event => {
                        const style = getEventStyle(event, timeSlot);
                        if (!style) return null;
                        
                        return (
                          <div
                            key={event.id}
                            className={`${event.color} border-l-4 rounded-r-lg p-2 cursor-pointer hover:shadow-md transition-shadow`}
                            style={style}
                            onClick={(e) => handleEventClick(event, e)}
                          >
                            <div className={`text-xs font-medium ${event.textColor}`}>
                              {event.start}
                            </div>
                            <div className={`text-sm font-medium ${event.textColor}`}>
                              {event.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h3>
              <button onClick={handleCloseModal}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="text"
                    value={eventForm.start}
                    onChange={(e) => setEventForm({...eventForm, start: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="9:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="text"
                    value={eventForm.end}
                    onChange={(e) => setEventForm({...eventForm, end: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setEventForm({
                        ...eventForm, 
                        color: color.bg, 
                        textColor: color.text
                      })}
                      className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                        eventForm.color === color.bg ? 'border-gray-800' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div>
                {editingEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;