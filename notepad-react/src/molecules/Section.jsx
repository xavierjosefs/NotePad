export default function Section(props) {
  return (
    <div className={"px-3 " + (props.className || "")}>
      <div className="px-1 pt-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-500">
        {props.title}
      </div>
      <div className="space-y-1">{props.children}</div>
    </div>
  );
}
