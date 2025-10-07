import IconButton from "../atoms/IconButton";
import { Star, MoreHorizontal } from "lucide-react";

export default function PreviewColumn(props) {
  const note = props.note;

  if (!note) {
    return (
      <section className={"hidden xl:flex xl:w-[34rem] shrink-0 bg-white/60 backdrop-blur items-center justify-center text-neutral-400 " + (props.className || "")}>
        {props.emptyText || "Select a note to preview"}
      </section>
    );
  }

  return (
    <section className={"hidden xl:flex xl:w-[34rem] shrink-0 flex-col bg-white " + (props.className || "")}>
      <div className="h-14 px-6 border-b border-neutral-200 flex items-center justify-between">
        <div className="font-semibold">{note.title}</div>
        <div className="flex items-center gap-2">
          <IconButton aria-label="Favorite" onClick={props.onFavorite}><Star size={16} /></IconButton>
          <IconButton aria-label="More"><MoreHorizontal size={16} /></IconButton>
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        <p className="text-neutral-700 leading-7">
          {props.previewText || "Static preview text… add your real content here."}
        </p>
        <div className="mt-6 aspect-video w-full rounded-xl bg-neutral-100 ring-1 ring-neutral-200" />
        <div className="mt-6 space-y-3">
          <p className="text-neutral-700">In the quiet moments…</p>
          <p className="text-neutral-700">Lorem ipsum dolor sit amet…</p>
        </div>
      </div>
    </section>
  );
}
