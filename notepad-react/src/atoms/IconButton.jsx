export default function IconButton(props) {
  return (
    <button
      className={
        "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 hover:bg-neutral-50 " +
        (props.className || "")
      }
      onClick={props.onClick}
      aria-label={props["aria-label"]}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
