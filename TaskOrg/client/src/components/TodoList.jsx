import React, { useState } from "react";
import { Edit3, Trash2, MoreHorizontal, Pin, PinOff } from "lucide-react";

function TodoItem({ todo, onToggleComplete, onDeleteTodo, onUpdateTodo, onTogglePin }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSave = () => {
    onUpdateTodo(todo._id, {
      ...todo,
      text: editText,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !todo.completed;
  };

  return (
    <div className={`group bg-[#3a3d4a] hover:bg-[#404350] rounded-lg p-4 transition-all duration-200 relative ${todo.pinned ? 'ring-2 ring-yellow-500' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Priority Indicator */}
        <div className={`w-1 h-6 rounded-full mt-1 ${
          todo.priority === "high" ? "bg-red-500" :
          isOverdue(todo.dueDate) ? "bg-orange-500" :
          "bg-transparent"
        }`}></div>

        {/* Pin Indicator */}
        {todo.pinned && (
          <div className="absolute top-2 right-2 text-yellow-500">
            <Pin size={12} fill="currentColor" />
          </div>
        )}

        {/* Checkbox */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleComplete(todo._id)}
            className="sr-only"
            disabled={isEditing}
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
            todo.completed ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-gray-400"
          }`}>
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-[#2a2d3a] text-white px-3 py-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add description..."
                className="w-full bg-[#2a2d3a] text-gray-300 px-3 py-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-white font-medium transition-colors duration-200 ${
                todo.completed ? "line-through opacity-60" : ""
              }`}>
                {todo.text}
              </p>
              {todo.description && (
                <p className="text-gray-400 text-sm mt-1">{todo.description}</p>
              )}
              {todo.dueDate && (
                <div className={`text-xs mt-1 flex items-center space-x-1 ${
                  isOverdue(todo.dueDate) ? "text-orange-400" : "text-gray-500"
                }`}>
                  <span>📅</span>
                  <span>{formatDate(todo.dueDate)}</span>
                  {isOverdue(todo.dueDate) && (
                    <span className="text-orange-400">(Overdue)</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white transition-all duration-200 rounded-md hover:bg-[#4a4d5a]"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-[#1a1d2a] border border-gray-600 rounded-lg shadow-xl z-10 py-2 min-w-[120px]">
                <button
                  onClick={() => {
                    onTogglePin(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2a2d3a] hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  {todo.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                  <span>{todo.pinned ? 'Unpin' : 'Pin'}</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#2a2d3a] hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDeleteTodo(todo._id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-[#2a2d3a] hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)}></div>
      )}
    </div>
  );
}

function TodoList({ todos, onToggleComplete, onDeleteTodo, onUpdateTodo, onTogglePin }) {
  return (
    <div className="px-8 pb-8 space-y-1">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          onTogglePin={onTogglePin}
        />
      ))}
      {todos.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No todos for this date
        </div>
      )}
    </div>
  );
}

export default TodoList;
