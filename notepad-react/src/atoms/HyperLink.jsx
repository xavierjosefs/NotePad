// src/components/atoms/HyperLink.jsx
import { Link } from "react-router-dom";

export default function HyperLink({ text, click, className }) {
  return (
    <Link
      to={click}
      className={className}
    >
      {text}
    </Link>
  );
}
