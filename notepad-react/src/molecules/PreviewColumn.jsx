import { useState } from "react";
import IconButton from "../atoms/IconButton";
import { Star, MoreHorizontal, Trash2, Edit3, Clock } from "lucide-react";
import ConfirmAction from "../molecules/ConfirmAction";
import RenameNote from "../molecules/RenameNote";

export default function PreviewColumn(props) {
  const note = props.note;
  const [openMenu, setOpenMenu] = useState(false);
  const [modalType, setModalType] = useState(null); // "delete" | "archive" | "rename"

  const openModal = (type) => {
    setModalType(type);
    setOpenMenu(false);
  };

  const closeModal = () => setModalType(null);

  const handleConfirm = () => {
    if (modalType === "delete") props.onDelete?.(note.id);
    if (modalType === "archive") props.onArchive?.(note.id);
    closeModal();
  };

  if (!note) {
    return (
      <section className="hidden xl:flex xl:w-[34rem] shrink-0 bg-white/60 backdrop-blur items-center justify-center text-neutral-400">
        Select a note to preview
      </section>
    );
  }

  return (
    <>
      <section className="hidden xl:flex xl:w-[34rem] shrink-0 flex-col bg-white">
        <div className="h-14 px-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="font-semibold">{note.title}</div>

          <div className="flex items-center gap-2">
            <IconButton aria-label="Favorite" onClick={props.onFavorite}>
              <Star
                size={18}
                className={note.favorite ? "text-amber-500" : "text-neutral-400"}
                fill={note.favorite ? "currentColor" : "none"}
              />
            </IconButton>

            {/* Menú simple */}
            <div className="relative">
              <IconButton aria-label="More" onClick={() => setOpenMenu((v) => !v)}>
                <MoreHorizontal size={16} />
              </IconButton>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-gray-200 shadow-lg">
                  <button onClick={() => openModal("rename")} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100">
                    <Edit3 size={16} /> Rename
                  </button>
                  <button onClick={() => openModal("archive")} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100">
                    <Clock size={16} /> Archive
                  </button>
                  <button onClick={() => openModal("delete")} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-neutral-700 leading-7">{note.content_md}</p>
        </div>
      </section>

      {/* 🧩 Modales dinámicos */}
      {modalType === "rename" && (
        <RenameNote
          isOpen={true}
          currentTitle={note.title}
          onCancel={closeModal}
          onSave={(newTitle) => {
            props.onRename?.(note.id, newTitle);
            closeModal();
          }}
        />
      )}

      {(modalType === "delete" || modalType === "archive") && (
        <ConfirmAction
          isOpen={true}
          title={modalType === "delete" ? "Delete Note" : "Archive Note"}
          message={
            modalType === "delete"
              ? "Are you sure you want to delete this note? This action cannot be undone."
              : "Do you want to archive this note? You can restore it later."
          }
          onConfirm={handleConfirm}
          onCancel={closeModal}
        />
      )}
    </>
  );
}
