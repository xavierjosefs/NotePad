import { useState } from "react";
import Input from "../atoms/Input";
import FormText from "../atoms/FormText";
import PrimaryButton from "../molecules/PrimaryButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [msgClassname, setMsgClassname] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setMsg("Please fill in all fields.");
      setMsgClassname("text-red-500 mb-4");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      setMsgClassname("text-red-500 mb-4");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/resetpassword`,
        { newPassword: password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMsg("Password successfully changed.");
        setMsgClassname("text-green-500 mb-4");
        navigate("/login");
        
      }
    } catch (err) {
      const msg = err?.response?.data?.error ?? "Error changing password.";
      setMsg(msg);
      setMsgClassname("text-red-500 mb-4");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-6 md:p-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Change Password
        </h2>

        {msg && <p className={`text-center ${msgClassname}`}>{msg}</p>}

        <div>
          <FormText text="New Password" className="text-gray-700 mb-1" />
          <Input
            type="password"
            name="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <FormText text="Confirm Password" className="text-gray-700 mb-1" />
          <Input
            type="password"
            name="confirm"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-2">
          <PrimaryButton
            text={loading ? "Changing..." : "Confirm Change"}
            disabled={loading}
          />
        </div>
      </form>
    </section>
  );
}
