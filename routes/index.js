const router = require("express").Router();
const { NotFoundError } = require("../customErrors/not-found-error");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserAuth,
  validateInfoBody,
} = require("../middlewares/validation");

router.post("/signup", validateInfoBody, createUser);
router.post("/signin", validateUserAuth, login);

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
