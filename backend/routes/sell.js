const SellItem = require("../models/SellItem");

const sellItemPage=async (req,res)=>{
    
}
const listItem = async (req, res) => {
  try {
    const { title, category, price, description, condition, tags, location, negotiable } = req.body;
    
    // Creating a new item
    const newItem = new SellItem({
      title,
      category,
      price,
      description,
      condition,
      tags: tags.split(","),
      location,
      negotiable,
      photos: req.files.map(file => file.path), // Save file paths of the uploaded images
    });

    // Save the item in the database
    const savedItem = await newItem.save();
    return res.status(201).json({ message: "Item listed successfully!", item: savedItem });
  } catch (error) {
    console.error("Error listing item:", error);
    return res.status(500).json({ message: "Error listing item. Please try again." });
  }
};

module.exports = {
  listItem,
};
