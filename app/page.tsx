import DisplayNote from "./components/displayNote/displayNote";
import { noteType } from "./types/commonTypes";
import { pool } from "./utils/dbConnect"; 
import dbConnect from "./utils/dbConnect";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
   dbConnect()

   //Create
   async function CreateNote(data: any) {
    "use server"
    let note = data.get("note")?.valueOf()
    let date = data.get("date")?.valueOf()
    try {
      const newNote = await pool.query('INSERT INTO notes_table (note, date) VALUES ($1, $2) RETURNING *', [note, date])
      console.log(newNote.rows[0])
    } catch (error) {
      console.log(error)
    }
    redirect('/')
   }

     //READ
     const data = await pool.query("SELECT * FROM notes_table");
     const result = data.rows;

     //DELETE
     async function deleteNote(data:any) {
      "use server"
      let id = data.get("id").valueOf()

      try {
        await pool.query('DELETE FROM notes_table WHERE id = $1', [id]);
        console.log("note deleted")
      } catch (error) {
        console.log(error)
      }
      redirect('/')
     }

  return (
    <main className="m-10">
      
      <div className="m-5">
        <h1 className="text-center m-5">Add Note</h1>
      </div>  
      
      <form action={CreateNote} className="space-y-5">
          <input 
           type="text" 
           id="note"
           name="note"
           placeholder="Add Note"
           className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"/>

          <input 
           type="date" 
           id="date"
           name="date"
           placeholder="Add Date"
           className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"/>

          <button className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md">
            Submit
          </button>
        </form>
         <div>
          <h1 className="text-center font-bold m-5 mb-5">Display Note</h1>
         </div>
        {
                result.map((element:any) => (
                    <ul className="flex my-2" key={element.id}> {/* Assuming each element has a unique id */}
                        <li className="text-center w-[50%]">{element.note}</li>
                        <li className="text-center w-[30%]">{new Date(element.date).toLocaleDateString()}</li> {/* Convert date to string */}
                        <li className="flex text-center w-[20%]">
                          <Link href={"/edit/"+element.id}>
                            <button className="bg-red-400 font-bold text-white mr-2">
                                EDIT
                            </button> 
                            </Link>

                            <form action={deleteNote}>
                              <input type="hidden" name="id" value={element.id}/>
                            <button type="submit" className="bg-red-600 font-bold text-white">
                                DELETE
                            </button>
                            </form>
                        </li>
                    </ul>
                ))
            }
    </main>
    
  );
}
