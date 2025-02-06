/* Simple service to update data
Could setup a way to avoid frequent updates
By checking last_history_update before hitting this service
Has a 30 min delay before new data is updated*/

import axios from "axios";
import { apiConfig } from "../config.js";

export async function updateData(UID){
    const url = `https://marvelrivalsapi.com/api/v1/player/${UID}/update`;
    return await axios.request({ ...apiConfig, url});
}