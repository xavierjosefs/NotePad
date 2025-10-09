import RegisterHeadline from "./RegisterHeadline";
import NameForm from "./NameForm"
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import axios from "axios";
import RegisterPrimaryButton from "./RegisterPrimaryButton";
import SignInOutlined from "./SignInOutlined";
import { useNavigate } from "react-router-dom";

export default function RegisterPanel({ card = false }) {
    const base = "w-full max-w-md space-y-4";
    const cardStyles =
      "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
    event.preventDefault();

    // 1) Leer valores del form (por 'name')
    const fd = new FormData(event.currentTarget);
    const email = fd.get("email");
    const password = fd.get("password");
    const name = fd.get("name");

    
    if (!email || !password || !name) {
      alert("Email and password are required");
      return;
    }

    try {
      const baseURL = "http://localhost:8000";
      const res = await axios.post(`${baseURL}/register`, { email, password, name });
      console.log(res);
      if(res.status === 201){
        navigate("/login")
      }

    } catch (err) {
      const msg = err?.response?.data?.error ?? "INTERNAL_ERROR";
      alert(`Register failed: ${msg}`);
    }
  };

  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <form onSubmit={handleSubmit}>
        <RegisterHeadline />
        <NameForm/>
        <EmailForm />
        <PasswordForm />
        <RegisterPrimaryButton />
        <SignInOutlined />
      </form>
    </section>
  );
}
