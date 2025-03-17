require("dotenv").config();
const pgp = require("pg-promise")();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
const db = pgp(dbConfig);

// ✅ Helper function to handle undefined values
const cleanValue = (value) => (value !== undefined && value !== "" ? value : null);

const allowedCommuteModes = ["Public Transport", "Private Vehicle", "Taxi/Ride-sharing", "Walking", "Wheelchair"];

const createPersona = async (persona) => {
  try {
    console.log("🔍 Checking if email already exists:", persona.email);

    const existingPersona = await db.oneOrNone("SELECT * FROM personas WHERE email = $1", [persona.email]);
    if (existingPersona) {
      throw new Error(`Persona with email ${persona.email} already exists.`);
    }

    console.log("✅ Email is unique, proceeding with insertion.");

    const personaResult = await db.one(
      `INSERT INTO personas (name, email, phone, state, pin_code, message, type, is_favorite, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
      [
        persona.name,
        persona.email,
        persona.phone,
        cleanValue(persona.state),
        cleanValue(persona.pinCode),
        cleanValue(persona.message),
        persona.type,
        Boolean(persona.isFavorite),
      ]
    );

    console.log(`✅ Persona inserted with ID: ${personaResult.id}`);

    switch (persona.type) {
      case "Customers": {
        // ✅ Validate commute_mode before inserting
        if (!allowedCommuteModes.includes(persona.commuteMode)) {
          throw new Error(
            `Invalid commute_mode: "${persona.commuteMode}". Allowed values: ${allowedCommuteModes.join(", ")}`
          );
        }

        const customerQuery = `
          INSERT INTO customers (persona_id, age, location, job, income_range, family_members, weight, user_type, 
            wheelchair_type, commute_range, commute_mode, pains_daily, pains_commute, solutions_needed, 
            customer_segment, expected_gain) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;

        const customerValues = [
          personaResult.id,
          cleanValue(persona.age),
          cleanValue(persona.location),
          cleanValue(persona.job),
          cleanValue(persona.income),
          cleanValue(persona.familyMembers),
          cleanValue(persona.weight),
          cleanValue(persona.userType),
          cleanValue(persona.wheelchairType),
          cleanValue(persona.commuteRange),
          cleanValue(persona.commuteMode), // ✅ Only allowed values are inserted
          cleanValue(persona.painsDaily),
          cleanValue(persona.painsCommute),
          cleanValue(persona.solutionsNeeded),
          cleanValue(persona.customerSegment),
          cleanValue(persona.expectedGain),
        ];

        console.log("🔄 Executing customer query:", customerQuery, "with values:", customerValues);
        await db.one(customerQuery, customerValues);
        console.log("✅ Customer inserted.");
        break;
      }
    }

    return personaResult;
  } catch (error) {
    console.error("❌ Error creating persona:", error);
    throw error;
  }
};





// ✅ Get Personas by Type
const getPersonasByType = async (type) => {
  try {
    console.log(`🔍 Fetching personas of type: ${type || "All"}`);

    if (type) {
      return await db.any("SELECT * FROM personas WHERE type = $1", [type]);
    }
    return await db.any("SELECT * FROM personas");
  } catch (error) {
    console.error("❌ Database error fetching personas:", error);
    throw error;
  }
};






// ✅ Toggle Favorite Status
const toggleFavorite = async (id, isFavorite) => {
  try {
    console.log(`🔄 Updating favorite status: Persona ID = ${id}, New Value = ${isFavorite}`);

    if (typeof isFavorite !== "boolean") {
      throw new Error("Invalid is_favorite value. Must be true or false.");
    }

    const result = await db.oneOrNone(
      "UPDATE personas SET is_favorite = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [isFavorite, id]
    );

    if (!result) {
      console.error(`❌ Persona with ID ${id} not found.`);
      return null;
    }

    console.log(`✅ Favorite status updated for Persona ID: ${id}`);
    return result;
  } catch (error) {
    console.error("❌ Database error toggling favorite:", error);
    throw error;
  }
};

// ✅ Export All Functions
module.exports = { createPersona, getPersonasByType, toggleFavorite };
