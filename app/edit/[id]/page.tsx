import { pool } from "@/app/utils/dbConnect";
import dbConnect from "@/app/utils/dbConnect";
import { redirect } from "next/navigation";

export default async function Edit({params}:any) {
    await dbConnect();
    
    const id = params.id;
    const data = await pool.query("SELECT * FROM notes_table WHERE id = $1", [id]);
    const result = data.rows[0]
    
    async function updateNote(data:any) {
        "use server"
        let note = data.get("note").valueOf();
        let date = data.get("date").valueOf();

        try {
            const updatedNote = await pool.query('UPDATE notes_table SET note=$1, date=$2 WHERE id = $3', [note, date, id]);
            console.log("note updated", updatedNote)
        } catch (error) {
            console.log("Error in updation", error);
        }
        redirect('/')
    }
    return(
        <main className="m-10">
            <div className="m-5">
                <h1 className="text-center m-5">Edit Note</h1>
            </div>  
            
            <form action={updateNote} className="space-y-5">
                <input 
                    type="text" 
                    id="note"
                    name="note"
                    placeholder="Add Note"
                    defaultValue={result.note}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />

                <input 
                    type="date" 
                    id="date"
                    name="date"
                    placeholder="Add Date"
                    defaultValue={result.date}
                    className="shadow-lg rounded-md shadow-black h-10 p-3 w-[100%]"
                />

                <button className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md">
                    Submit
                </button>
            </form>
            
          
        </main>
    );
}
