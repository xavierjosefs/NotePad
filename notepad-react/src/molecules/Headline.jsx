import FormTitle from "../atoms/FormTitle";
import FormText from "../atoms/FormText";

export default function Headline() {
  return (
    <div className="space-y-1">
      <FormTitle
        text="Welcome Back"
        className="text-4xl md:text-5xl font-extrabold tracking-wide text-gray-900"
      />
      <FormText
        text="Welcome back! Please enter your details."
        className="text-sm md:text-base text-gray-500"
      />
    </div>
  );
}
