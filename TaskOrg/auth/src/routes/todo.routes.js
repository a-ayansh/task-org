import { Router } from 'express';
import {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo,
  getTodosByDate,
  deleteCompletedTodos,
} from "../controller/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all todo routes

// GET all todos / POST new todo
router.route("/")
  .get(getUserTodos)
  .post(createTodo);

// GET todos by specific date (query param)
router.route("/by-date").get(getTodosByDate);

// DELETE all completed todos
router.route("/completed").delete(deleteCompletedTodos);


router.route("/:id")
  .put(updateTodo)
  .delete(deleteTodo);

export default router;
