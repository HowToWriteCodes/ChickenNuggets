/* Simple service to update data
Has a 30 min delay before new data is actually updated
So don't bother hitting it every now and then*/

import axios from "axios";
import { apiConfig } from "../config.js";

export async function updateData(UID){
    return await axios.request({ ...apiConfig, url:`/${UID}/update`});
}
