import React, { useState, useEffect } from "react";
import { useAxiosPrivate } from "../api/axiosPrivate";
import { useUserContext } from "../context/UserContext"; 

function TodoForm({ onAddTodo, selectedDate }) {
  const axiosPrivate = useAxiosPrivate();
  const { accessToken, user, isLoading } = useUserContext(); // Add user and isLoading if available

  const [text, setText] = useState("");

  // Debug logging
  useEffect(() => {
    console.log("UserContext Debug:", {
      accessToken: accessToken ? "Present" : "Missing",
      user: user || "No user",
      isLoading: isLoading || "Not loading"
    });
  }, [accessToken, user, isLoading]);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDueDate(formattedDate);
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    // Check if user is authenticated
    if (!accessToken) {
      console.warn("Access token not available. Please log in.");
      // You could show a toast notification or redirect to login here
      return;
    }

    setIsSubmitting(true);

    const newTodo = {
      text: text.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
    };

    try {
      const res = await axiosPrivate.post("/todos", newTodo);
      console.log("Todo created:", res.data);
      onAddTodo(res.data.data); 

      // Reset form
      setText("");
      setDescription("");
      setPriority("normal");
    } catch (err) {
      console.error("Error adding todo:", err.response?.data || err.message);
      // Handle specific error cases
      if (err.response?.status === 401) {
        console.error("Authentication failed. Please log in again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state if context is still loading
  if (isLoading) {
    return (
      <div className="px-8 py-4 border-b border-gray-600">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show login prompt if no access token
  if (!accessToken) {
    return (
      <div className="px-8 py-4 border-b border-gray-600">
        <div className="text-gray-400">Please log in to add todos.</div>
      </div>
    );
  }

  return (
    <div className="px-8 py-4 border-b border-gray-600">
      <div className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isSubmitting && handleSubmit(e)}
          placeholder="Add a new task..."
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg"
          disabled={isSubmitting}
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description (optional)..."
          className="w-full bg-transparent border-none outline-none text-gray-300 placeholder-gray-500 text-sm"
          disabled={isSubmitting}
        />
        <div className="flex space-x-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1"
            disabled={isSubmitting}
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-1 rounded text-sm transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoForm;