const INITIAL_STATE = {
    Contador: 0, //valor por defecto
};

const loadcontador = (state = INITIAL_STATE, action) => {
    switch (action.type){
        case "ADD_Contador": //nombre de la funcion
            return { ...state, Contador:action.Contador}; //Nombres de variables
        default:
            return state;
    }
};

export default loadcontador;