// NavItem.jsx
export default function NavItem(props) {
  const base =
    "w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition";
  const active =
    "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
  const inactive =
    "text-neutral-700 hover:bg-neutral-100";

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${base} ${props.active ? active : inactive} ${props.className || ""}`}
    >
      {props.icon ? <span className="shrink-0">{props.icon}</span> : null}
      <span className="truncate">{props.children}</span>
    </button>
  );
}
