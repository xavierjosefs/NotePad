import Button from "../atoms/Button";

export default function PrimaryButton() {
  return (
    <Button
      text="Sing in"
      className="mt-5 w-full rounded-xl bg-red-500 py-3 text-white font-semibold shadow-md transition hover:bg-red-600 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
      type="submit"
    />
  );
}
