import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';


const DetailAppro:FunctionComponent<BtnProps> = ({data,open,setOpen}) => {

    const [params, setParams] = useState<any>(data);
    const [value1, setValue1] = useState(
        ''
    );
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        // handleAction({ ...params, [id]: value })
        setParams({ ...params, [id]: value });
    };
    const options5 = [
        { value: 'Ambassade de France', label: 'Indicateur 1' },
        { value: 'white', label: 'Indicateur 2' },
        { value: 'purple', label: 'Indicateur 3' },
    ];

  

    useEffect(() => {
        console.log("data facture",params)
     }, []);

    return (
        <div>
             
             <Transition appear show={open} as={Fragment}>
                <Dialog as="div" open={open} onClose={() => setOpen()} className="relative z-50">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-8xl text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setOpen()}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                   
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        <div style={{color:"#ff8041"}} className="uppercase underline flex justify-center text-center">{ 'Détail approvisionnement'}</div>
                                    </div>
            
                                   <div className="mt-5 grid w-full grid-cols-12 panel p-0 border-0 overflow-hidden">
                                    <div className=" col-span-4 w-full panel">
                                       <ul className=" m-auto space-y-5 font-semibold text-white-dark">
                                                <li className="flex items-center gap-2">
                                                     <strong>Date: </strong> <span>{new Date(data?.created_at)?.toLocaleDateString()+ " "+ new Date(data?.created_at)?.toLocaleTimeString()}</span>
                                                     <hr/>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                     <strong>Reférence: </strong> <span>{data?.numero}</span>
                                                     <hr/>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <strong>Fournisseur : </strong> <span>{data?.fournisseur?.nom_complet}</span>
                                                     <hr/>

                                                </li>
                                                 <li className="flex items-center gap-2">
                                                    <strong>Quantité total  : </strong> <span>{data?.qte_total_appro}</span>
                                                     <hr/>

                                                </li>
                                                 
                                                 <li className="flex items-center gap-2">
                                                    <strong>Montant total : </strong> <span>{(data?.montant || 0) + ' Fcfa'}</span>
                                                     <hr/>
                                                
                                                </li>
                                        </ul>
                                    </div>

                                    <div className="col-span-8 w-full table-responsive panel">
                                        <table className="table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Nom</th>
                                                    <th>Quantité</th>
                                                    <th>Total</th>
                                                   
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data?.ligne_approvisionnements?.map((contact: any) => {
                                                            return (
                                                                <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                                                    <td>
                                                                        <div className="flex items-center w-max">
                                                                            <div>{contact?.produit?.designation}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="flex items-center w-max">
                                                                            <div>{contact?.quantity_received}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="flex items-center w-max">
                                                                            <div>{contact?.quantity_received*contact?.produit?.pa}</div>
                                                                        </div>
                                                                    </td>
                                                                   
                                                                       <td>
                                                                        
                                                                    </td>
                                                                
                                                                        </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                    </div>
                                          </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )

}

export default DetailAppro;

interface BtnProps {
    setOpen: any;
    open: boolean;
    data: any;
}