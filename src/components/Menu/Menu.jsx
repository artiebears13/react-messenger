import styles from './Menu.module.scss'
import {ChatPhoto} from "../ChatItem/ChatPhoto.jsx";
import ContrastIcon from '@mui/icons-material/Contrast';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {ThemeSwitcher} from "../../utils/themeSwitcher.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";



export const Menu = ({onMenuHide}) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    const toProfile = () => {
        navigate(`/profile`);
    }

    return (
        <div className={`${styles.menuBackground} ${styles.slideInLeft}`} onClick={onMenuHide}>
            <div className={styles.dropdownMenu}>
                <div className={styles.userData} onClick={toProfile}>
                <ChatPhoto person={user} />
                    <h2 className={styles.userName}>{user.first_name}</h2>
                </div>
                <div className={styles.menuItem} onClick={ThemeSwitcher}>Сменить тему<ContrastIcon className="white"/></div>
                <div className={`${styles.menuItem} ${styles.disabled}`} onClick={() => {}}>Настройки<SettingsIcon className="white"/></div>
                <div className={`${styles.menuItem} ${styles.disabled}`} onClick={() => {}}>Друзья<GroupIcon className="white"/></div>
                <div className={`${styles.menuItem} ${styles.disabled}`} onClick={() => {}}>Премиум<WorkspacePremiumIcon className="white"/></div>
            </div>
        </div>
    )
}