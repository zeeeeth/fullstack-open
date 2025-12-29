import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name:'notification',
    initialState:'',
    reducers: {
        createNotification(_state, action) {
            return action.payload;
        },
        clearNotification() {
            return '';
        }
    }
})

export const { createNotification, clearNotification } 
    = notificationSlice.actions;

export const setNotification = (content, time) => {
    return (dispatch) => {
        dispatch(createNotification(content))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time)
    }
}

export default notificationSlice.reducer;