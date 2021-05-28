import BreadCrumb from './BreadCrumb';
import AddProduct from './AddProduct';
import ShowProducts from './ShowProducts'; 
import { useState } from 'react';
import {pages} from './page-enums'; 


export default function Admin(){
    const [section, setSection] = useState(pages.showProducts);
    
   
    const toggleActive = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) : void => {
         // @ts-ignore  not the best thing in the world but it will technically always satisfy the enum pages 
        setSection(e.currentTarget.id);
        e.preventDefault();
    }

    return <div> 

        <BreadCrumb activeSection={section} toggleActive={toggleActive}/>

        <div className="box container">
            {section === pages.addProducts && <AddProduct setSection={setSection}/> }
            
            {section === pages.showProducts && <ShowProducts />}
        </div>
          

    </div>
}