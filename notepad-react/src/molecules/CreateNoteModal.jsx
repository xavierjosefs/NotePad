import Button from "../atoms/Button";
import Input from "../atoms/Input";
import FormText from "../atoms/FormText";
import FormTitle from "../atoms/FormTitle";

export default function CreateNoteModal(props) {
  if (!props.isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    props.onSubmit(title, content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <FormTitle
          text={props.titleText || "Create New Note"}
          className="text-2xl font-bold text-gray-900 mb-4"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormText
              text="Title"
              className="text-sm font-medium text-gray-700"
            />
            <Input
              name="title"
              placeholder="Enter note title"
              type="text"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              required
            />
          </div>

          <div>
            <FormText
              text="Content"
              className="text-sm font-medium text-gray-700"
            />
            <textarea
              name="content"
              placeholder="Write your note here..."
              rows="6"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 resize-none outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              text="Cancel"
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold"
              onClick={props.onClose}
            />
            <Button
              type="submit"
              text="Create"
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
