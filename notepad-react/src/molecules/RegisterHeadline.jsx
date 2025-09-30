import FormTitle from "../atoms/FormTitle";
import FormText from "../atoms/FormText";

export default function RegisterHeadline() {
  return (
    <div className="space-y-1">
      <FormTitle
        text="Create account"
        className="text-4xl md:text-5xl font-extrabold tracking-wide text-gray-900"
      />
      <FormText
        text="Join us to start taking better notes."
        className="text-sm md:text-base text-gray-500"
      />
    </div>
  );
}
