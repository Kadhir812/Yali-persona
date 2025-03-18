const express = require("express");
const router = express.Router();
const { createPersona, getPersonasByType, toggleFavorite } = require("../models/persona");

router.post("/personas", async (req, res) => {
  try {
    const personaData = req.body;
    const result = await createPersona(personaData);

    if (!result) {
      return res.status(500).json({ message: "Failed to create persona." });
    }

    console.log("✅ Persona successfully created:", result);

    res.status(201).json({ message: "Persona added successfully", data: result });
  } catch (error) {
    console.error("❌ Error adding persona:", error);
    res.status(500).json({ message: "Error adding persona", error: error.message });
  }
});

// Get personas (filtered by type if provided)
router.get("/personas", async (req, res) => {
  try {
    const type = req.query.type || null; // Optional type filter
    const personas = await getPersonasByType(type);
    res.status(200).json(personas);
  } catch (error) {
    console.error("Error fetching personas:", error);
    res.status(500).json({ message: "Error fetching personas", error: error.message });
  }
});

router.patch("/personas/:id/favorite", async (req, res) => {
  try {
    const { id } = req.params;
    let { is_favorite } = req.body;

    console.log(`📥 Received request: Toggle favorite for ID: ${id}, Value: ${is_favorite}`);

    if (typeof is_favorite !== "boolean") {
      console.error("❌ Invalid is_favorite value received:", is_favorite);
      return res.status(400).json({ message: "Invalid is_favorite value. Must be true or false." });
    }

    const updatedPersona = await toggleFavorite(id, is_favorite);

    if (!updatedPersona) {
      return res.status(404).json({ message: "❌ Persona not found" });
    }

    console.log(`✅ Favorite status updated for ID: ${id}`);
    res.status(200).json({ message: "Favorite status updated", data: updatedPersona });
  } catch (error) {
    console.error("❌ Error updating favorite status:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;
