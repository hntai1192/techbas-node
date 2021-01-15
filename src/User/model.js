const mongoose = require("mongoose");
const { Schema } = mongoose
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema(
  {
    user_name: {
      type: String,
      unique: true,
      trim: true,
      required: [true],
    },
    user_pass: {
      type: String,
      trim: true,
      minlength: [6, "ít nhất 6 ký tự"],
      required: [true],
    },
    user_fullname: {
      type: String,
      trim: true,
      required: [true],
    },
    user_role: {
      type: String,
      trim: true,
      required: [true],
      enum: ["DIRECTION", "ADMIN", "MEMBER"]
    },
    department_id: {
      type: Schema.Types.ObjectId,
      ref: 'Department'
    },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);
UserSchema.virtual("department", {
  ref: 'Department',
  localField: 'department_id',
  foreignField: '_id',
  justOne: true
})

const DepartmentSchema = Schema(
  {
    department_name: {
      type: String,
      trim: true,
      required: [true],
    },
    team_ids: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);
DepartmentSchema.virtual("teams", {
  ref: 'Team',
  localField: 'team_ids',
  foreignField: '_id',
})

const TeamSchema = Schema(
  {
    team_name: {
      type: String,
      trim: true,
      required: [true],
    },
    user_ids: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);
TeamSchema.virtual("users", {
  ref: 'User',
  localField: 'user_ids',
  foreignField: '_id',
})


UserSchema.plugin(mongoosePaginate);
DepartmentSchema.plugin(mongoosePaginate);
TeamSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);
const Department = mongoose.model("Department", DepartmentSchema);
const Team = mongoose.model("Team", TeamSchema);

User.createIndexes();
Department.createIndexes();
Team.createIndexes();

module.exports = { User, Department, Team };
