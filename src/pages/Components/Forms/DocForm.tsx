import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import { Typography } from "@material-tailwind/react";
import { getData } from "../../../Methodes";
import { dateFormatFr, MODULE_URL } from "../../../store/constants";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

const DocForm:FunctionComponent<BtnProps> = ({open,data,loading,setOpen,handleValidate}) => {
    const [params, setParams] = useState<any>(data?.id?data:{date:""});
    const [req, setReq] = useState<any>({});
    const [labels, setLabels] = useState<any>([]);
    const [patient, setPatient] = useState<any>([]);
   
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };
    
    const handleSearch= ()=>{
    }

    useEffect(() => {
        // getStatus()
     }, []);

     const getStatus=async()=>{
        const { data } = await getData(MODULE_URL);
        setLabels(data?.data?.modules?.map((val:any)=>({label:val?.nom,value:val.id})))
    }

    const handleFiltrer= async ()=>{

        if(!params.date && !params.phone){
            return
        }

      const { data } = await getData("graphql?query={patients(telephone:\""+params.phone+"\",date_naissance:\""+params.date+"\"){"+
         "id nom prenom date_naissance telephone"+
      "}}");
       setPatient(data?.data?.patients)
    

  }
    
  
    return (
        <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={() => setOpen()} className="relative z-50">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-[black]/60" />
            </Transition.Child>
            <div   className="fixed inset-0 overflow-y-auto">
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
                        <Dialog.Panel style={{borderWidth:2,borderColor:"#ff8041"}} className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl text-black dark:text-white-dark">
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
                            <div style={{color:"#ff8041"}} className="uppercase underline">{params.id ? 'Editer Docteur' : 'Ajouter un Dossier'}</div>
                            </div>
                                <div className="flex p-3 gap-3">
                                    <div className="mb-5 w-80">
                                            <label htmlFor="name">Téléphone</label>
                                            <input id="phone" type="text" placeholder="Tél" className="form-input" value={params.phone} onChange={(e) => changeValue(e)} />
                                    </div>
                                    <div className="mb-5 w-80">
                                            <label htmlFor="name">Date de naissance</label>
                                            <input id="date" type="date" placeholder="Naissance" className="form-input" value={params.date} onChange={(e) => changeValue(e)} />
                                    </div>
                                    <div className="ml-2" >
                                         <label>&nbsp;</label>
                                         <button type="button" className="btn btn-outline-primary ltr:ml-4 rtl:mr-4" onClick={()=>handleFiltrer()}>
                                              Rechercher le patient
                                        </button>
                                        {/* <MagnifyingGlassCircleIcon onClick={()=>handleFiltrer()} style={{cursor:"pointer"}} strokeWidth={2} className="h-8 w-8 hover text-info mt-1" /> */}
                                    </div>
                               </div>
                            <div className="p-5">
                         
                            {patient?.length>0 && <div className="mt-5 panel p-0 border-0 overflow-hidden">
                            <div className="table-responsive">
                            <table className="table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prenom</th>
                                        <th>Date de naissance</th>
                                        <th>Tel</th>
                                        <th className="!text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {patient.map((contact: any) => {
                                    return (
                                            <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        <div>{contact?.nom}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        <div>{contact?.prenom}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        <div>{dateFormatFr(contact?.date_naissance)}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center w-max">
                                                        <div>{contact?.telephone}</div>
                                                    </div>
                                                </td>
                                               
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                    {loading?<button type="button" className="btn btn-primary btn-md ml-1">
                                                        <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                                        Enregitrement...
                                                    </button>: 
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={()=>handleValidate({patient_id:contact.id})}>
                                                                Créer le dossier
                                                        </button>}
                                                    </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>}

                              <div className="flex justify-end items-center mt-8">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setOpen()}>
                                        Annuler
                                    </button>
                              </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
    )

}

export default DocForm;

interface BtnProps {
    open: boolean;
    loading: boolean;
    setOpen: any;
    data: any;
    handleValidate: any;
    
}