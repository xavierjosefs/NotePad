import FormText from "../atoms/FormText";
import Input from "../atoms/Input";

export default function EmailForm() {
  return (
    <div className="w-full">
      <FormText
        text="Email"
        className="block text-sm font-medium text-gray-700"
      />
      <Input
        type="email"
        placeholder="Enter your email"
        name="email"
        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
      />
    </div>
  );
}
