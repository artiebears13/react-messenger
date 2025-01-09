import React from "react";
import classes from './CreateChatOptions.module.scss';

// eslint-disable-next-line react/prop-types
export const CreatechatOptions = ({onClose, onGroupChat, onPersonalChat}) => {

    const choosePersonal = () => {
        onClose();
        onPersonalChat();
    }
    const chooseGroup = () => {
        onClose();
        onGroupChat();
    }

    return (
        <div className={`${classes.CreateChatOptionsContainer} ${classes.slideInBr}`}>
            <button className={classes.CreateChatOptionsButton} onClick={choosePersonal}>Личное чат</button>
            <button className={classes.CreateChatOptionsButton} onClick={chooseGroup}>Групповой чат</button>
        </div>
    )
}