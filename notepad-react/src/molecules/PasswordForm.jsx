import FormText from "../atoms/FormText";
import Input from "../atoms/Input";
import { useState } from "react";

export default function PasswordForm() {
  const [password, setPassword] = useState({
      password: ''
    })

  return (
    <div className="w-full relative">
      <FormText
        text="Password"
        className="block text-sm font-medium text-gray-700"
      />
      <Input
        type="password"
        placeholder="********"
        name="password"
        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 outline-none shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        onChange={e => setPassword({...password, password: e.target.value})}
      />
    </div>
  );
}
