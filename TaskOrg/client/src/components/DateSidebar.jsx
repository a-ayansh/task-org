import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

function DateSidebar({ selectedDate, onDateSelect, todos, isOpen, onToggle }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTodoCountForDate = (date) => {
    if (!date) return 0;
    return todos.filter((todo) => {
      const todoDate = new Date(todo.dueDate || new Date());
      return todoDate.toDateString() === date.toDateString();
    }).length;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split("T")[0];
  };

  const isSelectedDate = (date) => {
    if (!date || !selectedDate) return false;
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getUniqueTodoDates = () => {
    const dates = new Set();
    todos.forEach((todo) => {
      if (todo.dueDate) {
        const date = new Date(todo.dueDate);
        dates.add(date.toDateString());
      }
    });

    const sortedDates = Array.from(dates).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    return sortedDates.map((dateString) => new Date(dateString));
  };

  const uniqueTodoDates = getUniqueTodoDates();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-20 w-10 h-10 bg-[#2a2d3a] hover:bg-[#3a3d4a] rounded-lg flex items-center justify-center text-white transition-colors duration-200 shadow-lg"
      >
        <Calendar size={18} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-[#2a2d3a] border-r border-gray-600 transform transition-transform duration-300 z-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-16">
          <div className="px-4 py-3 border-b border-gray-600">
            <h2 className="text-white font-medium">Select Date</h2>
          </div>

          {/* Todo Dates Section */}
          {uniqueTodoDates.length > 0 && (
            <div className="p-4 border-b border-gray-600">
              <h3 className="text-white text-sm font-medium mb-3">
                Dates with Todos
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {uniqueTodoDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => onDateSelect(date)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors flex justify-between items-center ${
                      isSelectedDate(date)
                        ? "bg-red-500 text-white"
                        : "text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <span>
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getTodoCountForDate(date)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-medium text-white">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-gray-600 rounded"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-xs text-gray-400 text-center p-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && onDateSelect(day)}
                  disabled={!day}
                  className={`p-2 text-sm rounded hover:bg-gray-600 transition-colors relative ${
                    !day ? "invisible" : ""
                  } ${
                    isSelectedDate(day)
                      ? "bg-red-500 text-white"
                      : "text-gray-300"
                  } ${
                    day && day.toDateString() === new Date().toDateString()
                      ? "ring-1 ring-blue-400"
                      : ""
                  }`}
                >
                  {day?.getDate()}
                  {day && getTodoCountForDate(day) > 0 && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={onToggle}
        ></div>
      )}
    </>
  );
}

export default DateSidebar;
