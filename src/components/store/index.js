import {createStore, combineReducers} from "redux"; 
import {salaChat, Contador} from "./reducers";
const reducers = combineReducers({
    salaChat,
    Contador
});

export default createStore(reducers);