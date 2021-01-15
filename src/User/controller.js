const asyncHandler = require("express-async-handler");
const { User, Department, Team } = require("./model");
const { comparePassword, generateToken } = require("../../utils/helper");

const login = asyncHandler(async (req, res) => {
  try {
    const { user_name, user_pass } = req.body
    let user = await User.findOne({ user_name });
    if (!user) return res.send({ status: 0, message: "Wrong username!!!" });
    if (!comparePassword(user.user_pass, user_pass)) return res.status(200).send({ status: 0, message: "Wrong passwords!!!" });
    const token = generateToken(user);
    res.send({
      status: true,
      data: { token },
    })
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
});

const getListUser = asyncHandler(async (req, res) => {
  try {
    let { page, limit } = req.query;
    if (!page || !limit) {
      User.find({}, "-user_name -user_pass").populate(
        {
          path: "department",
          populate: {
            path: "teams"
          }
        }
      ).then((data) => {
        res.send({ status: 1, data });
      });
    } else {
      let { page = 1, limit = 10 } = req.query;
      limit = Math.max(limit);
      page = Math.max(page);
      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        select: "-user_name -user_pass",
        customLabels: { docs: "data" },
        populate: {
          path: "department",
          populate: {
            path: "teams"
          }
        }
      };
      User.paginate({}, options).then((result) => {
        const data = { status: true, ...result };
        res.send(data);
      });
    }
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
});

const getListUserAllDepartment = asyncHandler(async (req, res) => {
  try {
    await Department.find().populate(
      {
        path: "teams",
        populate: { path: "users" },
      }
    ).then((data) => {
      res.send({ status: 1, data });
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
})

const getListUserByDepartmentId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findOne({ _id: id }).populate(
      {
        path: "teams",
        populate: { path: "users" }
      }
    ).then((data) => {
      res.send({ status: 1, data });
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
});

const getListUserAllTeam = asyncHandler(async (req, res) => {
  try {
    await Team.find().populate({ path: "users" })
      .then((data) => {
        res.send({ status: 1, data });
      });
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
})

const getListUserByTeamId = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Team.findOne({ _id: id }).populate({ path: "users" })
      .then((data) => {
        res.send({ status: 1, data });
      });
  } catch (error) {
    res.send({
      status: false,
      message: error.message
    })
  }
})

module.exports = {
  login,
  getListUser,
  getListUserAllDepartment,
  getListUserByDepartmentId,
  getListUserAllTeam,
  getListUserByTeamId
};