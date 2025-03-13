require('dotenv').config();
const pgp = require('pg-promise')();
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};
const db = pgp(dbConfig);

const createPersona = async (persona) => {
  try {
    // Insert into the main personas table
    const result = await db.one(
      'INSERT INTO personas (name, email, phone, state, pin_code, message, type, is_favorite, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        persona.name,
        persona.email,
        persona.phone,
        persona.state,
        persona.pinCode,
        persona.message,
        persona.type,
        persona.isFavorite,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );

    // Insert into the specific type table based on the persona type
    switch (persona.type) {
      case 'Employees':
        await db.none(
          'INSERT INTO employees (persona_id, date_of_birth, father_name, blood_group, emergency_contact, aadhar_number, joining_date, probation_end_date, previous_employer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [
            result.id,
            persona.dateOfBirth,
            persona.fatherName,
            persona.bloodGroup,
            persona.emergencyContact,
            persona.aadharNumber,
            persona.joiningDate,
            persona.probationEndDate,
            persona.previousEmployer
          ]
        );
        break;
      case 'Vendors':
        await db.none(
          'INSERT INTO vendors (persona_id, address, pan_number, gst_number, bank_name, account_number, ifsc_code) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            result.id,
            persona.address,
            persona.panNumber,
            persona.gstNumber,
            persona.bankName,
            persona.accountNumber,
            persona.ifscCode
          ]
        );
        break;
      case 'Customers':
        await db.none(
          'INSERT INTO customers (persona_id, age, location, job, income_range, family_members, weight, interests, user_type, wheelchair_type, commute_range, commute_mode, pains_daily, pains_commute, solutions_needed, customer_segment, expected_gain) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',
          [
            result.id,
            persona.age,
            persona.location,
            persona.job,
            persona.income,
            persona.familyMembers,
            persona.weight,
            persona.interests,
            persona.userType,
            persona.wheelchairType,
            persona.commuteRange,
            persona.commuteMode,
            persona.painsDaily,
            persona.painsCommute,
            persona.solutionsNeeded,
            persona.customerSegment,
            persona.expectedGain
          ]
        );
        break;
      case 'Others':
        await db.none(
          'INSERT INTO others (persona_id, message) VALUES ($1, $2)',
          [result.id, persona.message]
        );
        break;
      default:
        throw new Error(`Unknown persona type: ${persona.type}`);
    }

    return result;
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
};

module.exports = { createPersona };