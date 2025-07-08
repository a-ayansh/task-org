import { Todo } from "../models/todo.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Create a new todo
// @route   POST /api/todos
export const createTodo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { text, description, priority, dueDate, pinned } = req.body;

  if (!text) throw new ApiError(400, "Todo text is required");

  const todo = await Todo.create({
    user: userId,
    text,
    description,
    priority,
    dueDate,
    pinned,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
export const getUserTodos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const todos = await Todo.find({ user: userId }).sort({
    pinned: -1,
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos fetched successfully"));
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
export const updateTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user._id;

  const todo = await Todo.findOne({ _id: todoId, user: userId });
  if (!todo) throw new ApiError(404, "Todo not found");

  const updatedFields = req.body;
  Object.assign(todo, updatedFields);

  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
export const deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user._id;

  const deleted = await Todo.findOneAndDelete({ _id: todoId, user: userId });
  if (!deleted) throw new ApiError(404, "Todo not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Todo deleted successfully"));
});

// @desc    Get todos by date
// @route   GET /api/todos/by-date?date=YYYY-MM-DD
export const getTodosByDate = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const dateParam = req.query.date;

  if (!dateParam) {
    throw new ApiError(400, "Date query parameter is required");
  }

  const startOfDay = new Date(dateParam);
  const endOfDay = new Date(dateParam);
  endOfDay.setHours(23, 59, 59, 999);

  const todos = await Todo.find({
    user: userId,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ pinned: -1, createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, todos, "Todos for selected date fetched successfully")
    );
});

// @desc    Delete all completed todos
// @route   DELETE /api/todos/completed
export const deleteCompletedTodos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Todo.deleteMany({ user: userId, completed: true });

  return res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      "Completed todos deleted successfully"
    )
  );
});
