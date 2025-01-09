import React, {memo, useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import styles from './PageChat.module.scss';
import {MessageInput} from '../../components/Inputs/MessageInput/MessageInput.jsx';
import {MessagesList} from '../../components/MessagesList/MessagesList.jsx';
import {PageChatHeader} from '../../components/Headers/PageChatHeader/PageChatHeader.jsx';
import {fetchCurrentChat, setCurrentChat} from '../../store/chatSlice';
import {deleteMessage, editMessage, fetchMessages, markMessagesAsRead, sendNewMessage} from '../../store/messageSlice';
import {ChatInfoModal} from "../../components/Modals/ChatInfoModal/ChatInfoModal.jsx";

// eslint-disable-next-line react/display-name
export const PageChat = memo(() => {
    const {chatId} = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const messages = useSelector((state) => state.messages.messages);
    const currentChat = useSelector((state) => state.chats.currentChat);

    const [editChatModal, setEditChatModal] = useState(false);
    const [chatFound, setChatFound] = useState(true);
    const [editingMessage, setEditingMessage] = useState(null);

    const currentMessages = messages[chatId] || [];


    useEffect(() => {
        if (chatId) {
            dispatch(fetchCurrentChat(chatId))
                .unwrap()
                .catch(() => setChatFound(false));

            dispatch(fetchMessages(chatId));
        }
        return () => {
            dispatch(setCurrentChat(null));
        };
    }, [chatId, dispatch]);

    useEffect(() => {
        dispatch(markMessagesAsRead(chatId));
    }, [chatId, dispatch]);

    const openEditChatModal = () => {
        if (currentChat.is_private) {
            navigate(`/user/${currentChat.creator.id}`);

        }
        setEditChatModal(true);
    };

    const closeEditChatModal = () => {
        setEditChatModal(false);
    };

    const handleEditMessage = useCallback((message) => {
        setEditingMessage(message);
    }, []);

    const cancelEdit = useCallback(() => {
        setEditingMessage(null);
    }, [])

    const handleMessageDelete = useCallback(async (messageId) => {
        console.log("delete in handleMessageDelete");
        dispatch(deleteMessage({chatId, messageId})).then(() => console.log("done"));
    }, [dispatch]);

    const sendMessage = useCallback(
        async ({text, files}) => {
            console.log("onSendMessage", {text, files, editingMessage});
            const messageText = text.trim();
            if (messageText || (files && files.length > 0)) {
                try {
                    if (editingMessage) {
                        await dispatch(editMessage({
                            chatId,
                            messageId: editingMessage.id,
                            messageData: {
                                text: messageText,
                            }
                        }));
                        setEditingMessage(null);
                    } else {
                        await dispatch(
                            sendNewMessage({
                                chatId,
                                messageData: {
                                    text: messageText,
                                    files: files,
                                },
                            })
                        );
                    }
                } catch (error) {
                    console.error('Ошибка при отправке сообщения:', error);
                }
            }
        },
        [chatId, dispatch, editingMessage]
    );

    const sendVoiceMessage = useCallback(
        async (voice) => {
            if (voice) {
                try {
                    await dispatch(
                        sendNewMessage({
                            chatId,
                            messageData: {
                                text: '',
                                voice: voice,
                            },
                        })
                    );
                } catch (error) {
                    console.error('Ошибка при отправке голосового сообщения:', error);
                }
            }
        },
        [chatId, dispatch]
    );

    return (
        <div>
            <PageChatHeader chat={currentChat} openEditChatModal={openEditChatModal}/>
            {editChatModal && <ChatInfoModal onClose={closeEditChatModal} currentChat={currentChat}/>}
            <div className={styles.chatContainer}>
                <MessagesList
                    messages={currentMessages}
                    onMessageDelete={handleMessageDelete}
                    onMessageEdit={handleEditMessage}
                />
                <MessageInput
                    onSendMessage={sendMessage}
                    active={chatFound}
                    onSendVoice={sendVoiceMessage}
                    editingMessage={editingMessage}
                    cancelEdit={cancelEdit}
                />
            </div>
        </div>
    );
});
