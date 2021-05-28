import {pages} from './page-enums'; 

interface breadcrumbAttrs{
    activeSection:  string;
    toggleActive: (e : React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const BreadCrumb  = (props : breadcrumbAttrs) => {
 
   const isActive = (v : string) : string => v === props.activeSection ? "is-active" : "";


    return (
        <nav className="breadcrumb is-centered mt-4">
        <ul>
            <li className={isActive(pages.addProducts)}>
                <a id={pages.addProducts} href="/admin" onClick={(e)=> props.toggleActive(e)}>New Product</a>
            </li>
            <li className={isActive(pages.showProducts)}>
                <a id={pages.showProducts} href="/admin" onClick={(e)=> props.toggleActive(e)}>Show Products</a>
            </li>
        </ul>
        </nav>
    )
};


export default BreadCrumb;