export default function NavItem(props) {
  const active = !!props.active;
  const base =
    "w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ring-1 transition ";
  const cls = active
    ? "bg-rose-50/60 ring-rose-100 text-rose-700"
    : "bg-white ring-neutral-200 text-neutral-700 hover:bg-neutral-50";

  return (
    <button className={base + cls + " " + (props.className || "")} onClick={props.onClick}>
      <span className="shrink-0 h-5 w-5 grid place-items-center">
        {props.icon || <span className="h-2.5 w-2.5 rounded-[6px] bg-neutral-300 inline-block" />}
      </span>
      <span className="truncate">{props.children}</span>
    </button>
  );
}
