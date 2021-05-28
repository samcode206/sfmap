import { Dispatch, SetStateAction, useState } from "react";
import supabase from './supabase';
import AddImages from "./AddImages";
import {pages} from './page-enums'; 

type addProdAttrs = {
    setSection: Dispatch<SetStateAction<pages>>
}

const AddProduct = (props : addProdAttrs) => {
    const [name, setname] = useState("");
    const [price, setprice] = useState(0);
    const [quantity, setquantity] = useState(0);
    const [description, setdescription] = useState("");
    const [error, setError] = useState({active: false, message: ""}); 

    const [addImages, setAddImages] = useState(false); 
    const [productId, setProductId] = useState(""); 

    const onSubmitHandler = async () => {
        if (!name.length) return setError({message:"name must be provided", active: true});

        const user_id = supabase.auth.session()?.user?.id;
        const {data, error} = await supabase
        .from("products")
        .insert([
            {user_id, name, price, quantity, description}
        ]);
        if (error !== null) {
            setError({active: true, message: error.message}); 
        } else {
            setAddImages(true); 
            setError({active: false, message: ""});
            if (data) setProductId(data[0].id); 
            console.log(data);
        }; 
    }; 

    return (
        <div className="container">
              {error.active ? <div className="notification is-danger">{error.message}</div> : null}
              {!addImages ? 
              <>
              <div className="field">
                  <label className="label">Product Name:</label>
                    <div className="control">
                        <input className="input" value={name} placeholder="Enter Product Name" 
                        onChange={(e)=> setname(e.target.value)}/>
                    </div>
              </div>
             
             <div className="field">
                 <label className="label">Product Price:</label>
                 <div className="control">
                    <input className="input" type="number" placeholder="Enter Product price" value={price} 
                    onChange={(e) => setprice(parseInt(e.target.value))}/>
                 </div>
             </div>

            <div className="field">
                <label className="label">Product Quantity:</label>
                <div className="control">
                    <input className="input" type="number" placeholder="Enter Product Quantity" value={quantity}
                    onChange={(e)=>setquantity(parseInt(e.target.value))}/>
                </div>
            </div>

            <div className="field">
                <label className="label">Product Description</label>
                <div className="control">
                    <textarea className="textarea" value={description} placeholder="Enter Product Description 500 characters max"
                     onChange={(e)=> setdescription(e.target.value)}/>
                </div>
            </div>

            <hr />
            <div className="field is-grouped is-grouped-right">
                <div className="control">
                    <button className="button is-success" onClick={onSubmitHandler}>
                    <span>Add Images  </span>
                    <span className="icon is-small">
                        <i className="fas fa-arrow-right"></i>
                    </span>
                    </button>
                </div>
            </div>

       
           
              </>
              :
               <AddImages productId={productId} setSection={props.setSection}/>
            }
        </div>
    )
};


export default AddProduct;