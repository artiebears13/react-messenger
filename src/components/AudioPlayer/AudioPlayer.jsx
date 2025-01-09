import React, { useState, useEffect } from 'react';
import styles from './AudioPlayer.module.scss';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

export const AudioPlayer = ({ src, currentAudio, setCurrentAudio }) => {
    const [audio] = useState(new Audio(src));
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const totalBars = 20;
    const progress = Math.floor((currentTime / duration) * totalBars) || 0;


    const handleAudioClick = () => {
        if (!playing) {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
            }
            audio.play();
            setCurrentAudio(audio);
            setPlaying(true);
        } else {
            audio.pause();
            setPlaying(false);
            setCurrentAudio(null);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const updateCurrentTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateCurrentTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', () => {
            setPlaying(false);
            setCurrentAudio(null);
        });

        return () => {
            audio.removeEventListener('timeupdate', updateCurrentTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', () => {
                setPlaying(false);
                setCurrentAudio(null);
            });
            audio.pause();
        };
    }, [audio, setCurrentAudio]);

    return (
        <div className={styles.audioPlayer}>
            <button onClick={handleAudioClick} className={styles.playButton}>
                {playing ? <PauseCircleOutlineIcon fontSize={'large'}/> : <PlayCircleOutlineIcon fontSize={'large'}/>}
            </button>
            <div className={styles.progressContainer}>
                {Array.from({ length: totalBars }).map((_, index) => {
                    const barHeight = 10 + Math.sin(index * 0.5) * 5 + 10; // Синусоидальная высота столбиков
                    return (
                        <div
                            key={index}
                            className={`${styles.bar} ${index < progress ? styles.active : ''}`}
                            style={{
                                height: `${barHeight}px`,
                                transition: 'height 0.3s ease',
                            }}
                        ></div>
                    );
                })}
            </div>
            <div className={styles.timeInfo}>
                <span>{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};
