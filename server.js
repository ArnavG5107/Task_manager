const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// In-memory user storage (replace with database in production)
let users = [];
let refreshTokens = [];

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URLs
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Helper functions
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  
  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!hasNonalphas) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);
    refreshTokens.push(refreshToken);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    refreshTokens.push(refreshToken);

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
      if (err) {
        // Remove invalid token
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const tokens = generateTokens(user.userId);
      
      // Replace old refresh token with new one
      const tokenIndex = refreshTokens.indexOf(refreshToken);
      if (tokenIndex > -1) {
        refreshTokens[tokenIndex] = tokens.refreshToken;
      }

      res.json(tokens);
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update name if provided
    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters long' });
      }
      user.name = name.trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
    }

    user.updatedAt = new Date().toISOString();

    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      message: 'Profile updated successfully',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email change functionality
app.post('/api/auth/change-email', authenticateToken, async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and password are required' });
    }

    if (!validator.isEmail(newEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== user.id);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Update email
    user.email = newEmail.toLowerCase().trim();
    user.updatedAt = new Date().toISOString();

    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      message: 'Email updated successfully',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Email change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Account deactivation
app.post('/api/auth/deactivate', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required to deactivate account' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Deactivate user
    user.isActive = false;
    user.deactivatedAt = new Date().toISOString();

    // Remove all refresh tokens for this user
    refreshTokens = refreshTokens.filter(rt => {
      try {
        const decoded = jwt.verify(rt, JWT_SECRET);
        return decoded.userId !== user.id;
      } catch {
        return false;
      }
    });

    res.json({ message: 'Account deactivated successfully' });

  } catch (error) {
    console.error('Account deactivation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user activity/sessions
app.get('/api/auth/sessions', authenticateToken, (req, res) => {
  try {
    const userRefreshTokens = refreshTokens.filter(rt => {
      try {
        const decoded = jwt.verify(rt, JWT_SECRET);
        return decoded.userId === req.user.userId;
      } catch {
        return false;
      }
    });

    res.json({ 
      activeSessions: userRefreshTokens.length,
      lastLogin: users.find(u => u.id === req.user.userId)?.lastLogin || null
    });

  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout from all devices
app.post('/api/auth/logout-all', authenticateToken, (req, res) => {
  try {
    // Remove all refresh tokens for this user
    refreshTokens = refreshTokens.filter(rt => {
      try {
        const decoded = jwt.verify(rt, JWT_SECRET);
        return decoded.userId !== req.user.userId;
      } catch {
        return false;
      }
    });

    res.json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin endpoint - in production, add proper admin authentication)
app.get('/api/users', authenticateToken, (req, res) => {
  try {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Password reset functionality
const passwordResetTokens = new Map(); // Store reset tokens temporarily

// Request password reset
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If the email exists, a reset link will be sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    passwordResetTokens.set(resetToken, { userId: user.id, expires: Date.now() + 3600000 });

    // In production, send email with reset link
    console.log(`🔐 Password reset token for ${email}: ${resetToken}`);
    console.log(`🔗 Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

    res.json({ message: 'If the email exists, a reset link will be sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password with token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const resetData = passwordResetTokens.get(token);
    if (!resetData || resetData.expires < Date.now()) {
      passwordResetTokens.delete(token);
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    const user = users.find(u => u.id === resetData.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();

    // Remove reset token
    passwordResetTokens.delete(token);

    // Invalidate all existing refresh tokens for this user
    refreshTokens = refreshTokens.filter(rt => {
      try {
        const decoded = jwt.verify(rt, JWT_SECRET);
        return decoded.userId !== user.id;
      } catch {
        return false;
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clean up expired reset tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of passwordResetTokens.entries()) {
    if (data.expires < now) {
      passwordResetTokens.delete(token);
    }
  }
}, 300000); // Clean up every 5 minutes

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints available at: http://localhost:${PORT}/api/auth/*`);
  console.log(`📧 Password reset: http://localhost:${PORT}/api/auth/forgot-password`);
  console.log(`🔄 Reset password: http://localhost:${PORT}/api/auth/reset-password`);
  
  // Create multiple test users for development
  if (process.env.NODE_ENV !== 'production') {
    const testUsers = [
      { email: 'test@example.com', password: 'TestPassword123!', name: 'Test User' },
      { email: 'admin@example.com', password: 'AdminPass123!', name: 'Admin User' },
      { email: 'user@example.com', password: 'UserPass123!', name: 'Regular User' }
    ];

    testUsers.forEach(async (testUser, index) => {
      try {
        const hashedPassword = await bcrypt.hash(testUser.password, 12);
        const user = {
          id: `test-user-${index + 1}`,
          email: testUser.email,
          name: testUser.name,
          password: hashedPassword,
          createdAt: new Date().toISOString(),
          isActive: true
        };
        
        if (!users.find(u => u.email === user.email)) {
          users.push(user);
          console.log(`📝 Test user created: ${user.email} | Password: ${testUser.password}`);
        }
      } catch (error) {
        console.error('Error creating test user:', error);
      }
    });
  }
});

module.exports = app;