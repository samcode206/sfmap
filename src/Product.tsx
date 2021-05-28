import { Dispatch, SetStateAction, useState} from "react";
import ShowImages from './ShowImages';
import supabase from './supabase'; 

interface productAttrs{
    name: string; 
    price: number; 
    quantity: number; 
    description: string; 
    id: string; 
    product_image_urls: productImgUrlsAttrs[] | null; 
    user_id: string; 
    isExpanded : boolean; 
    setIsExpanded: Dispatch<SetStateAction<boolean>> 
    expandId: string;
    setExpandId: Dispatch<SetStateAction<string>>
    updateSuccess: boolean;
    setUpdateSuccess : Dispatch<SetStateAction<boolean>>
    updateFail: {active: boolean, message: string};
    setUpdateFail: Dispatch<SetStateAction<{active: boolean, message: string}>>
}
// description, id, name, price, product_image_urls, quantity, user_id
interface productImgUrlsAttrs{
    product_id: string; 
    url: string;    
    id: string; 
    name: string;
};

const Product = (props: productAttrs) => {
    const {
        name, price, quantity, 
        description, product_image_urls,
         isExpanded, setIsExpanded, expandId, setExpandId, id,
         updateSuccess, setUpdateFail, setUpdateSuccess
        } = props;
    const [nameState, setNameState] = useState(name);
    const [priceState, setPriceState] = useState(price);
    const [quantityState, setQuantityState] = useState(quantity);
    const [descriptionState, setDescriptionState] = useState(description);
    
    const [editMode, setEditMode] = useState(false); 
    
    const saveChangesHandler = async () : Promise<void> => {
        const {data, error} = await supabase
        .from("products")
        .update([{name: nameState, price: priceState, quantity: quantityState, description: descriptionState}])
        .match({id});
        if (data){
            setIsExpanded(false);
            setExpandId(""); 
            setEditMode(false); 
            setUpdateSuccess(!updateSuccess);
        }  else {
            setUpdateFail({active: true, message: error?.message || "Something Went Wrong please try later!"});
        };
    };

    const deleteHandler = async () : Promise<void> => {
        const {data, error} = await 
        supabase
        .from("products")
        .delete()
        .match({id});
        if (data){
            setIsExpanded(false);
            setExpandId(""); 
            setEditMode(false); 
            setUpdateSuccess(!updateSuccess);
            const imgFileNames = product_image_urls?.map(({name}) => name); 
            if (imgFileNames?.length){
                await supabase
                .storage
                .from("assets")
                .remove(imgFileNames!);
            }
           
        } else {
            setUpdateFail({active: true, message: error?.message || "Something Went Wrong please try later!"});
        }
    }; 

    return (
        <>
        <div className="box">
            <div className="is-flex is-justify-content-space-between is-clickable" onClick={()=>{
                setIsExpanded(true);
                setExpandId(id);
                }}>
                <h2 className="title is-5">{name}</h2>
                <span><i className="fas fa-expand-arrows-alt"></i></span>
            </div>
          

        </div>
        <div className={isExpanded && expandId === id ? "modal is-active" : "modal"}>
            <div className="modal-background"></div>
                <div className="modal-content">
                    <header className="modal-card-head">
                        <h3 className="modal-card-title">Product Details</h3>
                        <button className="delete" onClick={()=> {
                            setIsExpanded(false);
                            setExpandId("");
                            }}></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field is-grouped is-grouped-centered">
                            <div className="control">
                                <button className="button is-light" onClick={()=>{
                                    setEditMode(!editMode);
                                }}>{editMode ? "Cancel" : "Edit Product"}</button>
                              
                            </div>
                            {
                                editMode ? 
                                <div className="control">
                                    <button className="button is-link" onClick={saveChangesHandler}>Save Changes</button>
                                </div>
                                : 
                                null
                            }
                         <div className="control">
                             <button className="button is-danger" onClick={deleteHandler}>
                                Delete Product
                             </button>

                         </div>
                        </div>

                            <hr />

                            <div className="field">
                        <label className="label">Name:</label>
                            <div className="control has-icons-left">
                                <span className="icon is-left">
                                <i className="fas fa-dumbbell"></i>
                                </span>
                                {
                                    editMode ? 
                                    <input className="input" value={nameState} 
                                    onChange={({target : {value}})=>setNameState(value)}/> 
                                    :  
                                    <input className="input" value={name} style={{maxWidth:"50%"}} disabled/>
                                }
                               
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Price:</label>
                            <div className="control has-icons-left">
                                <span className="icon is-left">
                                <i className="fas fa-dollar-sign"></i>
                                </span>
                                {
                                      editMode ? 
                                      <input className="input" value={priceState} 
                                      onChange={({target : {value}})=>setPriceState(parseInt(value))}/> 
                                      :  
                                      <input className="input" value={price} style={{maxWidth:"50%"}} disabled/>
                                }
                               
                            </div>
                        </div>
                        
                        <div className="field">
                        <label className="label">Quantity:</label>
                            <div className="control has-icons-left">
                                <span className="icon is-left">
                                <i className="fas fa-truck"></i>
                                </span>
                                {
                                      editMode ? 
                                      <input className="input" value={quantityState} 
                                      onChange={({target : {value}})=>setQuantityState(parseInt(value))}/> 
                                      :  
                                      <input className="input" value={quantity} style={{maxWidth:"50%"}} disabled/>
                                }
                             
                            </div>
                        </div>

                        <div className="field">
                        <label className="label">Description:</label>
                            <div className="control">
                            {
                                editMode ? 
                                <textarea className="textarea" value={descriptionState} 
                                onChange={({target : {value}})=>setDescriptionState(value)}/> 
                                :  
                                <textarea className="textarea" value={description}  disabled/>
                            }
                            </div>
                        </div>

                        {
                        product_image_urls?.length ? 
                            <div className="block">
                                <ShowImages imageList={product_image_urls}/>
                            </div>
                            : null
                        }
                  
                    </section>
                   
             
                </div>
            <button className="modal-close is-large" 
             onClick={()=> {
                 setIsExpanded(false);
                 setExpandId("");
                 }}></button>
        </div>
        </>
    );
};


export default Product;
   