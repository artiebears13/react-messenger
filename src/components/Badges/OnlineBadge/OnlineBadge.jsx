import {getFormattedDate} from "../../../utils/datetime.js";
import classes from './OnlineBadge.module.scss';

export const OnlineBadge = ({user}) => {
    const getStatus = (user) => {
        console.log("onlineBadge", {user});
        if (user && user.is_online) {
            return 'online';
        }
        if (user){
            return `был в сети ${getFormattedDate(user.last_online_at)}`;
        }
        return 'offline'

    }
    return (
        <div className={classes.OnlineBadge}>{getStatus(user)}</div>
    )
}