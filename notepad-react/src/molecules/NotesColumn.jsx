import IconButton from "../atoms/IconButton";
import SearchInput from "./SearchInput";
import NoteCard from "../molecules/NoteCard";
import { Plus } from "lucide-react";

export default function NotesColumn(props) {
  const notes = props.notes || [];

  return (
    <section
      className={
        "flex-1 min-w-0 border-r border-neutral-200 bg-neutral-50/40 " +
        (props.className || "")
      }
    >
      {/* 🔝 Header */}
      <div className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
        <div className="h-14 px-4 md:px-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold mr-auto">
            {props.title || "All Notes"}
          </h2>

          {/* 🔍 Barra de búsqueda */}
          <SearchInput
            value={props.searchTerm || ""}
            onChange={(e) => props.onSearchChange?.(e.target.value)}
            placeholder="Search notes..."
          />

          {/* ➕ Botón crear nota */}
          <button
            onClick={props.onCreate}
            className="h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* 📝 Lista de notas */}
      <div className="p-4 md:p-6 space-y-3">
        {notes.length === 0 ? (
          <p className="text-center text-neutral-400 mt-10">
            No notes found
          </p>
        ) : (
          notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              active={props.selectedId === n.id}
              onClick={() => props.onSelect?.(n.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}
