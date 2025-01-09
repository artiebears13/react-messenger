import classes from './Avatar.module.scss';
import React from "react";
import {imgOrPlaceholder} from "../../utils/imgOrPlaceholder/imgOrPlaceholder.js";
import LazyImage from "../LazyImage/LazyImage.jsx";

export const Avatar = ({src}) => {

    const handledSrc = imgOrPlaceholder(src);
    return (
        <div className={classes.AvatarContainer}>
            <LazyImage src={handledSrc} alt={"avatar"} className={classes.AvatarImage}/>
        </div>
    )
}