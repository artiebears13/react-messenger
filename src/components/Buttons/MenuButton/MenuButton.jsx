import MenuIcon from '@mui/icons-material/Menu';
import styles from './menuButton.module.scss';

// burger button
export const MenuButton = ({toggleMenu}) => {
    return (
        <MenuIcon className={`${styles.menuButton} white`} onClick={toggleMenu}/>
    );
};
