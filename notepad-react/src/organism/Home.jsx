// src/pages/Home.jsx
import { useMemo, useState } from "react";
/* Si quieres iconos: npm i lucide-react */
import {
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  Clock,
  Tag,
  Folder,
  MoreHorizontal,
  LogOut,
} from "lucide-react";

/* ----------- MOCK DATA ----------- */
const TAGS = [
  "School Related",
  "Church Sermons",
  "Movies and Games",
  "Family Trip",
  "Love Life",
];

const FOLDERS = [
  { name: "2023", count: 34 },
  { name: "2022", count: 36 },
  { name: "2021", count: 40 },
  { name: "2020", count: 23 },
  { name: "2019", count: 18 },
];

const NOTES = [
  {
    id: "n1",
    title: "Prayer as an Anchor",
    excerpt: "Some note context come over to the second line…",
    date: "5, Dec 2023 • 4:58PM",
    tags: ["Sermons"],
    pin: true,
  },
  {
    id: "n2",
    title: "Things to get for school",
    excerpt: "School is resuming on the 8th of January and I…",
    date: "5, Dec 2023 • 4:58PM",
    tags: ["School Related"],
  },
  {
    id: "n3",
    title: "Trip to Zanzibar with the Fam",
    excerpt: "Christmas holidays was quite an interesting…",
    date: "5, Dec 2023 • 4:58PM",
    tags: ["Sermons"],
  },
  {
    id: "n4",
    title: "My Date with Mayowa",
    excerpt: "Had the wildest fun I’ve ever has today with…",
    date: "5, Dec 2023 • 4:58PM",
    tags: ["Sermons"],
  },
];

/* ----------- ATOMS ----------- */
const IconButton = ({ children, className = "", ...props }) => (
  <button
    className={
      "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 hover:bg-neutral-50 " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 text-neutral-700 text-[11px] px-2 py-1 ring-1 ring-neutral-200">
    {children}
  </span>
);

/* ----------- SIDEBAR ----------- */
function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col border-r border-neutral-200 bg-white/70 backdrop-blur">
      {/* Brand + actions */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-neutral-100 ring-1 ring-neutral-200 grid place-items-center font-semibold">
          Q
        </div>
        <div className="text-lg font-semibold tracking-tight">QuickQuill</div>
        <div className="ml-auto flex items-center gap-2">
          <IconButton aria-label="Search">
            <Search size={18} />
          </IconButton>
          <IconButton aria-label="Settings">
            <Settings size={18} />
          </IconButton>
        </div>
      </div>

      {/* Profile */}
      <div className="mx-3 mb-3 rounded-xl ring-1 ring-neutral-200 bg-white p-3 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40?img=14"
          alt="avatar"
          className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold">Adeoke Emmanuel</div>
          <div className="text-xs text-neutral-500 truncate">
            emmy4sureweb@gmail.com
          </div>
        </div>
        <IconButton className="ml-auto" aria-label="Logout">
          <LogOut size={16} />
        </IconButton>
      </div>

      {/* Quick links */}
      <Section title="QUICK LINKS">
        <NavItem active icon={<span className="i" />}>
          All Notes
          <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded md:mr-1">
            24
          </span>
        </NavItem>
        <NavItem icon={<Star size={16} className="text-amber-500" />}>
          Favorites
          <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            24
          </span>
        </NavItem>
        <NavItem icon={<Clock size={16} />} label="Archived">
          Archived
        </NavItem>
        <NavItem icon={<Trash2 size={16} />} label="Recently Deleted">
          Recently Deleted
        </NavItem>
      </Section>

      {/* Tags */}
      <Section title="TAGS">
        {TAGS.map((t) => (
          <NavItem key={t} icon={<Tag size={16} />} label={t}>
            {t}
          </NavItem>
        ))}
      </Section>

      {/* Folders */}
      <Section title="FOLDERS" className="mb-4">
        {FOLDERS.map((f) => (
          <NavItem key={f.name} icon={<Folder size={16} />}>
            {f.name}
            <span className="ml-auto text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
              {f.count}
            </span>
          </NavItem>
        ))}
      </Section>
    </aside>
  );
}

function Section({ title, children, className = "" }) {
  return (
    <div className={"px-3 " + className}>
      <div className="px-1 pt-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-500">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({ icon, children, active = false }) {
  return (
    <button
      className={
        "w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ring-1 transition " +
        (active
          ? "bg-rose-50/60 ring-rose-100 text-rose-700"
          : "bg-white ring-neutral-200 text-neutral-700 hover:bg-neutral-50")
      }
    >
      <span className="shrink-0 h-5 w-5 grid place-items-center">
        {icon ?? (
          <span className="h-2.5 w-2.5 rounded-[6px] bg-neutral-300 inline-block" />
        )}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}

/* ----------- NOTES LIST (middle) ----------- */
function NotesColumn({ onSelect, selectedId }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NOTES;
    return NOTES.filter(
      (n) => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="flex-1 min-w-0 border-r border-neutral-200 bg-neutral-50/40">
      {/* top bar */}
      <div className="sticky top-0 z-10 bg-neutral-50/80 backdrop-blur border-b border-neutral-200">
        <div className="h-14 px-4 md:px-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold mr-auto">All Notes</h2>
          <div className="relative w-72 max-md:hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full rounded-xl bg-white ring-1 ring-neutral-200 px-9 py-2 text-sm outline-none focus:ring-neutral-400 shadow-sm"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
          <IconButton aria-label="New note">
            <Plus size={18} />
          </IconButton>
        </div>
      </div>

      {/* list */}
      <div className="p-4 md:p-6 space-y-3">
        {filtered.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            active={selectedId === n.id}
            onClick={() => onSelect(n.id)}
          />
        ))}
      </div>
    </section>
  );
}

function NoteCard({ note, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full text-left rounded-xl bg-white ring-1 transition p-4 md:p-5 flex gap-3 items-start " +
        (active
          ? "ring-rose-200 bg-rose-50/50"
          : "ring-neutral-200 hover:bg-neutral-50")
      }
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="font-semibold text-neutral-900 truncate">
            {note.title}
          </div>
          {note.pin && <Badge>📌 Pinned</Badge>}
          <button className="ml-auto text-neutral-400 hover:text-neutral-600">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="text-sm text-neutral-500 truncate mt-0.5">
          {note.excerpt}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge>✍️</Badge>
          <Badge>{note.date}</Badge>
          {note.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
    </button>
  );
}

/* ----------- PREVIEW (right) ----------- */
function PreviewColumn({ note }) {
  if (!note) {
    return (
      <section className="hidden xl:flex xl:w-[34rem] shrink-0 bg-white/60 backdrop-blur items-center justify-center text-neutral-400">
        Select a note to preview
      </section>
    );
  }

  return (
    <section className="hidden xl:flex xl:w-[34rem] shrink-0 flex-col bg-white">
      <div className="h-14 px-6 border-b border-neutral-200 flex items-center justify-between">
        <div className="font-semibold">{note.title}</div>
        <div className="flex items-center gap-2">
          <IconButton aria-label="Favorite">
            <Star size={16} />
          </IconButton>
          <IconButton aria-label="More">
            <MoreHorizontal size={16} />
          </IconButton>
        </div>
      </div>

      <div className="p-6 overflow-y-auto">
        <p className="text-neutral-700 leading-7">
          Today has been a very reflective day. I wrote about the lessons of
          life’s demands, how pausing helps me notice the profound details…
        </p>

        <div className="mt-6 aspect-video w-full rounded-xl bg-neutral-100 ring-1 ring-neutral-200" />

        <div className="mt-6 space-y-3">
          <p className="text-neutral-700">
            In the quiet moments, I find myself seeking meaning in little
            things. Writing anchors my thoughts and gives them a place to live…
          </p>
          <p className="text-neutral-700">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit
            exercitationem voluptatum fugiat…
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------- PAGE ----------- */
export default function Home() {
  const [selectedId, setSelectedId] = useState(NOTES[0]?.id);
  const selected = useMemo(
    () => NOTES.find((n) => n.id === selectedId),
    [selectedId]
  );

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <NotesColumn selectedId={selectedId} onSelect={setSelectedId} />
      <PreviewColumn note={selected} />
    </main>
  );
}
