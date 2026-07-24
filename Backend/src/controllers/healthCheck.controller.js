import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"; 
// const healthCheck = (req,res)=>{
//     try {
//         res
//         .status(200).json(
//             new ApiResponse(200,{message:"Server Is Running!!"})
//         )
    
        
//     } catch (error) {
        
//     }

// }

const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
});
export { healthCheck }