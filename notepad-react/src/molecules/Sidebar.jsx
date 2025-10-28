import IconButton from "../atoms/IconButton";
import Section from "./Section";
import NavItem from "./NavItem";
import axios from "axios";

import { Search, Settings, Star, Trash2, Clock, Tag, Folder, LogOut } from "lucide-react";

 const baseURL = import.meta.env.VITE_API_URL ||"http://localhost:8000" ;
export default function Sidebar(props) {

  const handleDelete = async () => {
  try {
    const res = await axios.get(`${baseURL}/logout`, {
      withCredentials: true, 
    });

    if (res.status === 200) {
      window.location.href = "/login"; 
    }
  } catch (err) {
    console.error("Error al cerrar sesión:", err);
  }
};

  return (
    <aside className={"hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col border-r border-neutral-200 bg-white/70 backdrop-blur " + (props.className || "")}>
      {/* Brand + actions */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-neutral-100 ring-1 ring-neutral-200 grid place-items-center font-semibold">Q</div>
        <div className="text-lg font-semibold tracking-tight">QuickNote</div>
        <div className="ml-auto flex items-center gap-2">
          <IconButton aria-label="Settings"><Settings size={18} /></IconButton>
        </div>
      </div>

      {/* Profile */}
      <div className="mx-3 mb-3 rounded-xl ring-1 ring-neutral-200 bg-white p-3 flex items-center gap-3">
        <img src={props.avatar || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlci1pY29uIGx1Y2lkZS11c2VyIj48cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg=="}
         alt="avatar" className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200" />
        <div className="min-w-0">
          <div className="text-sm font-semibold">{props.userName || "User Name"}</div>
          <div className="text-xs text-neutral-500 truncate">{props.userEmail || "user@mail.com"}</div>
        </div>
        <IconButton className="ml-auto" aria-label="Logout" onClick={handleDelete}>
          <LogOut size={16} />
        </IconButton>
      </div>


      <Section title="QUICK LINKS">
        <NavItem
          active={props.activeSection === "all"}
          onClick={props.onAllNotes}
        >
          All Notes
          <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded md:mr-1">
            {props.noteLength || 0}
          </span>
        </NavItem>

        <NavItem
          icon={<Star size={16} className="text-amber-500" />}
          active={props.activeSection === "favorites"}
          onClick={props.onFavorites}
        >
          Favorites
          <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            {props.favCont}
          </span>
        </NavItem>

        <NavItem
          icon={<Clock size={16} />}
          active={props.activeSection === "archived"}
          onClick={props.onArchived}
        >
          Archived
          <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            {props.archCont}
          </span>
        </NavItem>

        <NavItem
          icon={<Trash2 size={16} />}
          active={props.activeSection === "deleted"}
          onClick={props.onDeleted}
        >
          Recently Deleted
        </NavItem>
      </Section>
    </aside>
  );
}
