import { useEffect, useState} from 'react'
import axios from "axios";

const App = () => {
  console.log("dom render")
  const [note, setnote] = useState([])
  const [popup, setPopup] = useState(false)
  const [editpopup, seteditPopup] = useState(false)

  function fetchNotes() {
    axios.get("http://localhost:3000/notes")
      .then((res)=>{
        setnote(res.data.notes)
      })
  }

  useEffect(()=>{
    fetchNotes()
  },[])

  function hendlersub(e) {
    e.preventDefault()
    const {title, description} = e.target.elements

    axios.post("http://localhost:3000/notes",{
      title: title.value,
      description: description.value
    })
    fetchNotes()
  }

  function deletehedler(noteId){
    axios.delete("http://localhost:3000/notes/"+noteId)
    fetchNotes()
  }

  function hendleedit(e, noteId){
    e.preventDefault()
    const {newtitle, newdescription} = e.target.elements
    console.log(newtitle.value, newdescription.value)
    console.log("noteId:", noteId)

    axios.patch("http://localhost:3000/notes/"+noteId, {
      title: newtitle.value,
      description: newdescription.value
    })
    fetchNotes()
  }


  return (
    <>
      <div className='nav'>
        <ul>
          <li>All</li>
          <li>Fevorite</li>
        </ul>
        <button className="note-create-btn" onClick={() => setPopup(!popup)}>
          <i className="ri-add-circle-line"></i> Add new note
        </button>
      </div>

      {/* add popup ------------------------------- */}
      <div className="addpopup" style={{ display: popup ? "flex" : "none" }} onClick={() => setPopup(!popup)}>
        <form className="note-create-from" onSubmit={hendlersub} onClick={(e) => e.stopPropagation()}>
          <h4>Title</h4>
          <input name='title' type="text" className='title' placeholder='Enter your topic' required/>
          <h4>Description</h4>
          <textarea name='description' type="text" className='discription' placeholder='Enter some description'/>
          <button className='btn' onClick={() => {setPopup(!popup), fetchNotes()}}>Submit</button>
        </form>
      </div>

      {/* eddit popup ------------------------------------*/}
      {note.map((note)=>{
          return <div className="editpopup" style={{ display: editpopup ? "flex" : "none" }} onClick={() => seteditPopup(!editpopup)}>
         <form className="note-create-from" onSubmit={(e)=>hendleedit(e,note._id)} onClick={(e) => e.stopPropagation()}>
            <h2>Eddit Note</h2>
            <h4>Title</h4>
            <input name='newtitle' defaultValue={note.title} type="text" className='title' placeholder='Enter your topic' required/>
            <h4>Description</h4>
            <textarea name='newdescription' defaultValue={note.description} type="text" className='discription' placeholder='Enter some description'/>
            <button className='btn' >Submit</button>
          </form>
        </div>
      })}
      

      {/* notes section ----------------------------------------- */}
      <div className="notes">
        {note.map((note)=>{
          return <div className="note">
            <h1>{note.title}</h1>
            <div className="info">
              <p>{note.description}</p>
              <div className="btns">
                <div className="deletebtn" onClick={()=>{deletehedler(note._id),fetchNotes()}}><i className="ri-delete-bin-7-line"></i></div>
                <div className="likebtn"><i className="ri-heart-3-line"></i></div>
                <div className="editbtn" onClick={() => seteditPopup(!editpopup)}>
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