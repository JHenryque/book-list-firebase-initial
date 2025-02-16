/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase/config.js";

// eslint-disable-next-line react/prop-types
function Notes({ bookId }) {
  const handleEraseNote = async (id) => {
    if (confirm("Are you sure you want to erase this note?")) {
      try {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter((note) => note.id != id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const newNote = {
        book_id: bookId,
        title: document.querySelector("input[name=title]").value,
        text: document.querySelector("textarea[name=note]").value,
      };

      if (newNote.title && newNote.text) {
        const docRef = await addDoc(collection(db, "notes"), newNote);
        newNote.id = docRef.id;

        setNotes([...notes, newNote]);
        document.querySelector("input[name=title]").value = "";
        document.querySelector("textarea[name=note]").value = "";
      } else {
        alert("Please fill the mandatory fields.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotes = async (book_id) => {
    try {
      const q = query(collection(db, "notes"), where("book_id", "==", book_id));
      const querySnapshot = await getDocs(q);
      let notesList = [];
      querySnapshot.forEach((doc) => {
        notesList.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notesList);
      setFetchStatus("success");
    } catch (error) {
      console.log(error);
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    if (fetchStatus == "idle") {
      fetchNotes(bookId);
    }
  }, []);

  const [notes, setNotes] = useState("");
  const [fetchStatus, setFetchStatus] = useState("idle");

  //const notes = useSelector(selectNotes).filter(note => note.book_id == bookId);

  return (
    <>
      <div className="notes-wrapper">
        <h2>Reader's Notes</h2>

        {notes.length ? (
          <div className="notes">
            {notes.map((note) => (
              <div key={note.id} className="note">
                <div
                  onClick={() => handleEraseNote(note.id)}
                  className="erase-note"
                >
                  Erase note
                </div>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </div>
            ))}
          </div>
        ) : fetchStatus == "success" ? (
          <div>
            <p>
              This books doesn't have notes yet. Use the form below to add a
              note.
            </p>
          </div>
        ) : fetchStatus == "error" ? (
          <div>Error fetching book</div>
        ) : (
          <div>
            <h1>Loading...</h1>
          </div>
        )}

        <details>
          <summary>Add a note</summary>
          <form className="add-note">
            <div className="form-control">
              <label>Title *</label>
              <input type="text" name="title" placeholder="Add a note title" />
            </div>
            <div className="form-control">
              <label>Note *</label>
              <textarea type="text" name="note" placeholder="Add note" />
            </div>

            <button
              onClick={(e) => {
                handleAddNote(e);
              }}
              className="btn btn-block"
            >
              Add Note
            </button>
          </form>
        </details>
      </div>
    </>
  );
}

export default Notes;
