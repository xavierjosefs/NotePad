import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../molecules/Sidebar";
import NotesColumn from "../molecules/NotesColumn";
import PreviewColumn from "../molecules/PreviewColumn";

const NOTES = [
  { id:"n1", title:"Prayer as an Anchor", excerpt:"Some note context come over to the second line…", date:"5, Dec 2023 • 4:58PM", tags:["Sermons"], pin:true },
  { id:"n2", title:"Things to get for school", excerpt:"School is resuming on the 8th of January and I…", date:"5, Dec 2023 • 4:58PM", tags:["School Related"] },
  { id:"n3", title:"Trip to Zanzibar with the Fam", excerpt:"Christmas holidays was quite an interesting…", date:"5, Dec 2023 • 4:58PM", tags:["Sermons"] },
  { id:"n4", title:"My Date with Mayowa", excerpt:"Had the wildest fun I’ve ever has today with…", date:"5, Dec 2023 • 4:58PM", tags:["Sermons"] },
];

export default function Home() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null); // null = cargando / desconocido

  const [selectedId, setSelectedId] = useState(NOTES[0]?.id);
  const selected = useMemo(() => NOTES.find(n => n.id === selectedId), [selectedId]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) setAuth(true);
        else {
          setAuth(false);
          navigate("/login");
        }
      })
      .catch(() => {
        setAuth(false);
        navigate("/login");
      });
  }, [navigate]);

  // ⬇️ AQUÍ va tu guard: antes del return del JSX
  if (auth === null) return null; // o un loader si prefieres
  if (!auth) return null;         // ya hiciste navigate('/login')

  // Usuario autenticado -> renderiza la página
  return (
    <main className="min-h-screen flex">
      <Sidebar userName="Adeoke Emmanuel" userEmail="emmy4sureweb@gmail.com" />
      <NotesColumn
        notes={NOTES}
        selectedId={selectedId}
        onSelect={setSelectedId}
        title="All Notes"
      />
      <PreviewColumn note={selected} />
    </main>
  );
}
