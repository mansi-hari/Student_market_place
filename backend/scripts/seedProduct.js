const mongoose = require("mongoose")
const Product = require("../models/Product.model")
const User = require("../models/User.model")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Sample seller data
const sampleSellers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    university: "MIT",
    phone: "9876543210",
    location: {
      formatted: "Cambridge, MA",
      pinCode: "02142",
    },
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    university: "Harvard",
    phone: "9876543211",
    location: {
      formatted: "Cambridge, MA",
      pinCode: "02138",
    },
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "password123",
    university: "Stanford",
    phone: "9876543212",
    location: {
      formatted: "Palo Alto, CA",
      pinCode: "94305",
    },
  },
]

// Sample product data by category
const sampleProducts = {
  books: [
    {
      title: "Introduction to Algorithms",
      description:
        "A comprehensive textbook covering various algorithms and data structures. Perfect for computer science students.",
      price: 45.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/41T0iBxY8FL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["computer science", "algorithms", "programming"],
    },
    {
      title: "Calculus: Early Transcendentals",
      description: "The standard textbook for Calculus courses. Includes all topics from limits to multiple integrals.",
      price: 39.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/51f5x4+cQiL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["mathematics", "calculus", "engineering"],
    },
    {
      title: "Organic Chemistry",
      description: "Comprehensive guide to organic chemistry with practice problems and solutions.",
      price: 42.5,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/51Kevm3ItJL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["chemistry", "organic chemistry", "science"],
    },
    {
      title: "Physics for Scientists and Engineers",
      description: "Covers all aspects of physics with a focus on applications in science and engineering.",
      price: 48.75,
      condition: "Acceptable",
      images: ["https://m.media-amazon.com/images/I/51+T6AvbUOL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["physics", "engineering", "science"],
    },
    {
      title: "Principles of Economics",
      description: "Introductory economics textbook covering both microeconomics and macroeconomics.",
      price: 35.25,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/51MGfBYv6HL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["economics", "business", "social science"],
    },
    {
      title: "Campbell Biology",
      description: "The most popular college biology textbook covering all aspects of modern biology.",
      price: 52.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/51GfNXjG6rL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["biology", "science", "medicine"],
    },
    {
      title: "Psychology: An Introduction",
      description: "Comprehensive introduction to the field of psychology with the latest research.",
      price: 32.5,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/51Sn8PEXwcL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Textbooks",
      tags: ["psychology", "social science", "behavioral science"],
    },
    {
      title: "A Brief History of Time",
      description: "Stephen Hawking's landmark work on cosmology and the nature of the universe.",
      price: 15.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/51+GySc8ExL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Popular Science",
      tags: ["physics", "cosmology", "science"],
    },
    {
      title: "To Kill a Mockingbird",
      description: "Harper Lee's classic novel about racial injustice in the American South.",
      price: 12.5,
      condition: "Acceptable",
      images: ["https://m.media-amazon.com/images/I/51IXWZzlgSL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Fiction",
      tags: ["literature", "fiction", "classics"],
    },
    {
      title: "The Great Gatsby",
      description: "F. Scott Fitzgerald's masterpiece depicting the Jazz Age in America.",
      price: 10.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/41iers+HLSL._SX258_BO1,204,203,200_.jpg"],
      category: "Books",
      subcategory: "Fiction",
      tags: ["literature", "fiction", "classics"],
    },
  ],
  electronics: [
    {
      title: "TI-84 Plus Graphing Calculator",
      description: "Essential graphing calculator for math, science, and engineering courses.",
      price: 89.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71yrLllDokL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Calculators",
      tags: ["calculator", "math", "engineering"],
    },
    {
      title: "Logitech MX Master 3 Mouse",
      description: "Advanced wireless mouse with customizable buttons and ergonomic design.",
      price: 65.5,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Computer Accessories",
      tags: ["mouse", "computer", "accessories"],
    },
    {
      title: "Sony WH-1000XM4 Headphones",
      description: "Premium noise-canceling headphones with excellent sound quality.",
      price: 199.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Audio",
      tags: ["headphones", "audio", "noise-canceling"],
    },
    {
      title: "Anker PowerCore 10000 Power Bank",
      description: "Compact portable charger with 10000mAh capacity for smartphones and tablets.",
      price: 25.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71titiLRs9L._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Mobile Accessories",
      tags: ["power bank", "charger", "mobile"],
    },
    {
      title: "Samsung T7 Portable SSD 1TB",
      description: "Fast external SSD for storing and transferring large files.",
      price: 119.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/81oir3+TakL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Storage",
      tags: ["ssd", "storage", "external drive"],
    },
    {
      title: "Blue Yeti USB Microphone",
      description: "Professional USB microphone for podcasting, streaming, and recording.",
      price: 89.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/61rJiv9XDKL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Audio",
      tags: ["microphone", "audio", "recording"],
    },
    {
      title: "Kindle Paperwhite",
      description: "Waterproof e-reader with adjustable light and weeks of battery life.",
      price: 99.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61Ww4abGxwL._AC_SL1000_.jpg"],
      category: "Electronics",
      subcategory: "E-readers",
      tags: ["kindle", "e-reader", "books"],
    },
    {
      title: "Logitech C920x HD Webcam",
      description: "Full HD webcam for video calls, streaming, and recording.",
      price: 59.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71iNwni9TsL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Computer Accessories",
      tags: ["webcam", "video", "streaming"],
    },
    {
      title: "JBL Flip 5 Bluetooth Speaker",
      description: "Portable waterproof Bluetooth speaker with powerful sound.",
      price: 79.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/61Zg-PJvOKL._AC_SL1200_.jpg"],
      category: "Electronics",
      subcategory: "Audio",
      tags: ["speaker", "bluetooth", "audio"],
    },
    {
      title: "Wacom Intuos Drawing Tablet",
      description: "Digital drawing tablet for art, design, and photo editing.",
      price: 69.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/61OkBPpr0BL._AC_SL1500_.jpg"],
      category: "Electronics",
      subcategory: "Computer Accessories",
      tags: ["drawing tablet", "art", "design"],
    },
  ],
  furniture: [
    {
      title: "Adjustable Desk Lamp",
      description: "LED desk lamp with adjustable brightness and color temperature.",
      price: 29.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61nuuPxUvaL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Lighting",
      tags: ["lamp", "desk", "lighting"],
    },
    {
      title: "Ergonomic Office Chair",
      description: "Comfortable office chair with lumbar support and adjustable height.",
      price: 89.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71+7Mhby3HL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Chairs",
      tags: ["chair", "office", "ergonomic"],
    },
    {
      title: "Folding Desk",
      description: "Space-saving folding desk for small apartments and dorm rooms.",
      price: 59.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71Tg5a1PxJL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Desks",
      tags: ["desk", "folding", "space-saving"],
    },
    {
      title: "Bookshelf",
      description: "5-tier bookshelf for organizing books, textbooks, and decorative items.",
      price: 49.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71eXNIDUGjL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Storage",
      tags: ["bookshelf", "storage", "organization"],
    },
    {
      title: "Futon Sofa Bed",
      description: "Convertible futon that transforms from sofa to bed for guests.",
      price: 149.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/81etXQc4PHL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Sofas",
      tags: ["futon", "sofa", "bed"],
    },
    {
      title: "Bedside Table",
      description: "Compact nightstand with drawer and shelf for bedroom storage.",
      price: 39.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71Yw0Yzx3FL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Bedroom",
      tags: ["nightstand", "bedroom", "storage"],
    },
    {
      title: "Floor Lamp",
      description: "Modern standing lamp with adjustable brightness for living room or bedroom.",
      price: 45.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61R2TvlZhgL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Lighting",
      tags: ["lamp", "floor lamp", "lighting"],
    },
    {
      title: "Storage Ottoman",
      description: "Multipurpose ottoman with hidden storage space and padded seat.",
      price: 34.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/81F8SgmqwwL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Storage",
      tags: ["ottoman", "storage", "seating"],
    },
    {
      title: "Computer Desk with Shelves",
      description: "Study desk with built-in shelves for books and supplies.",
      price: 79.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71Tg5a1PxJL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Desks",
      tags: ["desk", "computer desk", "shelves"],
    },
    {
      title: "Bean Bag Chair",
      description: "Comfortable bean bag chair for relaxing and studying.",
      price: 49.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/81QKo9DiXaL._AC_SL1500_.jpg"],
      category: "Furniture",
      subcategory: "Chairs",
      tags: ["bean bag", "chair", "comfort"],
    },
  ],
  appliances: [
    {
      title: "Mini Refrigerator",
      description: "Compact refrigerator perfect for dorm rooms and small apartments.",
      price: 129.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71RJF+xJJwL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Refrigeration",
      tags: ["refrigerator", "mini fridge", "dorm"],
    },
    {
      title: "Microwave Oven",
      description: "700W microwave with multiple power settings and easy controls.",
      price: 69.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/81s-z3aa2tL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Kitchen",
      tags: ["microwave", "kitchen", "cooking"],
    },
    {
      title: "Electric Kettle",
      description: "Fast-boiling electric kettle for tea, coffee, and instant meals.",
      price: 24.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/71yCUQA9wbL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Kitchen",
      tags: ["kettle", "electric kettle", "kitchen"],
    },
    {
      title: "Single-Serve Coffee Maker",
      description: "Compact coffee maker for quick, single-serve brewing.",
      price: 49.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71Ikuq6AAfL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Kitchen",
      tags: ["coffee maker", "kitchen", "brewing"],
    },
    {
      title: "Portable Blender",
      description: "USB-rechargeable blender for smoothies and protein shakes on the go.",
      price: 29.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61J+OBgfpPL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Kitchen",
      tags: ["blender", "portable", "smoothies"],
    },
    {
      title: "Desk Fan",
      description: "Quiet USB-powered fan for desk or bedside cooling.",
      price: 19.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71DJA+3KIKL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Cooling",
      tags: ["fan", "desk fan", "cooling"],
    },
    {
      title: "Air Purifier",
      description: "HEPA air purifier for removing allergens and improving air quality.",
      price: 89.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/71d7DdgoTZL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Air Quality",
      tags: ["air purifier", "HEPA", "allergies"],
    },
    {
      title: "Rice Cooker",
      description: "Compact rice cooker with steamer basket for easy meal preparation.",
      price: 34.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/61PAUXdnRxL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Kitchen",
      tags: ["rice cooker", "kitchen", "cooking"],
    },
    {
      title: "Handheld Vacuum",
      description: "Cordless handheld vacuum for quick cleanups in small spaces.",
      price: 39.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71uJZ+H+3QL._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Cleaning",
      tags: ["vacuum", "handheld", "cleaning"],
    },
    {
      title: "Clothes Steamer",
      description: "Portable garment steamer for quickly removing wrinkles from clothes.",
      price: 29.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61DjlUOJj4L._AC_SL1500_.jpg"],
      category: "Appliances",
      subcategory: "Laundry",
      tags: ["steamer", "clothes", "laundry"],
    },
  ],
  bicycles: [
    {
      title: "Mountain Bike",
      description: "21-speed mountain bike with front suspension and disc brakes.",
      price: 199.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/81wGn2TQJeL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Mountain Bikes",
      tags: ["mountain bike", "bicycle", "outdoor"],
    },
    {
      title: "Road Bike",
      description: "Lightweight road bike with 14 speeds and drop handlebars.",
      price: 249.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71WcN2n+MZL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Road Bikes",
      tags: ["road bike", "bicycle", "cycling"],
    },
    {
      title: "Hybrid Bike",
      description: "Versatile hybrid bike for commuting and recreational riding.",
      price: 179.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71JfO3mJY5L._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Hybrid Bikes",
      tags: ["hybrid bike", "bicycle", "commuting"],
    },
    {
      title: "Folding Bike",
      description: "Compact folding bike for easy storage and transportation.",
      price: 159.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/71-weLk+p0L._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Folding Bikes",
      tags: ["folding bike", "bicycle", "portable"],
    },
    {
      title: "Cruiser Bike",
      description: "Comfortable cruiser bike with wide seat and upright riding position.",
      price: 149.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71E+oh38XNL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Cruiser Bikes",
      tags: ["cruiser bike", "bicycle", "comfort"],
    },
    {
      title: "Fixed Gear Bike",
      description: "Minimalist fixed gear bike for urban riding and commuting.",
      price: 169.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71LZ7JHYRoL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Fixed Gear Bikes",
      tags: ["fixed gear", "bicycle", "urban"],
    },
    {
      title: "Electric Bike",
      description: "Electric-assist bike with 20-mile range and pedal assist.",
      price: 499.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/71i1NQz3VEL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Electric Bikes",
      tags: ["electric bike", "e-bike", "commuting"],
    },
    {
      title: "BMX Bike",
      description: "Sturdy BMX bike for tricks and street riding.",
      price: 139.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71E6CrYH0HL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "BMX Bikes",
      tags: ["BMX", "bicycle", "tricks"],
    },
    {
      title: "Bike Helmet",
      description: "Adjustable bike helmet with ventilation and safety certification.",
      price: 29.99,
      condition: "Like New",
      images: ["https://m.media-amazon.com/images/I/61u2qdJW7tL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Accessories",
      tags: ["helmet", "safety", "cycling"],
    },
    {
      title: "Bike Lock",
      description: "Heavy-duty U-lock for securing your bike on campus.",
      price: 24.99,
      condition: "Good",
      images: ["https://m.media-amazon.com/images/I/71nYYtRu3QL._AC_SL1500_.jpg"],
      category: "Bicycles",
      subcategory: "Accessories",
      tags: ["lock", "security", "cycling"],
    },
  ],
}

// Function to create sellers and products
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})

    console.log("Previous data cleared")

    // Create sellers
    const createdSellers = []
    for (const sellerData of sampleSellers) {
      const seller = new User(sellerData)
      await seller.save()
      createdSellers.push(seller)
      console.log(`Created seller: ${seller.name}`)
    }

    // Create products for each category
    let productCount = 0
    for (const [category, products] of Object.entries(sampleProducts)) {
      for (const productData of products) {
        // Randomly assign a seller
        const randomSeller = createdSellers[Math.floor(Math.random() * createdSellers.length)]

        const product = new Product({
          ...productData,
          seller: randomSeller._id,
          sellerName: randomSeller.name,
          sellerPhone: randomSeller.phone,
          sellerUniversity: randomSeller.university,
          location: randomSeller.location.formatted,
          pinCode: randomSeller.location.pinCode,
        })

        await product.save()
        productCount++
        console.log(`Created product: ${product.title}`)
      }
    }

    console.log(`Database seeded with ${createdSellers.length} sellers and ${productCount} products`)
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()

