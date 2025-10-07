import { useMemo, useState } from "react";
import IconButton from "../atoms/IconButton";
import SearchInput from "../molecules/SearchInput";
import NoteCard from "../molecules/NoteCard";
import { Plus } from "lucide-react";

export default function NotesColumn(props) {
  const notes = props.notes || [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.excerpt || "").toLowerCase().includes(q)
    );
  }, [query, notes]);

  return (
    <section className={"flex-1 min-w-0 border-r border-neutral-200 bg-neutral-50/40 " + (props.className || "")}>
      <div className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
        <div className="h-14 px-4 md:px-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold mr-auto">{props.title || "All Notes"}</h2>
          <SearchInput value={query} onChange={setQuery} />
          <IconButton aria-label="New note" onClick={props.onCreate}>
            <Plus size={18} />
          </IconButton>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3">
        {filtered.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            active={props.selectedId === n.id}
            onClick={() => props.onSelect?.(n.id)}
          />
        ))}
      </div>
    </section>
  );
}
