// src/molecules/RenameNote.jsx
import Modal from "../atoms/Modal";
import FormTitle from "../atoms/FormTitle";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useEffect, useMemo, useState } from "react";

export default function RenameNote(props) {
  const { isOpen, currentTitle, onSave, onCancel } = props;
  const [newTitle, setNewTitle] = useState(currentTitle || "");
  const normalizedCurrent = useMemo(
    () => (currentTitle || "").trim(),
    [currentTitle]
  );
  const normalizedNew = (newTitle || "").trim();

  useEffect(() => {
    setNewTitle(currentTitle || "");
  }, [currentTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") || "").toString().trim();

    if (!title) return;
    if (title === normalizedCurrent) return;

    onSave?.(title);
    setNewTitle("");
    onCancel?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <FormTitle text="Rename Note" className="text-lg font-bold mb-3" />

        <Input
          type="text"
          name="title"                    // <- clave para FormData
          placeholder="Enter new title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-gray-900/10 outline-none"
          autoFocus
        />

        <div className="flex gap-3 justify-center">
          <Button
            text="Cancel"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          />
          <Button
            text="Save"
            type="submit"
            className={
              "px-4 py-2 rounded-lg text-white " +
              (normalizedNew && normalizedNew !== normalizedCurrent
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 cursor-not-allowed")
            }
          />
        </div>
      </form>
    </Modal>
  );
}
