import React, {useState, useContext, useRef, useEffect} from 'react';
import styles from './MessageInput.module.scss';
import SendIcon from '@mui/icons-material/Send';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloseIcon from '@mui/icons-material/Close';
import {readFileAsDataURL} from '../../../utils/storage.js';
import {ErrorContext} from '../../../context/ErrorContext.jsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {GeoPreview} from "../../GeoPreview/GeoPreview.jsx";
import {VoiceRecordingAnimation} from "../../voiceMessage/VoiceRecordingAnimation.jsx";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


export const MessageInput = ({onSendMessage, onSendVoice, active, editingMessage, cancelEdit}) => {
    const attachedImageInputRef = useRef(null);
    const [messageText, setMessageText] = useState('');
    const [attachedImage, setAttachedImage] = useState(null);
    const [attachedImageBinary, setAttachedImageBinary] = useState(null);
    const {setError} = useContext(ErrorContext);
    const [geolocation, setGeolocation] = useState(null);
    const [recording, setRecording] = useState(false);
    const [originalMessageText, setOriginalMessageText] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const isCancelledRef = useRef(false);


    useEffect(() => {
        if (editingMessage) {
            setOriginalMessageText(editingMessage.text);
            setMessageText(editingMessage.text);
        }
    }, [editingMessage]);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleImageClick = () => {
        attachedImageInputRef.current.click();
        handleClose();
    };

    const handleGeolocationClick = () => {

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const bbox = `${longitude - 0.004},${latitude - 0.002},${longitude + 0.004},${latitude + 0.002}`;
            const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
            setGeolocation(src);
        }

        function error() {
            navigator.geolocation.getCurrentPosition(success);

            setError("Unable to retrieve your location");
        }

        navigator.geolocation.getCurrentPosition(success, error);

        handleClose();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedMessage = messageText.trim();
        if (trimmedMessage || attachedImage) {
            onSendMessage({text: trimmedMessage, files: [attachedImageBinary]});
            setMessageText('');
            setAttachedImage(null);
            setAttachedImageBinary(null);
        }
    };

    const handleAttachmentChange = async (e) => {
        const file = e.target.files[0];
        let photoUrl = 'https://avatar.iran.liara.run/public';

        try {
            photoUrl = await readFileAsDataURL(file);
        } catch  {
            setError('Ошибка при загрузке фотографии.');
            return;
        }
        if (file) {
            setAttachedImage(photoUrl);
            setAttachedImageBinary(file);
        }
    };

    const deleteAttachment = () => {
        setAttachedImage(null);
        setAttachedImageBinary(null);
    };

    const sendGeo = () => {
        onSendMessage({text: `type:geolocation___${geolocation}`});
        setGeolocation(null);

    }

    const hideGeoAttach = (e) => {
        if (e.target.id === "geo-attach-bg") {
            setGeolocation(null);
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            isCancelledRef.current = true;
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (audioChunksRef.current.length > 0) {
            audioChunksRef.current = [];
        }

        if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        setRecording(false);
    };

    const handleCancelEdit = () => {
        cancelEdit();
        setMessageText("");
        setOriginalMessageText("");
    }


    const startVoiceRecording = () => {
        if (!recording) {
            navigator.mediaDevices
                .getUserMedia({audio: true})
                .then(stream => {
                    audioChunksRef.current = [];
                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = event => {
                        audioChunksRef.current.push(event.data);
                    };
                    mediaRecorderRef.current.onstop = () => {
                        if (isCancelledRef.current) {
                            isCancelledRef.current = false;
                            return;
                        }
                        const audioBlob = new Blob(audioChunksRef.current, {type: 'audio/wav'});
                        const audioFile = new File([audioBlob], 'recording.wav', {
                            type: 'audio/wav',
                            lastModified: Date.now(),
                        });
                        onSendVoice(audioFile);
                    };
                    mediaRecorderRef.current.start();
                    setRecording(true);
                })
                .catch(err => {
                    console.error('Ошибка доступа к микрофону', err);
                });
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    }

    return (
        <div className={styles.inputContainer}>

            {attachedImage && (
                <div className={styles.inputContainerAttachment}>
                    <img src={attachedImage} alt=""/>
                    <button
                        className={styles.inputContainerAttachmentClose}
                        onClick={deleteAttachment}
                    >
                        <CloseIcon sx={{fontSize: 10}}/>
                    </button>
                </div>
            )}
            {editingMessage && (
                <div className={styles.inputContainerAttachment}>
                    <span>{originalMessageText}</span>
                    <button
                        className={styles.inputContainerAttachmentClose}
                        onClick={handleCancelEdit}
                    >
                        <CloseIcon sx={{fontSize: 10}}/>
                    </button>
                </div>
            )}

            <div className={`${styles.formContainer} ${active ? '' : 'disabled'}`}>
                {recording ? <VoiceRecordingAnimation/> :
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            ref={attachedImageInputRef}
                            accept="image/*"
                            style={{display: 'none'}}
                            id="attachment-input"
                            type="file"
                            onChange={handleAttachmentChange}
                            disabled={!active}
                        />
                        {!editingMessage && (<><label htmlFor="attachment-input">
                            <button
                                type="button"
                                className={styles.attachmentBtn}
                                aria-label="Attach"
                                onClick={(event) => setAnchorEl(event.currentTarget)}
                                disabled={!active}
                            >
                                <AttachmentIcon className="attachment-icon"/>
                            </button>
                        </label>
                            <Menu
                                id="attachment-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleImageClick}>Картинка</MenuItem>
                                <MenuItem onClick={handleGeolocationClick}>Геолокация</MenuItem>
                            </Menu></>)}
                        <input
                            className={styles.formInput}
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Введите сообщение"
                            aria-label="Message input"
                            disabled={!active}
                        />

                        <button
                            className={styles.sendBtn}
                            type="submit"
                            aria-label="Send Message"
                            disabled={!active}
                        >
                            <SendIcon className={`${styles.sendIcon} ${styles.white}`} fontSize="medium"/>
                        </button>
                        {
                            (geolocation) && (
                                <div className={styles.mapAttachment} id={"geo-attach-bg"} onClick={hideGeoAttach}>

                                    <div className={styles.mapAttachmentContainer}>
                                        <GeoPreview width={300} height={300} href={geolocation}/>
                                        <button className={styles.mapAttachmentButton} onClick={sendGeo}>отправить</button>
                                    </div>
                                </div>
                            )
                        }
                    </form>
                }
                {
                    recording &&
                    <button className={styles.voiceBtn} onClick={stopRecording}>
                        <StopCircleIcon className={styles.white} fontSize={"medium"}/>
                    </button>
                }
                {!editingMessage && (<button
                    className={styles.voiceBtn}
                    type="button"
                    aria-label="Record Voice"
                    onClick={startVoiceRecording}
                    disabled={!active}
                >
                    {recording ?
                        <ArrowUpwardIcon className={`${styles.sendIcon} ${styles.white}`} fontSize="medium"/>
                        : <MicIcon className={styles.white} fontSize="medium"/>}
                </button>
                    )}
            </div>
        </div>
    )
        ;
};
