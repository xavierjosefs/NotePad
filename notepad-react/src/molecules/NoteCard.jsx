import Badge from "../atoms/Badge";
import { MoreHorizontal } from "lucide-react";

export default function NoteCard(props) {
  const note = props.note;
  const active = !!props.active;

  return (
    <button
      onClick={props.onClick}
      className={
        "w-full text-left rounded-xl bg-white ring-1 transition p-4 md:p-5 flex gap-3 items-start " +
        (active ? "ring-rose-200 bg-rose-50/50" : "ring-neutral-200 hover:bg-neutral-50") +
        " " +
        (props.className || "")
      }
      type={props.type}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="font-semibold text-neutral-900 truncate">{note.title}</div>
          {note.pin ? <Badge>📌 Pinned</Badge> : null}
        </div>
        <div className="text-sm text-neutral-500 truncate mt-0.5">{note.excerpt}</div>
        <div className="flex items-center gap-2 mt-3">
          <Badge>✍️</Badge>
          <Badge>{note.date}</Badge>
          {note.tags?.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
    </button>
  );
}
