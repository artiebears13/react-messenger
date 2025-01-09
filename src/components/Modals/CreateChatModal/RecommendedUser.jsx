import React from "react";
import classes from './RecommendedUser.module.scss'
import {ChatPhoto} from "../../ChatItem/ChatPhoto.jsx";

// eslint-disable-next-line react/prop-types
export const RecommendedUser = ({users, createChat, chosen}) => {
    return (
        <div className={classes.RecommendedUserContainer}>
            {/* eslint-disable-next-line react/prop-types */}
            {users.map(user => {
                return(
                    <>
                        {/* eslint-disable-next-line react/prop-types */}
                    <div className={`${classes.RecommendedUserItem} ${chosen && chosen.includes(user.id) && classes.chosen}`}
                        key={user.id}
                        onClick={() => createChat(user)}
                    >
                        <ChatPhoto person={user}/>
                        {user.first_name} {user.last_name}
                    </div></>)
            })}
        </div>
    )
}