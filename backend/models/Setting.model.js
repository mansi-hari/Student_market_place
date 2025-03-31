const mongoose = require("mongoose")

const SettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Student Marketplace",
    },
    siteDescription: {
      type: String,
      default: "Buy and sell items within your campus community",
    },
    contactEmail: {
      type: String,
      default: "support@studentmarketplace.com",
    },
    featuredProductsLimit: {
      type: Number,
      default: 8,
    },
    allowUserRegistration: {
      type: Boolean,
      default: true,
    },
    requireEmailVerification: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Setting", SettingSchema)

