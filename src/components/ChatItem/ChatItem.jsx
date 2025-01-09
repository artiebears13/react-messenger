import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChatPhoto } from './ChatPhoto.jsx';
import { ChatInfo } from './ChatInfo.jsx';
import { ChatStatus } from './ChatStatus.jsx';
import { ChatTime } from './ChatTime.jsx';
import styles from './ChatItem.module.scss';

export const ChatItem = ({chat, message, isSearched}) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user); // Получаем пользователя из Redux
    const handleClick = () => {

        localStorage.setItem('currentChatId', chat.id);
        if (message && isSearched) {
            localStorage.setItem('found_message', chat.id || '');
        }
        navigate(`/chat/${chat.id}`);
    };

    const title = chat.title;

    return (
        <div className={styles.chatItem} onClick={handleClick}>
            <ChatPhoto person={chat}/>
            <ChatInfo title={title} message={message}/>
            {message && message.sender && message.sender.id !== user.id &&
                <ChatStatus chat={chat} received={message.sender.id !== user.id}/>
            }
            <ChatTime time={chat.updated_at}/>
        </div>
    );
};
