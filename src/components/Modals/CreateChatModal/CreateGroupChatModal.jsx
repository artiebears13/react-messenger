import React, { useState, useContext, useEffect } from 'react';
import styles from './CreateChatModal.module.scss';
import { useNavigate } from "react-router-dom";
import {ErrorContext} from "../../../context/ErrorContext.jsx";
import {RecommendedUser} from "./RecommendedUser.jsx";
import {getUsers} from "../../../api/users.js";
import {createChat} from "../../../api/chats.js";
import {ProfilePhoto} from "../../EditableFields/ProfilePhoto/ProfilePhoto.jsx";

// eslint-disable-next-line react/prop-types
export const CreateGroupChatModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [newChatInfo, setNewChatInfo] = useState({
        title: '',
        avatar: undefined
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const {setError} = useContext(ErrorContext)



    const onNameInput = (e) => {
        if (e.target.value !== searchQuery) {
            setSearchQuery(e.target.value);
            getUsers(1, 5, e.target.value)
                .then(
                    res => setRecommendedUsers(res.results)
                )
        }

    }

    useEffect(() => {
        if (isOpen) {
            setNewChatInfo({});
            setMembers([]);
            getUsers(1, 5).then(res => setRecommendedUsers(res.results));
        }
    }, [isOpen]);

    const createGroupChat = () => {
        if (!newChatInfo.title){
            setError("Введите название чата");
            return;
        }

        const params = {
            members,
            is_private: false,
            title: newChatInfo.title,
            avatar: newChatInfo.avatar,
        }
        createChat(params).then(res => {
                navigate(`/chat/${res.id}`);
            }
        ).catch((err) => {
            setError(err.message);
        })
    }

    const toggleUser = (user) => {
        if (members.includes(user.id)) {
            setMembers(prev => prev.filter(member => member !== user.id));
            return;
        }
        setMembers(prev => [...prev, user.id]);
    };

    const onTitleChange = (e) => {
        setNewChatInfo(prevState => {
                return { ...prevState, title: e.target.value };
            }
        )
    }



    if (!isOpen) return null;

    return (
        <div className={`${styles.modal}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <h2>Создать новый чат</h2>
                <ProfilePhoto person={newChatInfo} setPerson={setNewChatInfo} />

                <input
                    type="text"
                    className={styles.newPersonName}
                    value={newChatInfo.title}
                    onChange={onTitleChange}
                    placeholder="Название"
                />
                <input
                    type="text"
                    className={styles.newPersonName}
                    value={searchQuery}
                    onChange={onNameInput}
                    placeholder="Имя пользователя"
                />
                <RecommendedUser users={recommendedUsers} createChat={toggleUser} chosen={members}/>

                <button className={styles.createChatConfirm} onClick={createGroupChat}>
                    OK
                </button>
            </div>
        </div>
    );
};
