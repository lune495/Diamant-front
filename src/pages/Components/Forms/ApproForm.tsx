import { Dialog, Transition } from "@headlessui/react";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import { Typography } from "@material-tailwind/react";
import { getData, sendData } from "../../../Methodes";
import { FAMILLE_URL, FOURN_URL } from "../../../store/constants";
import VenteCard from "../Cards/VenteCard";
import TableProduit from "../Tables/TableProduit";
import Swal from "sweetalert2";
import { MagnifyingGlassCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import FournisseurForm from "./FournisseurForm";
import AproCard from "../Cards/AproCard";

const ApproForm:FunctionComponent<BtnProps> = ({open,data,loading,setOpen,handleValidate}) => {
    const [params, setParams] = useState<any>(data?.id?data:{});
    const [labels, setLabels] = useState<any>([]);
    const [imageUrl, setImageUrl] = useState<any>("");
    const [search, setSearch] = useState<any>("");
    const [totaux, setTotaux] = useState<any>({total:0,qte:0});
    const [defaultFournisseur, setDefaultFournisseur] = useState<any>({});
    const [ProduitVente, setProduitVente] = useState<any>([]);
    const [panierProduit, setPanierProduit] = useState<any>([]);
    const [fournisseur, setFournisseur] = useState<any>([]);
    const [addContactModal, setAddContactModal] = useState<any>(false);

    
   
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const changeValueImage = (e: any) => {
        setImageUrl(URL.createObjectURL(e.target.files[0]))
        setParams({ ...params, image: e.target.files[0] });
    };
    const handleService= (e:any)=>{
        setParams({ ...params, famille_id: e });
    }

    
    const onSubmitCl = async (post:any) => {

    if(!data.nom_complet){
        showMessage("Veuillez renseigner le nom",'error')

        return 

    }

      await sendData(
         "api/fournisseurs",
         post,
         )
        .then(async (resp:any) => {

          setLabels([...labels,{label:resp.data?.nom_complet,value:resp.data?.id}])
          setDefaultFournisseur({label:resp.data?.nom_complet,value:resp.data?.id})

         setAddContactModal(false)
         
          // alert(
          //  "Client ajouté avec succès",
          //   "success"
          // );
        })
        .catch(() => {
          // alert(
          //  "Une erreur est survenue",
          //   "danger"
          // );
          
         
        });
  
    }

  const handleChoose=(val:any)=>{

    if(panierProduit?.find((e:any)=>e.produit_id==val.id)){
        showMessage(`Le produit ${val.designation} existe deja dans le panier`,'error')
        return
    }

    setPanierProduit([{produit_id:val.id,remise:0,qte:1,quantite:1,pu:val.pv,pv:val.pv,total:val.pv,designation:val.designation},...panierProduit])
    calculTotal([{produit_id:val.id,remise:0,qte:1,quantite:1,pu:val.pv,pv:val.pv,total:val.pv,designation:val.designation},...panierProduit])
    setProduitVente([])
    setSearch("")
  }

const calculTotal=(e:any)=>{

    setTotaux({total:e?.reduce((h:any,n:any)=>h+=parseInt(n.total),0),qte:e?.reduce((h:any,n:any)=>h+=parseInt(n.qte),0)})
}
const handleUpdate=(e:any)=>{
    const resp=panierProduit
    const index=panierProduit.findIndex((el:any)=>el.produit_id==e.produit_id)
    resp[index]=e
    setPanierProduit(resp)
    calculTotal(resp)
    
  }
    const handleFiltre= async ()=>{
        if(search){
                    const { data } = await getData("graphql?query={produits(search:\""+search+"\"){"+
            "designation pv pa id qte famille{nom}"+
            "}}");
        
            setProduitVente(data.data?.produits)
        }else{
            setProduitVente([])
        }
        

    }
  const handleDelete=(e:any)=>{
     const data=panierProduit.filter((el:any)=>el.produit_id!=e.produit_id)
      setPanierProduit(data)
     
  }
   const getFourn=async()=>{
        const { data } = await getData(FOURN_URL);
        setLabels(data?.data?.fournisseurs?.map((val:any)=>({label:val?.nom_complet,value:val.id})))
    }
 useEffect(() => {
        handleFiltre()
     }, [search]);

     
  useEffect(() => {
        getFourn()
     }, []);

  const handleSave=()=>{

    if(!panierProduit?.length ){
        return 

    }

     if(!defaultFournisseur.value){
        showMessage("Veuillez renseigner le fournisseur",'error')

        return 

    }


    handleValidate({
        details:panierProduit,
        fournisseur_id:defaultFournisseur.value,
        type_appro:"BOUTIQUE"
    })
  }
    // useEffect(() => {
    //     handleFiltre()
    //  }, [search]);

     const handleSearch=()=>{

     }

     const getStatus=async()=>{
        const { data } = await getData(FAMILLE_URL);
        setLabels(data?.data?.familles?.map((val:any)=>({label:val?.nom,value:val.id})))
    }

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
  
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
                        <Dialog.Panel style={{borderWidth:2,borderColor:"#ff8041"}} className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-8xl text-black dark:text-white-dark">
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
                                 <div style={{color:"#ff8041"}} className="uppercase underline">{'Approvisionnement' }</div>
                            </div>

                             {addContactModal && <FournisseurForm loading={loading} data={params} open={addContactModal} setOpen={()=>setAddContactModal(false)} handleValidate={(e:any)=>onSubmitCl(e)}/>}
                              
                            <div  className="grid w-full grid-cols-12 gap-6 mt-3">

                                {/* search block */}
                                <div className="col-span-4 w-full panel">
                                <div className="mb-1 w-full mt-1">
                                        <label htmlFor="occupation">Fournisseur</label>
                                     <div className="flex w-full">
                                        <Select  className="focus:border-[#ff8041] w-full" value={defaultFournisseur} onChange={(e:any)=>{setDefaultFournisseur(e)}} options={labels}  isSearchable={true}/>
                                        <PlusCircleIcon onClick={() =>setAddContactModal(true)} style={{cursor:"pointer"}} strokeWidth={2} className="h-9 w-9 hover text-info "/>
                                        
                                    </div>
                                </div>
                                  <div className="mb-5 mt-5">
                                    <label htmlFor="name">Recherche produit</label>
                                     {/* <div className="flex"> */}
                                    <input id="search" type="text" placeholder="Recherche produit" className="form-input" value={search} onChange={(e) => setSearch(e.target?.value)} />
                                        {/* <MagnifyingGlassCircleIcon onClick={handleFiltre} style={{cursor:"pointer"}} strokeWidth={2} className="h-9 w-9
                                            hover text-info mt-1" /> */}
                                    {/* </div> */}
                                </div>
                                 {ProduitVente?.length>0 && 
                                    <TableProduit handleValidate={(e:any)=>handleChoose(e)} data={ProduitVente} />
                                  }
                                 {panierProduit?.length>0 && <div className="mb-5">
                                    <label htmlFor="name">Total produit</label>
                                    <input style={{backgroundColor:"#ecf7eb"}} id="search" type="text" disabled className="form-input" value={totaux.qte}  />
                                </div>}
                                  {panierProduit?.length>0 && <div className="mb-5">
                                    <label htmlFor="name">Montant total</label>
                                    <input style={{backgroundColor:"#9fa39e"}} id="search" type="text" disabled className="form-input" value={totaux.total}  />
                                </div>}

                                 
                                </div>

                                {/* panier block */}
                                <div className="col-span-8  w-full panel">
                                    {panierProduit?.length>0?
                                        panierProduit?.map((el:any,id:number)=>(
                                                 <AproCard handleValidate={(e:any)=>handleUpdate(e)} key={el.produit_id} handleDelete={()=>handleDelete(el)} data={el} />
                                        ))
                                       :

                                        <div className="mb-5">
                                            <h6 className=" text-center font-semibold text-md dark:text-white-light">Votre panier de vente est vide.</h6>
                                        </div>
                                    }
                                </div>

                            </div>
                            

                            <div className="p-5">


                              <form>
                                <div className="flex justify-end items-center mt-8">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setOpen()}>
                                        Annuler
                                    </button>
                                    {loading?<button type="button" className="btn btn-primary btn-md ml-1">
                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            Enregitrement...
                                        </button>: 
                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={()=>handleSave()}>
                                            {'Valider'}
                                    </button>}
                                </div>
                             </form>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
    )

}

export default ApproForm;

interface BtnProps {
    open: boolean;
    loading: boolean;
    setOpen: any;
    data: any;
    handleValidate: any;
    
}