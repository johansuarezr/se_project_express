const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
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
  next(new NOT_FOUND("Route not found"));
});

module.exports = router;
