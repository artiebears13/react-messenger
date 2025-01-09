import classes from './GeoPreview.module.scss';

export const GeoPreview = ({width, height, href}) => {
    return (
        <div className={classes.GeoPreview}>
            <iframe width={width} height={height}
                    src={href}
                    style={{border: 'none'}}></iframe>

        </div>
    )
}