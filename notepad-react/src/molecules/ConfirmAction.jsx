// src/molecules/ConfirmAction.jsx
import Modal from "../atoms/Modal";
import FormTitle from "../atoms/FormTitle";
import FormText from "../atoms/FormText";
import Button from "../atoms/Button";

export default function ConfirmAction(props) {
  // tone: "danger" | "success" | "warning" | "primary"
  const tone = props.tone || "danger";
  const confirmText = props.confirmText || "Confirm";

  const toneClass =
    tone === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : tone === "success"
      ? "bg-green-600 hover:bg-green-700 text-white"
      : tone === "warning"
      ? "bg-amber-500 hover:bg-amber-600 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <Modal isOpen={props.isOpen} onClose={props.onCancel}>
      <div className="space-y-4">
        <FormTitle text={props.title} className="text-lg font-bold text-gray-900" />
        <FormText text={props.message} className="text-sm text-gray-600" />

        <div className="flex gap-3 justify-center mt-4">
          <Button
            text="Cancel"
            onClick={props.onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          />
          <Button
            text={confirmText}
            onClick={props.onConfirm}
            className={"px-4 py-2 rounded-lg " + toneClass}
          />
        </div>
      </div>
    </Modal>
  );
}
