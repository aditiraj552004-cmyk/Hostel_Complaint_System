require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const Notification = require("./models/Notification");

const app = express();

// ========================================
// Middleware
// ========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hostel-complaint-system-dusky.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Allow browser to access uploaded images
app.use("/uploads", express.static("uploads"));

// ========================================
// MongoDB Connection
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ========================================
// Multer Configuration
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed."
        ),
        false
      );
    }
  },
});
// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
  res.send("HostelCare Backend Running");
});

// ========================================
// REGISTER API
// Day 26 Step 1
// ========================================

app.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Remove unnecessary spaces
    name = name?.trim();
    email = email?.trim().toLowerCase();

    // Empty fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Name validation
    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters.",
      });
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration Successful!",
    });
  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ========================================
// LOGIN API
// Day 26 Step 2
// ========================================

app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email,
    });

    // Same message for unknown email/wrong password
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      success: true,
      message: "Login Successful!",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ========================================
// PROFILE
// ========================================

app.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.log("Profile Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// SUBMIT COMPLAINT
// Day 26 Steps 3 + 4
// ========================================

app.post(
  "/complaints",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        roomNumber,
      } = req.body;

      // ==================================
      // Required Fields
      // ==================================

      if (
        !title ||
        !category ||
        !description ||
        !roomNumber
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please fill all complaint fields.",
        });
      }

      // ==================================
      // DAY 26 STEP 3
      // Complaint Validation
      // ==================================

      // Title validation
      if (title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message:
            "Complaint title must contain at least 3 characters.",
        });
      }

      if (title.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Complaint title cannot exceed 100 characters.",
        });
      }

      // Description validation
      if (description.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message:
            "Description must contain at least 10 characters.",
        });
      }

      if (
        description.trim().length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Description cannot exceed 1000 characters.",
        });
      }

      // Room validation
      if (roomNumber.trim().length > 20) {
        return res.status(400).json({
          success: false,
          message:
            "Room number cannot exceed 20 characters.",
        });
      }

      // ==================================
      // DAY 26 STEP 4
      // Category Validation
      // ==================================

      const allowedCategories = [
        "Electrical",
        "Plumbing",
        "Cleaning",
        "Food",
        "Internet",
        "Other",
      ];

      if (
        !allowedCategories.includes(category)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid complaint category.",
        });
      }

      // ==================================
      // Create Complaint
      // ==================================

      const complaint =
        await Complaint.create({
          userId: req.user.userId,

          // Save cleaned values
          title: title.trim(),
          category: category.trim(),
          description:
            description.trim(),
          roomNumber:
            roomNumber.trim(),

          image: req.file
            ? `/uploads/${req.file.filename}`
            : "",
        });

      return res.status(201).json({
        success: true,
        message:
          "Complaint submitted successfully",
        complaint,
      });
    } catch (error) {
      console.log(
        "Complaint Submit Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// GET MY COMPLAINTS
// ========================================

app.get(
  "/complaints",
  authMiddleware,
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find({
          userId: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      return res.json({
        success: true,
        complaints,
      });
    } catch (error) {
      console.log(
        "Get Complaints Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// DELETE STUDENT COMPLAINT
// ========================================

app.delete(
  "/complaints/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const complaint =
        await Complaint.findOne({
          _id: req.params.id,
          userId: req.user.userId,
        });

      // Complaint not found OR
      // does not belong to user
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            "Complaint not found.",
        });
      }

      // Only Pending complaints
      // can be deleted
      if (
        complaint.status !== "Pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only pending complaints can be deleted.",
        });
      }

      await Complaint.findByIdAndDelete(
        complaint._id
      );

      // Delete notifications related
      // to deleted complaint
      await Notification.deleteMany({
        complaintId: complaint._id,
      });

      return res.json({
        success: true,
        message:
          "Complaint deleted successfully.",
      });
    } catch (error) {
      console.log(
        "Delete Complaint Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// ADMIN - GET ALL COMPLAINTS
// ========================================

app.get(
  "/admin/complaints",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaints =
        await Complaint.find()
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        complaints,
      });
    } catch (error) {
      console.log(
        "Admin Complaints Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// ADMIN - UPDATE COMPLAINT STATUS
// ========================================

app.put(
  "/admin/complaints/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            "Complaint not found",
        });
      }

      // Prevent duplicate notification
      // if status is already the same
      if (
        complaint.status === status
      ) {
        return res.json({
          success: true,
          message:
            "Complaint already has this status",
          complaint,
        });
      }

      complaint.status = status;

      await complaint.save();

      // Create notification for student
      await Notification.create({
        userId: complaint.userId,
        complaintId: complaint._id,

        message: `Your complaint "${complaint.title}" status has been updated to ${status}.`,
      });

      return res.json({
        success: true,
        message:
          "Complaint status updated successfully",
        complaint,
      });
    } catch (error) {
      console.log(
        "Status Update Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// GET STUDENT NOTIFICATIONS
// ========================================

app.get(
  "/notifications",
  authMiddleware,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          userId: req.user.userId,
        })
          .populate(
            "complaintId",
            "title status"
          )
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.log(
        "Notification Fetch Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// MARK NOTIFICATION AS READ
// ========================================

app.put(
  "/notifications/:id/read",
  authMiddleware,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,

            // Student can update only
            // their own notification
            userId: req.user.userId,
          },
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.log(
        "Mark Notification Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ========================================
// GET UNREAD NOTIFICATION COUNT
// ========================================

app.get(
  "/notifications/unread-count",
  authMiddleware,
  async (req, res) => {
    try {
      const unreadCount =
        await Notification.countDocuments({
          userId: req.user.userId,
          isRead: false,
        });

      return res.json({
        success: true,
        unreadCount,
      });
    } catch (error) {
      console.log(
        "Unread Notification Count Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// ======================
// 404 Handler
// ======================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ======================
// Global Error Handler
// ======================

app.use((err, req, res, next) => {
  console.log("Global Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "Image size cannot exceed 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.message ===
    "Only JPG, PNG and WEBP images are allowed."
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
});
// ========================================
// START SERVER
// ========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});