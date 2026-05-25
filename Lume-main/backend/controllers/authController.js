import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../utils/emailService.js';

let refreshTokens = [];

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingUser) {
      if (!existingUser.is_verified) {
        // Resend OTP logic
        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 10);
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        const { error: updateError } = await supabase
          .from('users')
          .update({
            username,
            password: hashedPassword,
            otp,
            otp_expires: otpExpires
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;

        await sendOtpEmail(email, otp);

        return res.status(200).json({
          message: "User exists but not verified. New OTP sent.",
          requireOtp: true,
          email: email
        });
      }
      return res.status(400).json({ message: "User already exist please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Create user with is_verified = false
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        otp,
        otp_expires: otpExpires,
        is_verified: false
      });

    if (insertError) throw insertError;

    // Send Email
    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
    }

    return res.status(200).json({
      message: "OTP sent to email. Please verify.",
      requireOtp: true,
      email: email
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Error while creating user",
      error: error.message
    });
  }
};

// Verify OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(200).json({ message: "Email already verified. Please login." });
    }

    const isOtpValid = user.otp === otp;
    const isOtpExpired = new Date(user.otp_expires) < new Date();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
        otp: null,
        otp_expires: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Generate tokens on success verification
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken);

    return res.status(200).json({
      message: "Email verified successfully!",
      user: {
        id: user.id,
        _id: user.id, // For frontend compatibility
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
    const { email, password } = req.body;

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

    // Check verification
    if (!user.is_verified) {
      return res.status(400).json({ message: "Please verify your email first." });
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
        _id: user.id, // For frontend compatibility
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

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('users')
      .update({
        otp,
        otp_expires: otpExpires
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    return res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

// Reset Password - Verify OTP and Update Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOtpValid = user.otp === otp;
    const isOtpExpired = new Date(user.otp_expires) < new Date();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
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
