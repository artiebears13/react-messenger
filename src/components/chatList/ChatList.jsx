import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ChatList.module.scss';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { ChatItem } from '../ChatItem/ChatItem.jsx';
import { setFoundMessage } from '../../store/messageSlice'; // Импортируем действие для установки найденного сообщения

// eslint-disable-next-line react/prop-types,react/display-name
export const ChatList = memo(({ searchQuery = '' }) => {
    const dispatch = useDispatch();

    const chats = useSelector((state) => state.chats.chats);
    const messages = useSelector((state) => state.messages.messages);

    const [filteredChats, setFilteredChats] = useState([]);

    useEffect(() => {
        if (searchQuery === '') {
            const chatsWithLastMessage = chats.map(chat => {
                const lastMessage = chat.last_message || null;

                return {
                    chat,
                    message: lastMessage,
                };
            });
            setFilteredChats(chatsWithLastMessage);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = chats
                .map(chat => {
                    const chatMessages = messages[chat.id] || [];
                    const chatTitle = chat.title || '';
                    const nameMatch = chatTitle.toLowerCase().includes(query);

                    const matchingMessages = chatMessages.filter(message =>
                        (message.text || '').toLowerCase().includes(query)
                    );

                    if (nameMatch) {
                        const lastMessage = chat.last_message || null;
                        return {
                            chat,
                            message: lastMessage,
                        };
                    } else if (matchingMessages.length > 0) {
                        const lastMatchingMessage = matchingMessages.reduce(
                            (latest, current) => {
                                const latestTime = new Date(latest.created_at).getTime();
                                const currentTime = new Date(current.created_at).getTime();
                                return currentTime > latestTime ? current : latest;
                            }
                        );
                        dispatch(setFoundMessage(lastMatchingMessage.id));

                        return {
                            chat,
                            message: lastMatchingMessage,
                        };
                    } else {
                        return null;
                    }
                })
                .filter(chat => chat !== null);

            setFilteredChats(filtered);
        }
    }, [searchQuery, chats, messages, dispatch]);

    const sortedChats = useMemo(() => {
        return [...filteredChats].sort((a, b) => {
            const timeA = a.message ? new Date(a.message.created_at).getTime() : 0;
            const timeB = b.message ? new Date(b.message.created_at).getTime() : 0;
            return timeB - timeA;
        });
    }, [filteredChats]);

    return (
        <div className={styles.chatList}>
            {sortedChats.length > 0 ? (
                sortedChats.map(chatItem => (
                    <ChatItem
                        key={chatItem.chat.id}
                        chat={chatItem.chat}
                        message={chatItem.message}
                        isSearched={searchQuery !== ''}
                    />
                ))
            ) : searchQuery === '' ? (
                <div className={styles.notFoundMessage}>
                    {/*<SentimentVeryDissatisfiedIcon/>*/}
                    <p className={styles.welcomeLabel}>
                        Добро пожаловать! <br />
                        Создайте первый чат!
                    </p>
                </div>
            ) : (
                <div className={styles.notFoundMessage}>
                    <SentimentVeryDissatisfiedIcon />
                    <p>По запросу &quot;{searchQuery}&quot; ничего не найдено</p>
                </div>
            )}
        </div>
    );
});
