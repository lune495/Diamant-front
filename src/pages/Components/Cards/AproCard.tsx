import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import { Typography } from "@material-tailwind/react";
import { getData } from "../../../Methodes";
import { FAMILLE_URL } from "../../../store/constants";
import { TrashIcon } from "@heroicons/react/24/outline";

const AproCard:FunctionComponent<BtnProps> = ({data,handleDelete,handleValidate}) => {
    const [params, setParams] = useState<any>(data);
    const [labels, setLabels] = useState<any>([]);
    const [imageUrl, setImageUrl] = useState<any>("");
   
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        let total=0

        if(id=="quantite" && value){
           total=params.pu*value
        }else if(value){
           total=params.quantite*value
        }


        if(value){
          setParams({ ...params, [id]: value,total:total});
          handleValidate({ ...params, [id]: value,total })
        }else{
            setParams({ ...params, [id]: value,total:0 });
            handleValidate({ ...params, [id]: value,total:0 })
        }
        
    };

 
  
    return (
            <div className="p-5 panel m-3">
                <div className="mb-5 flex justify-between">
                    <h6 className="font-semibold text-md dark:text-white-light">{params.designation}</h6>
                     <div className="md:flex md:flex-row sm:flex-col gap-2">
                        <div className="mb-5">
                            <label htmlFor="name">Quantité</label>
                            <input id="quantite" type="text" placeholder="Entrer la quantité" className="form-input" value={params.quantite} onChange={(e) => changeValue(e)} />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="name">Prix Unitaire</label>
                            <input id="pu" type="text" placeholder="Entrer le prix unitaire" className="form-input" value={params.pu} onChange={(e) => changeValue(e)} />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="name">Total</label>
                            <input style={{color:'gray'}} id="total" type="text" disabled className="form-input" value={params.total}  />
                        </div>
                        </div>
                     <TrashIcon onClick={handleDelete} style={{cursor:"pointer"}} strokeWidth={2} className="h-6 w-6 hover text-danger " />
                </div>
                <form>

                {/* <ul className="mt-5 flex flex-col  max-w-[400px] m-auto space-y-5 font-semibold text-white-dark">
                        <li className="flex items-center gap-2">
                            <strong>Temps de consultation : </strong> <span>{(params?.rateTime || 0) + ' mins'}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <strong>Temps de consultation : </strong> <span>{(params?.rateTime || 0) + ' mins'}</span>
                        </li>
                </ul> */}
               

              
                </form>
        </div>
    )

}

export default AproCard;

interface BtnProps {
    handleDelete: any;
    data: any;
    handleValidate: any;
    
}