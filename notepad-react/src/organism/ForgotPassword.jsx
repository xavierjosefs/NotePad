import React, { useState, useRef, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";


const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  // const [step, setStep] = useState("email"); //"email", "otp", "newpassword"
  const [msg, setMsg] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [msgClassname, setMsgClassname] = useState("");
  const [timer, setTimer] = useState(0);
  const inputs = useRef([]);

  // 🕒 control del temporizador
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 📨 enviar código
  const handleSendCode = async (event) => {
    event.preventDefault();


    if (!email){
        setMsg("Please enter your email address first.")
        setMsgClassname("text-red-500 mb-4")
        return;
    }

    try {
      const res = await axios.post(`${baseURL}/changepassemail`, { email });

      if (res.status === 200) {
        setMsg("Verification code sent to your email.");
        setMsgClassname("text-green-500 mb-4");
        // setStep("otp");
        setCodeSent(true);
        setTimer(30);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error ?? "INTERNAL_ERROR";

      console.error("Error sending code:", status, msg);

      if (status === 404) {
        setMsg("Email not found.");
        setMsgClassname("text-red-500 mb-4");
      } else if (status === 400) {
        setMsg("Invalid input. Please enter a valid email.");
        setMsgClassname("text-red-500 mb-4");
      } else {
        setMsg("Error sending verification code. Please try again later.");
        setMsgClassname("text-red-500 mb-4");
      }
    }
  };

  const navigate = useNavigate();
   // ✅ verificar
  const handleVerify = async (event) => {
    
    event.preventDefault();

    const code = otp.join("");
    if (code.length < 6) {
      setMsg("Please enter the complete 6-digit code.");
      setMsgClassname("text-red-500 mb-4");
      return;
    }
    try {
      const  res = await axios.post(`${baseURL}/verifyotp`, { email, code }, { withCredentials: true });

      if (res.status === 200) {
        setMsg("Code verified! You can now reset your password.");
        setMsgClassname("text-green-500 mb-4");
        navigate("/changepassword");
        // setStep("reset");
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error ?? "INTERNAL_ERROR";

      console.error("Error sending code:", status, msg);

      if (status === 404) {
        setMsg("Invalid code or email.");
        setMsgClassname("text-red-500 mb-4");
      } else if (status === 410 || status === 401) {
        setMsg("Expired or invalid code.");
        setMsgClassname("text-red-500 mb-4");
      }else {
        setMsg("Error sending verification code. Please try again later.");
        setMsgClassname("text-red-500 mb-4");
      }
    }
  };

  // 🔁 reenviar código
  const handleResend = async (event) => {
    
    if (timer > 0) return;
    setMsg(`A new verification code was sent to ${email}`);
    setMsgClassname("text-green-500 mb-4");
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);

    event.preventDefault();

    if (!email){
        setMsg("Please enter your email address first.")
        setMsgClassname("text-red-500 mb-4")
        return;
    }

    try {
      const res = await axios.post(`${baseURL}/changepassemail`, { email });

      if (res.status === 200) {
        setMsg("Verification code sent to your email.");
        setMsgClassname("text-green-500 mb-4");
        // setStep("otp");
        setCodeSent(true);
        setTimer(30);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error ?? "INTERNAL_ERROR";

      console.error("Error sending code:", status, msg);

      if (status === 404) {
        setMsg("Email not found.");
        setMsgClassname("text-red-500 mb-4");
      } else if (status === 400) {
        setMsg("Invalid input. Please enter a valid email.");
        setMsgClassname("text-red-500 mb-4");
      } else {
        setMsg("Error sending verification code. Please try again later.");
        setMsgClassname("text-red-500 mb-4");
      }
    }
  };

  // 🧩 manejo del OTP
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Forgot Password
        </h1>
        <a className={msgClassname}>{msg}</a>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your email to receive a verification code
        </p>

        {/* 📧 Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
        />

        {/* 🔘 Send Code */}
        {!codeSent && (
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-all mb-6"
          >
            Send Code
          </button>
        )}

        {codeSent && (
          <>
            {/* 🔢 OTP */}
            <p className="text-gray-700 font-medium mb-4">
              Enter Verification Code Below
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 outline-none transition-all
                    ${
                      digit
                        ? "border-gray-500 bg-white shadow-sm"
                        : "border-gray-300 bg-gray-50"
                    }
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-300`}
                />
              ))}
            </div>

            {/* ✅ Verify */}
            <button
              onClick={handleVerify}
              className="w-full bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-all"
            >
              Verify Code
            </button>

            {/* 🔁 Resend */}
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`mt-4 w-full border py-2.5 rounded-lg font-medium transition-all ${
                timer > 0
                  ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
