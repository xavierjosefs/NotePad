import FormText from "../atoms/FormText";
import Input from "../atoms/Input";
import { useState } from "react";

export default function PasswordForm() {
  const [name, setName] = useState({
      name: ''
    })

  return (
    <div className="w-full relative">
      <FormText
        text="Full Name"
        className="block text-sm font-medium text-gray-700"
      />
      <Input
        type="text"
        placeholder="Gabriela Diaz"
        name="name"
        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 outline-none shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        onChange={e => setName({...name, name: e.target.value})}
      />
    </div>
  );
}
