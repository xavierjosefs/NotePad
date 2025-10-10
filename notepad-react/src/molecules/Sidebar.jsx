import IconButton from "../atoms/IconButton";
import Section from "./Section";
import NavItem from "./NavItem";
import axios from "axios";

import { Search, Settings, Star, Trash2, Clock, Tag, Folder, LogOut } from "lucide-react";

export default function Sidebar(props) {
  const TAGS = props.tags || ["School Related","Church Sermons","Movies and Games","Family Trip","Love Life"];
  const FOLDERS = props.folders || [
    {name:"2023",count:34},{name:"2022",count:36},{name:"2021",count:40},{name:"2020",count:23},{name:"2019",count:18}
  ];
  const handleDelete = () => {
    axios.get("http://localhost:8000/logout")
    .then(res => {
      location.reload(true);
    }).catch(err => console.log(err))
  }

  return (
    <aside className={"hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col border-r border-neutral-200 bg-white/70 backdrop-blur " + (props.className || "")}>
      {/* Brand + actions */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-neutral-100 ring-1 ring-neutral-200 grid place-items-center font-semibold">Q</div>
        <div className="text-lg font-semibold tracking-tight">QuickQuill</div>
        <div className="ml-auto flex items-center gap-2">
          <IconButton aria-label="Search"><Search size={18} /></IconButton>
          <IconButton aria-label="Settings"><Settings size={18} /></IconButton>
        </div>
      </div>

      {/* Profile */}
      <div className="mx-3 mb-3 rounded-xl ring-1 ring-neutral-200 bg-white p-3 flex items-center gap-3">
        <img src={props.avatar || "https://i.pravatar.cc/40?img=14"} alt="avatar" className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200" />
        <div className="min-w-0">
          <div className="text-sm font-semibold">{props.userName || "User Name"}</div>
          <div className="text-xs text-neutral-500 truncate">{props.userEmail || "user@mail.com"}</div>
        </div>
        <IconButton className="ml-auto" aria-label="Logout" onClick={handleDelete}>
          <LogOut size={16} />
        </IconButton>
      </div>

      <Section title="QUICK LINKS">
        <NavItem active onClick={props.onAllNotes}>All Notes <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded md:mr-1">{props.noteLength || 0}</span></NavItem>
        <NavItem icon={<Star size={16} className="text-amber-500" />} onClick={props.onFavorites}>Favorites <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{props.favCont}</span></NavItem>
        <NavItem icon={<Clock size={16} />} onClick={props.onArchived}>Archived</NavItem>
        <NavItem icon={<Trash2 size={16} />} onClick={props.onDeleted}>Recently Deleted</NavItem>
      </Section>

      <Section title="TAGS">
        {TAGS.map((t) => (
          <NavItem key={t} icon={<Tag size={16} />} onClick={() => props.onTagClick?.(t)}>{t}</NavItem>
        ))}
      </Section>

      <Section title="FOLDERS" className="mb-4">
        {FOLDERS.map((f) => (
          <NavItem key={f.name} icon={<Folder size={16} />} onClick={() => props.onFolderClick?.(f.name)}>
            {f.name}
            <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{f.count}</span>
          </NavItem>
        ))}
      </Section>
    </aside>
  );
}
