import { pool } from "@/app/utils/dbConnect";
import dbConnect from "@/app/utils/dbConnect";

export default async function DisplayNote(){
    await dbConnect();

    //READ
    const data = await pool.query("SELECT * FROM notes_table");
    const result = data.rows;

    return(
        <>
            {
                result.map((element) => (
                    <ul className="flex my-2" key={element.id}> {/* Assuming each element has a unique id */}
                        <li className="text-center w-[50%]">{element.note}</li>
                        <li className="text-center w-[30%]">{new Date(element.date).toLocaleDateString()}</li> {/* Convert date to string */}
                        <li className="text-center w-[20%]">
                            <button className="bg-red-400 font-bold text-white mr-2">
                                EDIT
                            </button> 
                            <button className="bg-red-600 font-bold text-white">
                                DELETE
                            </button>
                        </li>
                    </ul>
                ))
            }
        </>
    )
}
