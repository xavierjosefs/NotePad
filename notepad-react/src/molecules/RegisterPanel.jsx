import RegisterHeadline from "./RegisterHeadline";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import ConfirmPasswordForm from "./ConfirmPasswordForm";
import RegisterPrimaryButton from "./RegisterPrimaryButton";
import SignInOutlined from "./SignInOutlined";

export default function RegisterPanel({ card = false }) {
  const base = "w-full max-w-md space-y-4";
  const cardStyles =
    "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <form>
        <RegisterHeadline />
        <EmailForm />
        <PasswordForm />
        <ConfirmPasswordForm />
        <RegisterPrimaryButton />
        <SignInOutlined />
      </form>
    </section>
  );
}
