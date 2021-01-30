import {useSelector, useDispatch} from 'react-redux';

const useSalaChat = () =>{
    const dispatch = useDispatch();
    const {salaChat} = useSelector((state) => state.salaChat);
    const setSalaChat = (salaChat)=>{
        dispatch({type:"ADD_salaChat",salaChat:salaChat});
    };

    return{
        salaChat,
        setSalaChat,
    };

};

export default useSalaChat;