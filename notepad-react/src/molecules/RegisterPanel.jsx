import RegisterHeadline from "./RegisterHeadline";
import NameForm from "./NameForm";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import RegisterPrimaryButton from "./RegisterPrimaryButton";
import SignInOutlined from "./SignInOutlined";
import AvatarPicker from "../molecules/AvatarPicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPanel({ card = false }) {
  const base = "w-full max-w-md space-y-4";
  const cardStyles = "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const password = (fd.get("password") || "").toString();
    const avatar = (fd.get("avatar") || "").toString();

    if (!name || !email || !password) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      const baseURL = "http://localhost:8000";
      const res = await axios.post(
        `${baseURL}/register`,
        { name, email, password, avatar },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 201) navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.error ?? "INTERNAL_ERROR";
      alert(`Register failed: ${msg}`);
    }
  };

  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <form onSubmit={handleSubmit}>
        <RegisterHeadline />
        <div className="flex justify-center">
          <AvatarPicker className="mb-2" />
        </div>
        <NameForm />
        <EmailForm />
        <PasswordForm />
        <RegisterPrimaryButton />
        <SignInOutlined />
      </form>
    </section>
  );
}
