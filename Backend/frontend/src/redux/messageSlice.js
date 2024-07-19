import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState :{
        messages:null,
    },
    reducers:{
        setMessages : (state,action) =>{
            state.messages = action.payload;
        },
        deleteMessage: (state, action) => {
            const messageId = action.payload;
            state.messages = state.messages.filter(message => message._id !== messageId);
        }
    }
});

export const {setMessages, deleteMessage} = messageSlice.actions;
export default messageSlice.reducer;