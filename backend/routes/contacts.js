const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

// GET /contacts - Fetch all contacts with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalContacts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /contacts - Add a new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if contact already exists
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res
        .status(400)
        .json({ message: "Contact with this email already exists" });
    }

    const contact = new Contact({ name, email, phone });
    await contact.save();

    res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /contacts/:id - Delete a contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
