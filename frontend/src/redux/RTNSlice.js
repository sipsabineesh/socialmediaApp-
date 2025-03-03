// import { createSlice } from "@reduxjs/toolkit";

// const rtnSlice = createSlice({
//     name: 'realTimeNotification',
//     initialState: {
//         likeNotification: [],

//     },
//     reducers: {
//         setLikeNotification: (state, action) => {
//             if (action.payload.type === 'like')
//                 state.likeNotification.push(action.payload)
//             else if (action.payload.type === 'dislike')
//                 state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
//         },

//     }
// });
// export const { setLikeNotification } = rtnSlice.actions;
// export default rtnSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [], // [1,2,3]
        notifications: [], // Store all types of notifications
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like')
                state.likeNotification.push(action.payload)
            else if (action.payload.type === 'dislike')
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId);
        },
        setNotification: (state, action) => {
            const existingNotificationIndex = state.notifications.findIndex(
                (item) => item.userId === action.payload.userId && item.postId === action.payload.postId
            );

            if (action.payload.type === 'like') {
                // Prevent duplicate "like" notifications
                if (existingNotificationIndex === -1) {
                    state.notifications.unshift(action.payload);
                }
            } else if (action.payload.type === 'dislike') {
                // Remove notification when unliked
                state.notifications = state.notifications.filter(
                    (item) => item.userId !== action.payload.userId || item.postId !== action.payload.postId
                );
            } else {
                // Add other types of notifications (e.g., comments, follows)
                state.notifications.unshift(action.payload);
            }
        },

        setNotificationsAsRead: (state) => {
            state.notifications = [];
        },
    }
});

export const { setLikeNotification, setNotification, setNotificationsAsRead } = rtnSlice.actions;
export default rtnSlice.reducer;
