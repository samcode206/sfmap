import { useEffect, useState } from 'react';
import supabase from './supabase'; 
import Product from './Product';

interface productAttrs{
    name: string; 
    price: number; 
    quantity: number; 
    description: string; 
    id: string; 
    product_image_urls: productImgUrlsAttrs[] | null; 
    user_id: string; 
}
// description, id, name, price, product_image_urls, quantity, user_id
interface productImgUrlsAttrs{
    product_id: string; 
    url: string;    
    id: string; 
    name: string;
};

const ShowProducts = () => {
    const __products : productAttrs[] = [];
    const [products, setProducts] = useState(__products);

    const [isExpanded, setIsExpanded] = useState(false); 
    const [expandId, setExpandId] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false); 
    const [updateFail, setUpdateFail] = useState({active: false, message: ""}); 

    useEffect(()=>{
        (async () => {
            const {data, error} = await supabase
            .from("products")
            .select(`
                *,
                product_image_urls (
                    product_id, url, name
                )
            `);
            if (error !== null) {
                return; 
            }; 
            setProducts(data!); 
        })()
    }, [updateSuccess, updateFail]); 

    return (
        <div>
            {
                updateFail.active === true ? 
                <div className="notification is-danger has-text-centered">{updateFail.message}</div>
                :
                null
            }
       
            {
                products.length ? products.map(p=>
                     <Product key={p.id} isExpanded={isExpanded} name={p.name} id={p.id} 
                     price={p.price}  setIsExpanded={setIsExpanded} expandId={expandId}
                      setExpandId={setExpandId} description={p.description}
                     product_image_urls={p.product_image_urls} updateSuccess={updateSuccess}
                     setUpdateSuccess={setUpdateSuccess} updateFail={updateFail} setUpdateFail={setUpdateFail}
                     user_id={p.user_id} quantity={p.quantity}/>)
                : 
                <div className="notification has-text-centered">
                    No products were found!
                </div>
            }
        </div>
    );
};


export default ShowProducts;

