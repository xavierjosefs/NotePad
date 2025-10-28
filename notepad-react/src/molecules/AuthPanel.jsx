import {useNavigate } from "react-router-dom";
import Headline from "./Headline";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import Remember from "./Remember";
import PrimaryButton from "./PrimaryButton";
import CreateAccount from "./CreateAccount";
import axios from "axios";

export default function AuthPanel({ card = false }) {
  const base = "w-full max-w-md space-y-4";
  const cardStyles =
    "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1) Leer valores del form (por 'name')
    const fd = new FormData(event.currentTarget);
    const email = fd.get("email");
    const password = fd.get("password");

    
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${baseURL}/login`, { email, password }, { withCredentials: true });
      console.log("Login response:", res)
      if(res.status === 200){
        navigate("/")
      }

    } catch (err) {
      const msg = err?.response?.data?.error ?? "INTERNAL_ERROR";
      alert(`Login failed: ${msg}`);
    }
  };
  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <form onSubmit={handleSubmit}>
        <Headline />
        <EmailForm />
        <PasswordForm />
        <Remember />
        <PrimaryButton />
        <CreateAccount />
      </form>
    </section>
  );
}
