const INITIAL_STATE = {
    salaChat: "", //valor por defecto
};

const loadSalaChat = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case "ADD_salaChat": //nombre de la funcion
            return { ...state, salaChat:action.salaChat}; //Nombres de variables
        default:
            return state;
    }
};

export default loadSalaChat;