import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";

export default function SignInOutlined() {
  const navigate = useNavigate();
  return (
    <Button
      className="mt-3 w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
      type="button"
      text="I already have an account — Sign in"
      onClick={() => navigate("/login")}
    />
  );
}
