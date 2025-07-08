import React, { useEffect, useState } from "react";
import { User, Pin, Trash2, LogOut } from "lucide-react";
import DateSidebar from "./components/DateSidebar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { Login, Signup } from "./components/Auth";
import { useUserContext } from "./context/UserContext"; 
import { useAxiosPrivate } from "./api/axiosPrivate";   

function App() {
  const { user, setUser, logoutUser } = useUserContext(); 
  const axiosPrivate = useAxiosPrivate(); 

  const [authView, setAuthView] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchTodos = async () => {
      try {
        const res = await axiosPrivate.get("/todos");
        setTodos(res.data.data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      }
    };
    fetchTodos();
  }, [user]);

  const handleLogin = (userData) => setUser(userData);
  const handleSignup = (userData) => setUser(userData);

  const handleLogout = () => {
    logoutUser(); 
    setShowUserMenu(false);
  };

  const addTodo = async (newTodo) => {
    try {
      const res = await axiosPrivate.post("/todos", {
        ...newTodo,
        dueDate: selectedDate,
      });
      setTodos([res.data.data, ...todos]);
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const res = await axiosPrivate.put(`/todos/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo._id === id ? res.data.data : todo)));
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axiosPrivate.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const toggleComplete = (id) => {
    const todo = todos.find((t) => t._id === id);
    updateTodo(id, { completed: !todo.completed });
  };

  const togglePin = (id) => {
    const todo = todos.find((t) => t._id === id);
    updateTodo(id, { pinned: !todo.pinned });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSidebarOpen(false);
  };

  const getFilteredTodos = () => {
    if (!selectedDate) return todos;
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate.toDateString() === selectedDate.toDateString();
    });
  };

  const sortedTodos = getFilteredTodos().sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const clearCompleted = async () => {
    try {
      await axiosPrivate.delete("/todos/completed");
      setTodos(todos.filter((todo) => !todo.completed));
    } catch (err) {
      console.error("Failed to clear completed todos", err);
    }
  };

  const getDateHeaderText = () => {
    if (!selectedDate) return "Select a date";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    if (selectedDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(" ");
    return parts.map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!user) {
    return authView === "login" ? (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <Signup onSignup={handleSignup} onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  return (
    <div className="min-h-screen bg-[#3a3d4a] p-6">
      <DateSidebar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        todos={todos}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h2 className="text-lg font-medium">Welcome back, {user.name}!</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-lg text-white font-medium text-sm"
            >
              {getInitials(user.name)}
            </button>

            {showUserMenu && (
              <>
                <div className="absolute right-0 top-12 bg-[#2a2d3a] border border-gray-600 rounded-lg shadow-xl z-20 py-2 min-w-[160px]">
                  <div className="px-4 py-2 border-b border-gray-600">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => setShowUserMenu(false)} className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#3a3d4a] hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <User size={14} />
                    <span>Profile Settings</span>
                  </button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-400 hover:bg-[#3a3d4a] hover:text-red-300 transition-colors duration-200 flex items-center space-x-2">
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#2a2d3a] rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 text-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <h1 className="text-3xl font-light text-white mb-2">{getDateHeaderText()}</h1>
              <p className="text-gray-400 text-sm">
                {selectedDate?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </button>
          </div>

          <TodoForm onAddTodo={addTodo} selectedDate={selectedDate} />

          <TodoList
            todos={sortedTodos}
            onToggleComplete={toggleComplete}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
            onTogglePin={togglePin}
          />

          <div className="px-8 py-4 border-t border-gray-600">
            <div className="flex justify-center space-x-8 text-gray-400">
              <button
                onClick={() => {
                  const incomplete = sortedTodos.filter((t) => !t.completed);
                  if (incomplete.length > 0) togglePin(incomplete[0]._id);
                }}
                className="hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <Pin size={16} />
                <span className="text-sm">Pin to top</span>
              </button>
              <button
                onClick={clearCompleted}
                className="hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span className="text-sm">Clear completed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
