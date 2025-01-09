import image from './placeholder.png';


export const imgOrPlaceholder = (src) => {
    return src? src: image;
}