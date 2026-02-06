import { useEffect, useState} from 'react'
import axios from "axios";

const App = () => {
  console.log("dom render")
  const [note, setnote] = useState([])
  const [popup, setPopup] = useState(false)
  const [editpopup, seteditPopup] = useState(null)
  const [theme, setTheme] = useState("light")

  function fetchNotes() {
    axios.get("https://note-create-ztt3.onrender.com/notes")
      .then((res)=>{
        setnote(res.data.notes)
      })
  }

  useEffect(()=>{
    fetchNotes()
  },[])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  function hendlersub(e) {
    e.preventDefault()
    const {title, description} = e.target.elements

    axios.post("https://note-create-ztt3.onrender.com/notes",{
      title: title.value,
      description: description.value
    })
    fetchNotes()
  }

  function deletehedler(noteId){
    axios.delete("https://note-create-ztt3.onrender.com/notes/"+noteId).then(() => {
      fetchNotes()
    })
  }

  function hendleedit(e, noteId){
    e.preventDefault()
    const {newtitle, newdescription} = e.target.elements
    // console.log(newtitle.value, newdescription.value)
    // console.log("noteId:", noteId)

    axios.patch("https://note-create-ztt3.onrender.com/notes/"+noteId, {
      title: newtitle.value,
      description: newdescription.value
    })
    .then(()=>{
      fetchNotes()
    })
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256) + 50
    const g = Math.floor(Math.random() * 256) + 20
    const b = Math.floor(Math.random() * 256) + 80

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <>
      <div className='nav'>
        <ul>
          <li>All</li>
          <li>Fevorite</li>
        </ul>
        <input type="search" placeholder='Search your Note...' />
        <div className="right">
          <button className="note-create-btn" onClick={() => setPopup(!popup)}>
            <i className="ri-add-circle-line"></i> Add new note
          </button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ fontSize: "1.5rem", background: "transparent", border: "none", cursor: "pointer", marginRight: "4rem", color: "var(--text-color)" }}>
          {theme === "light" ? <i className="ri-moon-line"></i> : <i className="ri-sun-line"></i>}
          </button>
        </div>
      </div>

      {/* add popup ------------------------------- */}
      <div className="addpopup" style={{ display: popup ? "flex" : "none" }} onClick={() => setPopup(!popup)}>
        <form className="note-create-from" onSubmit={hendlersub} onClick={(e) => e.stopPropagation()}>
          <h2>Add New Note</h2>
          <h4>Title</h4>
          <input name='title' type="text" className='title' placeholder='Enter your topic' required/>
          <h4>Description</h4>
          <textarea name='description' type="text" className='discription' placeholder='Enter some description'/>
          <button className='btn' onClick={() => {setPopup(!popup), fetchNotes()}}>Create Note</button>
        </form>
      </div>

      {/* eddit popup ------------------------------------*/}
      {note.map((note)=>{
          return <div key={note._id} className="editpopup" style={{ display: editpopup === note._id ? "flex" : "none" }} onClick={() => seteditPopup(null)}>
         <form className="note-create-from" onSubmit={(e)=>hendleedit(e,note._id)} onClick={(e) => e.stopPropagation()}>
            <h2>Eddit Note</h2>
            <h4>Title</h4>
            <input name='newtitle' defaultValue={note.title} type="text" className='title' placeholder='Enter your topic' required/>
            <h4>Description</h4>
            <textarea name='newdescription' defaultValue={note.description} type="text" className='discription' placeholder='Enter some description'/>
            <button className='btn' onClick={()=>seteditPopup(null)} >Submit</button>
          </form>
        </div>
      })}
      

      {/* notes section ----------------------------------------- */}
      <div className="notes">
        {note.map((note)=>{
          return <div key={note._id} className="note" style={{ backgroundColor: getRandomColor() }}>
            <h1>{note.title}</h1>
            <div className="info" style={{ backgroundColor: getRandomColor() }}>
              <p>{note.description}</p>
              <div className="btns">
                <div className="deletebtn" onClick={()=>{deletehedler(note._id)}}><i className="ri-delete-bin-7-line"></i></div>
                <div className="likebtn"><i className="ri-heart-3-line"></i></div>
                <div className="editbtn" onClick={() => seteditPopup(note._id)}>
                  <i className="ri-pencil-fill" ></i>
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </>
  )
}

export default App