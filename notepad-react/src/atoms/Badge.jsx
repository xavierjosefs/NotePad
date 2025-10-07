export default function Badge(props) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] px-2 py-1 ring-1 ring-neutral-200 " +
        (props.className || "")
      }
    >
      {props.children}
    </span>
  );
}
