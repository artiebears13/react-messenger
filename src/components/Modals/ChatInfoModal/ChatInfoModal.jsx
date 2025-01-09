import classes from './ChatInfoModal.module.scss'
import React from "react";
import {imgOrPlaceholder} from "../../../utils/imgOrPlaceholder/imgOrPlaceholder.js";
import {ChatMembers} from "../../ChatMembers/ChatMembers.jsx";
import LazyImage from "../../LazyImage/LazyImage.jsx";

// eslint-disable-next-line react/prop-types
export const ChatInfoModal = ({onClose, currentChat}) => {

    // eslint-disable-next-line react/prop-types
    const chatAvatarSrc = imgOrPlaceholder(currentChat.avatar)

    return (
        <div className={`${classes.EditChatModalBackground}`} onClick={onClose}>
            <div className={classes.EditChatModalContent} onClick={e => e.stopPropagation()}>
                <span className={classes.EditChatModalCloseButton} onClick={onClose}>&times;</span>
                {/* eslint-disable-next-line react/prop-types */}
                {currentChat && <h1 className={classes.EditChatName}>{currentChat.title}</h1>}
                <div className={classes.EditChatPhotoContainer}>
                    {/* eslint-disable-next-line react/prop-types */}
                    {currentChat && <LazyImage src={chatAvatarSrc} alt={currentChat.title} className={classes.EditChatPhoto}/>}
                </div>
                <h1 >Участники</h1>
                {/* eslint-disable-next-line react/prop-types */}
                <ChatMembers members={currentChat.members}/>

            </div>
        </div>
    )
}