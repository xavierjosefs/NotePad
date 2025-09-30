import Headline from "./Headline";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";
import Remember from "./Remember";
import PrimaryButton from "./PrimaryButton";
import CreateAccount from "./CreateAccount";

export default function AuthPanel({ card = false }) {
  const base = "w-full max-w-md space-y-4";
  const cardStyles =
    "rounded-2xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-gray-200";
  return (
    <section className={card ? `${base} ${cardStyles}` : base}>
      <form>
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
