import React from "react"
import classes from './VoiceRecordingAnimation.module.scss';

export const VoiceRecordingAnimation = () => {
    const totalWaves = 20;

    const waves = [];
    for (let i = 0; i < totalWaves; i++) {
        waves.push(
            <div className={classes.wave} key={i} style={{animationDelay: `${0.1 * i}s`}} ></div>
        )
    }

    return (
        <div className={classes.recordingAnimation}>
            <div className={classes.recordingIndicator}>
                {waves}
            </div>
        </div>
    )
}