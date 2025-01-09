// components/MessageItem/MessageItem.jsx

import React, { forwardRef, memo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './MessageItem.module.scss';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { GeoPreview } from '../GeoPreview/GeoPreview.jsx';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer.jsx';
import { getFormattedDate, getFormattedTime } from "../../utils/datetime.js";
import {MessageItemContextMenu} from "../MessageItemContextMenu/MessageItemContextMenu.jsx";
import LazyImage from "../LazyImage/LazyImage.jsx";

export const MessageItem = memo(
    // eslint-disable-next-line react/prop-types
    forwardRef(({ message, isFound = false, currentAudio, setCurrentAudio, onMessageDelete, onMessageEdit }, ref) => {
        const user = useSelector((state) => state.user.user);

        const [menuVisible, setMenuVisible] = useState(false);
        const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

        const itemRef = useRef(null);

        if (!user) {
            return null;
        }

        // eslint-disable-next-line react/prop-types
        const direction = message.sender.id === user.id ? 'sent' : 'received';

        const formattedDate = getFormattedDate(message.created_at);
        const formattedTime = getFormattedTime(message.created_at);

        const setRefs = (el) => {
            itemRef.current = el;
            if (typeof ref === 'function') {
                ref(el);
            } else if (ref) {
                ref.current = el;
            }
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
            if (message.sender.id !== user.id){
                return
            }

            const top = -80;
            const left = 0;

            setMenuPosition({ top, left });
            setMenuVisible(true);
        };

        const handleCloseMenu = () => {
            setMenuVisible(false);
        };

        const handleDelete = () => {
            handleCloseMenu();
            if (onMessageDelete) {
                onMessageDelete(message.id);
            }
        };

        const handleEdit = () => {
            handleCloseMenu();
            if (onMessageEdit) {
                onMessageEdit(message);
            }
        };

        return (
            <li
                className={`${styles.messageItem} ${
                    direction === 'received' ? styles.received : styles.sent
                } ${styles.scaleInCenter}`}
                ref={setRefs}
                onContextMenu={handleContextMenu}
            >
                {message.files && message.files.length > 0 && (
                    <div className={styles.messageItemImage}>
                        <LazyImage className={styles.messageItemImageImg} src={message.files[0].item} alt="image" />
                    </div>
                )}

                {message.text && message.text.startsWith('type:geolocation') ? (
                    <GeoPreview width={200} height={200} href={message.text.split('___')[1]} />
                ) : (
                    <p className={`${styles.messageItemText} ${isFound ? styles.found : ''}`}>
                        {message.text}
                    </p>
                )}

                {message.voice && (
                    <AudioPlayer
                        src={message.voice}
                        currentAudio={currentAudio}
                        setCurrentAudio={setCurrentAudio}
                    />
                )}

                <div className={styles.messageItemStatus}>
                    <p className={styles.messageItemStatusItem}>
                        {/* eslint-disable-next-line react/prop-types */}
                        {message.was_read_by.length === 0 ? (
                            <CheckIcon fontSize="small" />
                        ) : (
                            <DoneAllIcon fontSize="small" />
                        )}
                    </p>
                    <p className={styles.time}>
                        {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : ''}
                    </p>
                </div>

                <MessageItemContextMenu
                    visible={menuVisible}
                    position={menuPosition}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onClose={handleCloseMenu}
                />
            </li>
        );
    })
);
