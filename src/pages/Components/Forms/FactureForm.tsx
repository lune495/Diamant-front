import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import { Typography } from "@material-tailwind/react";
import { getData } from "../../../Methodes";
import TypeServiceItem from "../Lists/TypeServiceList";
import { DOCTEUR_URL } from "../../../store/constants";
import TableUser from "../Tables/TableUser";

const FactureForm:FunctionComponent<BtnProps> = ({service_list,loading,handleSave,title}) => {
    const [params, setParams] = useState<any>({montant:0,remise:0,module_id:title?.id});
    const [data, setData] = useState<any>([]);
    const [medecins, setMedecins] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [text, setText] = useState<any>("");

    const services=[
        {label:"Consultation enfant",value:5000},
        {label:"Consultation adulte",value:7000},
    ]
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const generateRandomString = () => {
        return Math.floor(Math.random() * Date.now()).toString(36);
    }

    const handleValidate = (val:any) => {
        setText("")
        setUsers([])
        setParams({...params,...val})
    }

    const getContact=async()=>{
        const { data } = await getData(DOCTEUR_URL);
        // setFilteredItemsInit(data?.result)
        setMedecins(data?.data?.medecins?.map((val:any)=>({label:val?.nom+" "+val?.prenom,value:val?.id})))
    }

    const handleService=(e:any)=>{
        setData(e)
        setParams({...params,type_services:e?.map((el:any)=>({
                type_service_id:el?.value?.id,
                module_id:title.id,
                prix:e.prix,
                nom:e.nom
            }))})
    }
  const handleFiltreLocataire= async ()=>{
        setUsers([])
     if(text){
            const { data } = await getData("graphql?query={patients(search:\""+text+"\"){"+
         "id nom prenom telephone"+
      "}}");

      setUsers(data.data?.patients)
     }else{
      setUsers([])

     }
      


  }
   const handleLocataire= async ()=>{
            const { data } = await getData("graphql?query={patients(search:\""+text+"\"){"+
         "id nom prenom telephone"+
      "}}");

      setUsers(data.data?.patients?.slice(0, 10))

  }

   useEffect(() => {
        handleFiltreLocataire()
     }, [text]);


    useEffect(() => {
        // getContact()
        handleLocataire()
        setMedecins(title.medecins?.map((val:any)=>({label:val?.nom+" "+val?.prenom,value:val?.id})))
        setParams({...params,ref:"Fact-"+generateRandomString()})
     }, []);
    
  
    return (
        
            <div className="p-5 w-full">
                     <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                        <div style={{color:"#ff8041"}} className="uppercase underline flex justify-center text-center">{ 'Nouvelle Facture '+title.nom}</div>
                     </div>
                <form>
                <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 border-r-4 md:col-span-4 p-3 ">
                            <div className="mb-5 w-full">
                                    <label htmlFor="name">Recherche</label>

                                    <input id="search" type="text" placeholder="Rechercher par nom/prénom" className="form-input" value={text} onChange={(e) => setText(e.target.value)} />
                            </div>
                            {users.length>0 &&
                                   <TableUser data={users} handleValidate={handleValidate}/>
                            }
                        </div>
                        <div className="col-span-12  md:col-span-8 ">
                            <div className="flex flex-row w-full">
                                <div className="mb-5 w-full mr-2">
                                    <label htmlFor="name">Ref</label>
                                    <input id="ref" type="text" placeholder="Ref" className="form-input" value={params.ref} onChange={(e) => changeValue(e)} />
                                </div>
                                <div className="mb-5 w-full">
                                    <label htmlFor="name">Medecin</label>
                                    <Select  className="focus:border-[#ff8041]" placeholder="Choisir le medecin" onChange={(e:any)=>{setParams({...params,medecin_id:e.value})}} options={medecins}  isSearchable={true}/>
                                </div>
                            </div>
                            <div className="flex flex-row w-full">
                                <div className="mb-5 w-full mr-2">
                                    <label htmlFor="name">Nom</label>
                                    <input id="nom" type="text" placeholder="Entrer le nom  du patient" className="form-input" value={params.nom} onChange={(e) => changeValue(e)} />
                                </div>
                                <div className="mb-5 w-full">
                                    <label htmlFor="name">Prenom</label>
                                    <input id="prenom" type="text" placeholder="Entrer le prenom du patient" className="form-input" value={params.prenom} onChange={(e) => changeValue(e)} />
                                </div>
                            </div>
                            <div className="flex flex-row w-full">
                                <div className="mb-5 w-full mr-2">
                                    <label htmlFor="name">Date de naissance</label>
                                    <input id="date_naissance" type="date" placeholder="Entrer la date de naissance du patient" className="form-input" value={params.date_naissance} onChange={(e) => changeValue(e)} />
                                </div>
                                <div className="mb-5 w-full">
                                    <label htmlFor="name">Téléphone</label>
                                    <input id="telephone" type="text" placeholder="Entrer le téléphone du patient" className="form-input" value={params.telephone} onChange={(e) => changeValue(e)} />
                                </div>
                            </div>
                            <div className="flex flex-row w-full">
                                
                                <div className="mb-5 w-[49.5%]">
                                    <label htmlFor="name">Remise</label>
                                    <input id="remise" type="number" placeholder="Entrer la remise" className="form-input" value={params.remise} onChange={(e) => changeValue(e)} />
                                </div>
                            
                    
                            </div>
                            
                            <div className="mb-5 w-full">
                                    <Select  className="focus:border-[#ff8041]" placeholder="Choisir le/les type(s) de service" onChange={(e:any)=>handleService(e)} options={service_list} isMulti isSearchable={true}/>
                            </div>
                            <div className="mt-1">
                                <TypeServiceItem loading={loading} handleValidate={()=>handleSave(params)} data={data}/>
                            </div>
                       
                        </div>

                    </div>


                
                </form>
            </div>
            
    )

}

export default FactureForm;

interface BtnProps {
    // open: boolean;
    service_list: any;
    handleSave:any;
    title:any;
    loading:boolean
    
}