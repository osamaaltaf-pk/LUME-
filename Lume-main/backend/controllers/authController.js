import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import bcrypt from 'bcryptjs';

let refreshTokens = [];

// register
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      return res.status(400).json({ message: "User already exist please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with is_verified = true directly (No OTP/email verification needed)
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        otp: null,
        otp_expires: null,
        is_verified: true
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return res.status(200).json({
      message: "Registration successful! Welcome to LUME.",
      requireOtp: false,
      user: {
        id: newUser.id,
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Error while creating user",
      error: error.message
    });
  }
};

// Verify OTP (Fallback endpoint - auto succeeds to prevent frontend breakage)
export const verifyEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Ensure is_verified is true
    if (!user.is_verified) {
      await supabase.from('users').update({ is_verified: true }).eq('id', user.id);
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken);

    return res.status(200).json({
      message: "Email verified successfully!",
      user: {
        id: user.id,
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    return res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(400).json({
        message: "User not found please sign up"
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken);

    return res.status(200).json({
      message: `Login successfull welcome ${user.username}`,
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        _id: user.id,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Database or Server error during login",
      error: error.message
    });
  }
};

// for frontend to generate access token every 15min
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refreshed token required" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.user_id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(decoded.user_id, user.role);

    return res.status(200).json({ message: "Successfully created access token", accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired refresh token", error });
  }
};

// logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);

  return res.status(200).json({ message: "Logged out succesfully" });
};

// Forgot Password - Auto Reset without OTP check
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Direct reset allowed" });

  } catch (error) {
    return res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

// Reset Password - Direct password reset (Bypasses OTP checking)
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        otp: null,
        otp_expires: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return res.status(200).json({ message: "Password reset successfully. Please login." });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};
