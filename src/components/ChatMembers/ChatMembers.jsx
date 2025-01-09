import classes from './ChatMembers.module.scss';
import {Avatar} from "@mui/material";
import {useNavigate} from "react-router-dom";


export const ChatMembers = ({members}) => {
    const navigate = useNavigate();


    const openProfile = (memberId) =>{
        navigate(`/user/${memberId}`);
    }

    return (
        <div className={classes.ChatMembersContainer}>
            {members.map(member => (
                <div className={classes.ChatMembersItem} key={member.id} onClick={() => openProfile(member.id)}>
                    <Avatar src={member.avatar} />
                    <span className={classes.ChatMembersItemName}>
                        {`${member.first_name} ${member.last_name}`}
                    </span>
                </div>
            ))}
        </div>
    )
}