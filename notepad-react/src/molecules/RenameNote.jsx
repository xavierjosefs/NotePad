// src/molecules/RenameNote.jsx
import Modal from "../atoms/Modal";
import FormTitle from "../atoms/FormTitle";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { useState } from "react";

export default function RenameNote(props) {
  const { isOpen, currentTitle, onSave, onCancel } = props;
  const [newTitle, setNewTitle] = useState(currentTitle || "");

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <FormTitle text="Rename Note" className="text-lg font-bold mb-3" />
      <Input
        type="text"
        name="title"
        placeholder="Enter new title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-gray-900/10 outline-none"
      />
      <div className="flex gap-3 justify-center">
        <Button
          text="Cancel"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        />
        <Button
          text="Save"
          onClick={() => onSave(newTitle)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        />
      </div>
    </Modal>
  );
}
