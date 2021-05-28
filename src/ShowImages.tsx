import { useState } from "react";

enum dir {
    up = "U",
    down = "D"
}

interface imageAttrs{
    imageList : productImgUrlsAttrs[]; 
}
interface productImgUrlsAttrs{
    product_id: string; 
    url: string;    
    id: string; 
    name: string;
};

const ShowImages = (props : imageAttrs) => {
 
    const {imageList} = props;
    const [imgIndex, setImgIndex] = useState({index: imageList.length - 1, direction: dir.down});
    const toggleImages = () : void => {
        const imageListLength = imageList.length - 1; 
        if (imageList.length === 1) return; 
        if (imgIndex.index === 0 && imgIndex.direction === dir.down){
            setImgIndex({index: imgIndex.index + 1, direction: dir.up});
        } else if (imgIndex.index === imageListLength && imgIndex.direction === dir.up){
            setImgIndex({index: imgIndex.index - 1, direction: dir.down});
        } else {
            setImgIndex({index: imgIndex.direction === dir.up ? imgIndex.index + 1 : imgIndex.index - 1, direction: imgIndex.direction});
        }
    }

    return (
        <div>
            <section className="image is-4by3">
            <img src={imageList[imgIndex.index].url} alt="product" onClick={toggleImages} />
            </section>
            <div className="is-flex is-justify-content-space-between">
                <span className="icon is-large is-clickable">
                    <i className="fas fa-arrow-left" onClick={toggleImages}></i>
                </span>
                <span className="icon is-large is-clickable">
                    <i className="fas fa-arrow-right" onClick={toggleImages}></i>
                </span>
            </div>
        </div>
    )
};


export default ShowImages;