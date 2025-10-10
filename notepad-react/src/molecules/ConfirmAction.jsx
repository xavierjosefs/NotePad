// src/molecules/ConfirmAction.jsx
import Modal from "../atoms/Modal";
import FormTitle from "../atoms/FormTitle";
import FormText from "../atoms/FormText";
import Button from "../atoms/Button";

export default function ConfirmAction(props) {

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
            text="Confirm"
            onClick={props.onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          />
        </div>
      </div>
    </Modal>
  );
}
