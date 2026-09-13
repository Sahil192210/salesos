const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_123';

// POST /api/auth/register - name, subdomain, ownerEmail, password -> hash -> create Company -> JWT
router.post('/register', async (req, res) => {
  try {
    const { name, subdomain, ownerEmail, password } = req.body;
    if (!name || !subdomain || !ownerEmail || !password) {
      return res.status(400).json({ message: 'All fields (name, subdomain, ownerEmail, password) are required.' });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();
    const existing = await Company.findOne({ subdomain: cleanSubdomain });
    if (existing) {
      return res.status(400).json({ message: 'Subdomain is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const company = new Company({
      name,
      subdomain: cleanSubdomain,
      ownerEmail,
      passwordHash
    });

    await company.save();

    const token = jwt.sign(
      { companyId: company._id, subdomain: company.subdomain, email: company.ownerEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      companyId: company._id,
      name: company.name,
      subdomain: company.subdomain
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.', error: err.message });
  }
});

// POST /api/auth/login - subdomain, email, password -> JWT companyId
router.post('/login', async (req, res) => {
  try {
    const { subdomain, email, password } = req.body;
    if (!subdomain || !password) {
      return res.status(400).json({ message: 'Subdomain and password are required.' });
    }

    const cleanSubdomain = subdomain.toLowerCase().trim();
    let query = { subdomain: cleanSubdomain };
    if (email) {
      query.ownerEmail = email.toLowerCase().trim();
    }

    const company = await Company.findOne(query);
    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials or subdomain not found.' });
    }

    const isMatch = await bcrypt.compare(password, company.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { companyId: company._id, subdomain: company.subdomain, email: company.ownerEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      companyId: company._id,
      name: company.name,
      subdomain: company.subdomain
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login.', error: err.message });
  }
});

module.exports = router;
