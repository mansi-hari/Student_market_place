const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    sellerUniversity: { type: String, required: true }, // Changed to sellerUniversity
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' }, // Replaced isAdmin with role
    createdAt: { type: Date, default: Date.now },
    location: {
      formatted: { type: String, default: "" },
      pinCode: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return v === "201007";
          },
          message: "This service is only available for Mohan Nagar, Ghaziabad (PIN: 201007).",
        },
      },
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
      },
    },
    
  },
  { timestamps: true }
);

userSchema.plugin(mongooseAggregatePaginate);
userSchema.index({ "location.pinCode": 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;