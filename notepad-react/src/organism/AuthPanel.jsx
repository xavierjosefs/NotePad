import Headline from "../molecules/Headline";
import EmailForm from "../molecules/EmailForm";
import PasswordForm from "../molecules/PasswordForm";
import Remember from "../molecules/Remember";
import PrimaryButton from "../molecules/PrimaryButton";
import CreateAccount from "../molecules/CreateAccount";

export default function AuthPanel({ card = false }) {
  const base = "w-full max-w-md space-y-4";
  const cardStyles =
    "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <Headline />
      <EmailForm />
      <PasswordForm />
      <Remember />
      <PrimaryButton />
      <CreateAccount />
    </section>
  );
}
