// import { getBookedDatesByCabinId } from "@/app/lib/data-service"

// export async function GET(request, params) {
//     const {cabinId} = params;
//     try {
//         const [cabin , bookedDates]  =await Promise.all(
//             [getCabin(cabinId),
//                 getBookedDatesByCabinId(cabinId)
//             ]
//         )
//         Response.json({cabin, bookedDates})
//     } catch {
//         return Response.json({message : "cabin not found "})

//     }

// }