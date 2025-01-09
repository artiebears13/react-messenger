import React, {useEffect, useState} from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './LazyImage.module.scss';

const LazyImage = ({ src, alt, placeholder, errorPlaceholder, className, ...props }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        console.log({isLoaded, src, alt});
    }, [isLoaded]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    return (
        <div className={`${className? className: ''}`} ref={ref}>
            {!isLoaded && !hasError && (
                <div className={`${className? className: ''} ${styles.placeholder}`}>
                    {placeholder || <span className={styles.loader}></span> }
                </div>
            )}
            {hasError && (
                <div className={styles.error}>
                    {errorPlaceholder || 'Ошибка загрузки'}
                </div>
            )}
            {isVisible && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={`${className? className: ''} ${!isLoaded && styles.hidden}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;
