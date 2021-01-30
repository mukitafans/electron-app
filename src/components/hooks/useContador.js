import {useSelector, useDispatch} from 'react-redux';

const useContador = () =>{
    const dispatch = useDispatch();
    const {Contador} = useSelector((state) => state.Contador);
    const setContador = (Contador)=>{
        dispatch({type:"ADD_Contador",Contador:Contador});
    };

    return{
        Contador,
        setContador,
    };

};

export default useContador;