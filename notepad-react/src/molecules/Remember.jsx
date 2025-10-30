import Input from "../atoms/Input";
import FormText from "../atoms/FormText";
import  Link  from "../atoms/HyperLink";

export default function Remenber() {
  return (
    <div className="mt-3 flex items-center justify-between text-sm">
      <label htmlFor="remember" className="inline-flex items-center gap-2">
        <Input
          type="checkbox"
          name="remember"
          className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
        />
        <FormText text="Remember me" className="text-gray-700" />
      </label>
      <Link
        text="Forgot your password?"
        click="/ForgotPassword"
        className="font-medium text-blue-500 hover:underline"
      />
    </div>
  );
}
