import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../molecules/Sidebar";
import NotesColumn from "../molecules/NotesColumn";
import PreviewColumn from "../molecules/PreviewColumn";
import CreateNoteModal from "../molecules/CreateNoteModal";

export default function Home() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [noteLength, setNoteLength] = useState(0);
  const [noteFavorite, setNoteFavorite] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeSection, setActiveSection] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [noteArchived, setNoteArchived] = useState(0);       // archivadas
  const [searchTerm, setSearchTerm] = useState("");
  const [noteDeleted, setNoteDeleted] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);


  axios.defaults.withCredentials = true;
  const baseURL = "http://localhost:8000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authRes = await axios.get(`${baseURL}/`, { withCredentials: true });
        if (authRes.status === 200) {
          setAuth(true);
          
          // Cargar todas las notas (no archivadas)
          const notesRes = await axios.get(`${baseURL}/api/user/notes`, {
            withCredentials: true,
          });

          const allNotes = notesRes.data.notes || [];
          setNotes(allNotes);
          setSelectedId(allNotes[0]?.id || null);
          setNoteLength(allNotes.length || 0);

          // Contar favoritas dentro de las no archivadas
          const favCount = allNotes.filter(n => n.favorite && !n.archived).length;
          setNoteFavorite(favCount);

          // Cargar y contar archivadas
          const archiRes = await axios.get(`${baseURL}/api/archived/notes`, {
            withCredentials: true,
          });
          setNoteArchived(archiRes.data.archiNotes?.length || 0);

          //Cargar el perfil
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

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId),
    [notes, selectedId]
  );

  //Mostrar todas las notas
  const handleAllNotesClick = async () => {
    try {
    const allRes = await axios.get(`${baseURL}/api/user/notes`, { withCredentials: true });
    setNotes(allRes.data.notes || []);
    setSelectedId(allRes.data.notes[0]?.id || null);
    setActiveSection("all");
    setShowFavorites(false);
    setShowArchived(false);
    setActiveSection("all");
    } catch (err) {
      console.error("Error loading all notes:", err);
    }
  };
  
  //Mostrar la notas favoritas
  const handleFavoriteClick = async () => {
    try {
      if(!showFavorites) {
        const favRes = await axios.get(`${baseURL}/api/favorite/notes`, { withCredentials: true})
        setNotes(favRes.data.favNotes || [])
        setSelectedId(favRes.data.favNotes[0]?.id || null);
        setActiveSection("favorites");
        setShowArchived(false);
        setShowFavorites(true);
      } else { //Volver a mostrar todas
        const allRes = await axios.get(`${baseURL}/api/user/notes`, { withCredentials: true})
        setNotes(allRes.data.notes || []);
        setSelectedId(allRes.data.notes[0]?.id || null);
        setShowFavorites(false);

      }
      setActiveSection("favorites");
    } catch (error) {
      console.error("Error loading favorite notes:", error)
    }
  };

  //Mostrar la notas archivadas
  const handleArchivedClick = async () => {
    try {
      if(!showArchived) {
        const archiRes = await axios.get(`${baseURL}/api/archived/notes`, { withCredentials: true})
        setNotes(archiRes.data.archiNotes || [])
        setSelectedId(archiRes.data.archiNotes[0]?.id || null);
        setShowFavorites(false);
        setShowArchived(true);
        setActiveSection("archived");
      } else { //Volver a mostrar todas
        const allRes = await axios.get(`${baseURL}/api/user/notes`, { withCredentials: true})
        setNotes(allRes.data.notes || []);
        setSelectedId(allRes.data.notes[0]?.id || null);
        setShowArchived(false);
      }
      setActiveSection("archived");
    } catch (error) {
      console.error("Error loading favorite notes:", error)
    }
  };

  //volver una nota a favorita
  const handleFavorite = async () => {
    try {
      await axios.put(
        `${baseURL}/api/user/notes/favorite`,
        { noteId: selectedId },
        { withCredentials: true }
      );

      const currentNote = notes.find(n => n.id === selectedId);
      if (!currentNote) return;

      const wasFavorite = currentNote.favorite;

      const updatedNotes = notes.map(n =>
        n.id === selectedId ? { ...n, favorite: !n.favorite } : n
      );

      let filteredNotes = updatedNotes;
      if (activeSection === "favorites" && wasFavorite) {
        filteredNotes = updatedNotes.filter(n => n.id !== selectedId);
        setSelectedId(filteredNotes[0]?.id || null);
      }
      // Ajustar contador de favoritas
      setNoteFavorite(prev =>
        wasFavorite ? Math.max(prev - 1, 0) : prev + 1
      );
      // Actualizar las notas visuales
      setNotes(filteredNotes);

    } catch (error) {
      console.error("Error updating favorite:", error);
      alert("Error updating favorite note");
    }
  };

  const handleCreateNote = async (title, content) => {
    try {
      const res = await axios.post(
        `${baseURL}/createnote`,
        { title, content },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setNotes(prev => [res.data.note, ...prev]);
        setNoteLength(prev => prev + 1);
        setShowModal(false);

        if (res.data.note?.id) {
          setSelectedId(res.data.note.id);
        }
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Error creating note");
    }
  };


  const handleDelete = async (noteId) => {
    try {
      await axios.put(
        `${baseURL}/api/user/note/delete`,
        { noteId },
        { withCredentials: true }
      );

      setNoteLength(noteLength - 1)
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

      if (selectedId === noteId) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note");
    }
  };

  const handleArchived = async () => {
    try {
      await axios.put(
        `${baseURL}/api/user/notes/archived`,
        { noteId: selectedId },
        { withCredentials: true }
      );

      const currentNote = notes.find(n => n.id === selectedId);
      if (!currentNote) return;

      const wasArchived = currentNote.archived; // estado previo

      const updatedNotes = notes.map(n =>
        n.id === selectedId ? { ...n, archived: !n.archived } : n
      );

      if (!wasArchived) {
        setNoteArchived(prev => prev + 1);
        setNoteLength(prev => Math.max(prev - 1, 0));
      } else {
        setNoteArchived(prev => Math.max(prev - 1, 0));
        setNoteLength(prev => prev + 1);
      }

      let filteredNotes = updatedNotes;

      if (activeSection !== "archived" && !wasArchived) {
        filteredNotes = updatedNotes.filter(n => n.id !== selectedId);
      }

      if (activeSection === "archived" && wasArchived) {
        filteredNotes = updatedNotes.filter(n => n.id !== selectedId);
      }

      setNotes(filteredNotes);

      setSelectedId(prevId =>
        filteredNotes.some(n => n.id === prevId) ? prevId : null
      );
    } catch (err) {
      console.error("Error archiving note:", err);
      alert("Error archiving note");
    }
  };

  const handleRename = async (noteId, newTitle) => {
    try {
      const res = await axios.put(
        `${baseURL}/api/note/change-title`,
        { noteId, newTitle },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const updated = res.data.note;
        setNotes(prev =>
          prev.map(n => (n.id === updated.id ? { ...n, title: updated.title } : n))
        );
      }
    } catch (err) {
      console.error("Error renaming note:", err);
      alert("Error updating note title");
    }
  };

  const handleDeletedClick = async () => {
    try {
      if (!showDeleted) {
        const delRes = await axios.get(`${baseURL}/api/deleted/notes`, { withCredentials: true });
        setNotes(delRes.data.deletedNotes || []);
        setSelectedId(delRes.data.deletedNotes[0]?.id || null);
        setShowDeleted(true);
        setActiveSection("deleted");
        setShowFavorites(false);
        setShowArchived(false);
      } else {
        await handleAllNotesClick();
        setShowDeleted(false);
      }
    } catch (err) {
      console.error("Error loading deleted notes:", err);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      await axios.put(`${baseURL}/api/note/restore`, { noteId }, { withCredentials: true });
      setNotes(prev => prev.filter(n => n.id !== noteId));
      setNoteDeleted(prev => Math.max(prev - 1, 0));
      setNoteLength(prev => prev + 1);
    } catch (err) {
      console.error("Error restoring note:", err);
      alert("Error restoring note");
    }
  };

  const handlePermanentDelete = async (noteId) => {
    try {
      await axios.delete(`${baseURL}/api/note/permanent-delete`, {
        data: { noteId },
        withCredentials: true,
      });
      setNotes(prev => prev.filter(n => n.id !== noteId));
      setNoteDeleted(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error deleting permanently:", err);
      alert("Error deleting permanently");
    }
  };




// Filtrar las notas según el texto de búsqueda
const filteredNotes = useMemo(() => {
  if (!searchTerm.trim()) return notes;
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.content_md && n.content_md.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}, [notes, searchTerm]);


  //Manejo de estados de autenticación
  if (auth === null) {
    return <p className="text-center mt-10 text-gray-500">Cargando...</p>;
  }

  if (!auth) {
    return <p className="text-center mt-10 text-gray-500">Redirigiendo al login...</p>;
  }

  //Render normal
  return (
    <main className="min-h-screen flex">
      <Sidebar
        userName={name}
        userEmail={email}
        noteLength={noteLength}
        favCont={noteFavorite}
        archCont={noteArchived}
        deletedCount={noteDeleted}
        onAllNotes={handleAllNotesClick}
        onFavorites={handleFavoriteClick}
        onArchived={handleArchivedClick}
        onDeleted={handleDeletedClick}
        activeSection={activeSection}
      />

      <NotesColumn
        notes={filteredNotes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        title={
          activeSection === "favorites"
            ? "Favorite Notes"
            : activeSection === "archived"
            ? "Archived Notes"
            : activeSection === "deleted"
            ? "Recently Deleted"
            : "All Notes"
        }
        onCreate={() => setShowModal(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <PreviewColumn
        note={selected}
        onFavorite={handleFavorite}
        onDelete={handleDelete}
        onArchive={handleArchived}
        onRename={handleRename}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        activeSection={activeSection}
      />

      <CreateNoteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateNote}
      />
    </main>
  );
}

