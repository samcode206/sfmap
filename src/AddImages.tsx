import { Dispatch, SetStateAction, useState } from 'react';
import supabase from './supabase'; 
import {pages} from './page-enums'; 

interface imageAttrs {
    url : string
    name : string
}

interface imgProps {
    productId: string;
    setSection: Dispatch<SetStateAction<pages>>
};


const AddImages  = (props: imgProps) => {
    const __fileStore : File[] = [];
    const __surls : imageAttrs[] = [];
    const [imageFile, setImageFile] = useState(__fileStore);
    const [error, setError] = useState({active: false, message: ""});
    const [signedUrls, setSignedUrls] = useState(__surls); 
    const [addMoreMode, setAddMoreMode] = useState(false); 

    const [awaitingUpload, setAwatingUpload] = useState(false); 

    const getSignedUrl = async (name : string) => {
        const {signedURL, error} = await supabase
        .storage
        .from("assets")
        .createSignedUrl(imageFile[0]?.name, 99999999);
        if (error !== null) setError({active: true, message: error.message}); 
        const newSignedUrls = [...signedUrls];
        if (signedUrls) newSignedUrls.push({name, url: signedURL!});
        setSignedUrls(newSignedUrls);
    }; 

    const uploadImage = async () => {
        if (imageFile.length !== 1) {
            if (signedUrls.length) setAddMoreMode(true); 
            return;
        };
        setError({active:false, message:""});
       setAwatingUpload(true);
        const {data, error} = await supabase
        .storage
        .from("assets")
        .upload(imageFile[0].name, imageFile[0]);
        setAwatingUpload(false); 
        if (error !== null) setError({active: true, message: error.message}); 
        if (data) getSignedUrl(imageFile[0].name);
        setAddMoreMode(false); 
        setImageFile(__fileStore);
    }; 

    const deleteImage = async (imgname: string) => {
        const {data, error} = await supabase
        .storage
        .from("assets")
        .remove([imgname]); 
        if (error !== null) setError({active: true, message: error.message}); 
        if (data){
            const newSignedUrls = signedUrls.filter(({name}) => name !== imgname);
            setSignedUrls(newSignedUrls);  
        };
    }; 

    const confirmImages = async () => {
       const imageUrlsList = signedUrls.map(({url, name})=> ({product_id: props.productId, url, name}));
       const {data, error} = await supabase
        .from("product_image_urls")
        .insert(imageUrlsList);
        if (error !== null) setError({active: true, message: error.message}); 
        if (data) {
            props.setSection(pages.showProducts);
        };
    }; 

    return (
        <div>
            {
                awaitingUpload ? <div className="notification">
                    <h2 className="title is-5 has-text-centered">Awaiting file upload!</h2>
                    <progress className="progress is-link"></progress>
                </div> :
                null
            }

            {
                error.active === true ? 
                <div className="notification is-danger has-text-centered">
                    {error.message.includes("duplicate key value") ? "Duplicate file name please rename your file and try again" : error.message}
                </div>
                :
                null
            }
            
        {
            !signedUrls.length || addMoreMode === true 
            ?  <div className="field is-grouped is-grouped-centered">
            <div className="file has-name is-boxed">
                <label className="file-label">
                    <input className="file-input" type="file" id="img"
                        name="img" accept="image/*" 
                        onChange={({target})=>{
                            const arr = [];
                            if (target.files) arr.push(target.files[0]);
                            setImageFile(arr); 
                        }}
                    />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">
                            Choose a file…
                        </span>
                    </span>
                        <span className="file-name">
                            {imageFile.length !== 1 ? "Upload image" : imageFile[0].name} 
                        </span>
                </label>
            </div>
        </div> 
        : 
            <div className="container is-flex is-flex-wrap-wrap">
            {
                signedUrls.map(({url, name})=> (
                <div key={url} style={{width:"400px", margin:"10px"}}>
                    <article className="message is-light">
                    <div className="message-header">
                        <button className="delete" aria-label="delete"
                         onClick={()=> deleteImage(name)}></button>
                    </div>
                    <div className="message-body">

                    <img alt={url} src={url}
                        style={{width:"400px", maxHeight:"500px", padding: "15px", display:"block"}}/>
                    </div>
                    </article>
                   
                </div>
                )) 
            }
            </div>
        }   
      
        <hr />

        <div className="field is-grouped is-grouped-centered">
            <div className="control">
                <button className="button is-success is-light" onClick={confirmImages}>Confirm</button>
            </div>
            <div className="control">
                <button className="button is-success" onClick={uploadImage}>Add Image</button>
            </div>
            {
                signedUrls.length && addMoreMode ? <div className="control">
                    <button className="button is-light" onClick={()=> setAddMoreMode(false)}>Cancel</button>
                </div> 
                
                : null
            }
        </div>

        </div>
    )
};


export default AddImages;