const User = require('../models/User');

// Add this to verify which controller is loaded
console.log('✅✅✅ UPDATED employeeController.js LOADED - CREATE EMPLOYEE ENDPOINT ✅✅✅');

// Helper to generate employee ID
const generateEmployeeId = async () => {
  try {
    const lastEmployee = await User.findOne({ 
      role: { $in: ['admin', 'hr', 'employee'] }
    }).sort({ createdAt: -1 });
    
    let lastNumber = 0;
    if (lastEmployee && lastEmployee.employeeId) {
      // Extract number from EMP001 format
      const match = lastEmployee.employeeId.match(/EMP(\d+)/);
      if (match) {
        lastNumber = parseInt(match[1]);
      }
    }
    
    return `EMP${(lastNumber + 1).toString().padStart(3, '0')}`;
  } catch (error) {
    // Fallback to timestamp
    return `EMP${Date.now().toString().slice(-6)}`;
  }
};

// ===== CREATE EMPLOYEE =====
exports.createEmployee = async (req, res) => {
  console.log('🚀🚀🚀 CREATE EMPLOYEE ENDPOINT CALLED 🚀🚀🚀');
  console.log('📥 FULL REQUEST:', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  });
  
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'employee', 
      department = 'General', 
      position = 'Employee', 
      phone = '', 
      isActive = true 
    } = req.body;
    
    console.log('📋 Parsed data from request:', {
      name: name || 'MISSING',
      email: email || 'MISSING',
      password: password ? 'PRESENT' : 'MISSING',
      role,
      department,
      position,
      phone,
      isActive
    });
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('❌ VALIDATION FAILED - Missing fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required',
        details: {
          hasName: !!name,
          hasEmail: !!email,
          hasPassword: !!password
        }
      });
    }

    console.log('✅ All required fields present');

    // Validate role
    if (!['admin', 'hr', 'employee'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be admin, hr, or employee' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists' 
      });
    }

    // Generate employee ID
    const employeeId = await generateEmployeeId();
    console.log('📝 Generated employee ID:', employeeId);
    
    // Generate username from email (first part before @)
    const username = email.split('@')[0];
    console.log('📝 Generated username:', username);

    // Create user - password will be hashed by schema pre-save hook
    const userData = {
      employeeId,
      name,
      username,
      email: email.toLowerCase(),
      password, // Raw password, will be hashed by schema
      role,
      department: department || 'General',
      position: position || 'Employee',
      phone: phone || '',
      isActive: isActive !== false
    };

    console.log('📤 Creating user with final data:', { 
      ...userData, 
      password: '[HIDDEN]' 
    });

    const user = await User.create(userData);
    console.log('✅ User created successfully:', user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      success: true, 
      message: 'Employee created successfully',
      data: userResponse 
    });
  } catch (err) {
    console.error('❌❌❌ CREATE EMPLOYEE ERROR ❌❌❌:', err);
    console.error('Error stack:', err.stack);
    
    // Check for duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      console.log('❌ Duplicate key error for field:', field);
      return res.status(400).json({ 
        success: false, 
        error: `${field} already exists` 
      });
    }
    
    // Check for validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      console.log('❌ Validation errors:', errors);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server error creating employee',
      message: err.message 
    });
  }
};

// ===== GET ALL EMPLOYEES =====
exports.getAllEmployees = async (req, res) => {
  try {
    // Get query parameters
    const { department, search, status } = req.query;
    
    // Build filter
    let filter = { role: { $in: ['admin', 'hr', 'employee'] } };
    
    // Filter by department
    if (department && department !== 'all') {
      filter.department = department;
    }
    
    // Filter by status
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await User.find(filter)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: employees.length,
      data: employees 
    });
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error fetching employees' 
    });
  }
};

// ===== GET SINGLE EMPLOYEE =====
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: employee 
    });
  } catch (err) {
    console.error('Get employee error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error fetching employee' 
    });
  }
};

// ===== UPDATE EMPLOYEE =====
exports.updateEmployee = async (req, res) => {
  try {
    const updates = req.body;
    const employeeId = req.params.id;
    
    console.log('📥 Update data:', updates);
    
    // Validate role if provided
    if (updates.role && !['admin', 'hr', 'employee'].includes(updates.role)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid role. Must be admin, hr, or employee' 
      });
    }
    
    // Check if email already exists (if email is being updated)
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email.toLowerCase(),
        _id: { $ne: employeeId } // Exclude current employee
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email already exists' 
        });
      }
      updates.email = updates.email.toLowerCase();
    }
    
    // Update employee
    const employee = await User.findByIdAndUpdate(
      employeeId, 
      updates, 
      { 
        new: true, // Return updated document
        runValidators: true 
      }
    ).select('-password'); // Exclude password from response
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Employee updated successfully',
      data: employee 
    });
  } catch (err) {
    console.error('Update employee error:', err);
    
    // Check for duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        success: false, 
        error: `${field} already exists` 
      });
    }
    
    // Check for validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error updating employee' 
    });
  }
};

// ===== DELETE EMPLOYEE =====
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        error: 'Employee not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Employee deleted successfully' 
    });
  } catch (err) {
    console.error('Delete employee error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Server error deleting employee' 
    });
  }
};