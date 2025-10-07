import Input from "../atoms/Input";
import { Search } from "lucide-react";

export default function SearchInput(props) {
  return (
    <div className={"relative w-72 max-md:hidden " + (props.className || "")}>
      <Input
        type="text"
        name="q"
        placeholder={props.placeholder || "Search"}
        className={
          "w-full rounded-xl bg-white ring-1 ring-neutral-200 px-9 py-2 text-sm outline-none focus:ring-neutral-400 shadow-sm " +
          (props.inputClassName || "")
        }
        value={props.value}
        onChange={props.onChange}
      />
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
    </div>
  );
}
