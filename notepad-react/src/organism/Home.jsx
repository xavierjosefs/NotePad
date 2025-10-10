import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../molecules/Sidebar";
import NotesColumn from "../molecules/NotesColumn";
import PreviewColumn from "../molecules/PreviewColumn";

export default function Home() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [noteLength, setNoteLength] = useState(0);
  const [noteFavorite, setNoteFavorite] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");`  `

  axios.defaults.withCredentials = true;
  const baseURL = "http://localhost:8000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authRes = await axios.get(`${baseURL}/`, { withCredentials: true });
        if (authRes.status === 200) {
          setAuth(true);
          const notesRes = await axios.get(`${baseURL}/api/user/notes`, {
            withCredentials: true,
          });
          setNotes(notesRes.data.notes || []);
          setSelectedId(notesRes.data.notes[0]?.id || null);
          setNoteLength(notesRes.data.notes.length || 0)

          var favCont = 0;
          for (let i = 0; i < notesRes.data.notes.length; i++) {
            if(notesRes.data.notes[i].favorite === true){
              favCont++
            }    
          }
          setNoteFavorite(favCont || 0);

          const profileRes = await axios.get(`${baseURL}/api/user/profile`, {
            withCredentials: true,
          });
          setName(profileRes.data[0].full_name || "")
          setEmail(profileRes.data[0].email || "")         
          
        } else {
          setAuth(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setAuth(false);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // 🧠 NO pongas Hooks después de un return condicional

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId),
    [notes, selectedId]
  );

  const handleFavorite = async () => {
    await axios.put(
    `${baseURL}/api/user/notes/favorite`,
    { noteId: selectedId },
    { withCredentials: true }
  );

    setNotes(prevNotes =>
      prevNotes.map(n =>
        n.id === selectedId ? { ...n, favorite: !n.favorite } : n
      )
    );

    setNoteFavorite(prev =>
      notes.find(n => n.id === selectedId)?.favorite ? prev - 1 : prev + 1
    );
  }

  // ✅ Render condicional dentro del mismo flujo
  if (auth === null) {
    return <p className="text-center mt-10 text-gray-500">Cargando...</p>;
  }

  if (!auth) {
    return <p className="text-center mt-10 text-gray-500">Redirigiendo al login...</p>;
  }

  // ✅ Render normal
  return (
    <main className="min-h-screen flex">
      <Sidebar userName={name} userEmail={email} noteLength={noteLength} favCont={noteFavorite} />
      <NotesColumn
        notes={notes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        title="All Notes"
      />
      <PreviewColumn note={selected} onFavorite={handleFavorite}/>
    </main>
  );
}

