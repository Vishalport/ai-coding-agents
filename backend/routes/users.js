const express          = require("express");
const Response         = require("../helpers/Response");
const { formatUser }   = require("../helpers/userHelper");
const { UserStatus }   = require("../enums/appEnums");
const { users }        = require("../data/data.json");

const router = express.Router();

/**
 * @route  GET /api/users
 * @desc   Returns all users (password stripped)
 */
router.get("/", (req, res) => {
  try {
    const result = users.filter(u => u.status === UserStatus.ACTIVE || u.status === UserStatus.PENDING || u.status === UserStatus.INACTIVE);
    return res.json(Response.success(result.map(formatUser), "Users fetched successfully"));
  } catch (err) {
    console.error("[GET /users]", err.message);
    return res.json(Response.internalServerError(null, "Server error"));
  }
});

/**
 * @route  GET /api/users/:id
 * @desc   Returns a single user by ID
 */
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.json(Response.badRequest(null, "User ID is required"));

    const user = users.find(u => u.id === id);
    if (!user) return res.json(Response.notFound(null, "User not found"));

    return res.json(Response.success(formatUser(user), "User fetched successfully"));
  } catch (err) {
    console.error("[GET /users/:id]", err.message);
    return res.json(Response.internalServerError(null, "Server error"));
  }
});

module.exports = router;
