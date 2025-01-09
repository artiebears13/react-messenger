import AddIcon from '@mui/icons-material/Add';
import styles from './createChatButton.module.scss';
import {useState} from "react";
import {CreatechatOptions} from "../../Modals/CreateChatOptions/CreatechatOptions.jsx";

export const CreateChatButton = ({onGroupChat, onPersonalChat, animate}) => {
    const [showOptions, setShowOptions] = useState(false);


    const toggleOptions = () => {
        setShowOptions(!showOptions);
    }

    return (
        <div className={styles.createChatButtonContainer}>
            {showOptions &&
                <CreatechatOptions
                    onClose={toggleOptions}
                    onPersonalChat={onPersonalChat}
                    onGroupChat={onGroupChat}
                />
            }
            <button className={`${styles.createChatButton} ${animate && styles.pulseAnimation}`} onClick={toggleOptions}>
                <div className={styles.createChatButtonContent}>
                    <AddIcon/>
                </div>
            </button>
        </div>
    );
};
