import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setDisconnect, setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getApiUrl, getData, sendData } from '../../Methodes';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import Select from 'react-select';
import { MODULE_URL, SERVICE_URL } from '../../store/constants';
import ServiceList from '../Components/Details/ServiceList';
import DetailFacture from '../Components/Details/DetailFacture';
import { LockClosedIcon, PowerIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


const Caisse = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [detailModal, setDetailModal] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [venteId, setVenteId] = useState<any>();
    const [loading, setLoading] = useState<any>(false);

    const [defaultParams] = useState({
        id: null,
        libelle: '',
        color: '',
        
    });

    const [params, setParams] = useState<any>({});
    const [filteredItemsInit, setFilteredItemsInit] = useState<any>([]);

    const [search, setSearch] = useState<any>('');
    const [moduleSelected, setModuleSelected] = useState<number>(-1);
    const [modules, setModules] = useState<any>([]);
    const [response, setResponse] = useState<any>({});
    const [contactList] = useState<any>([]);

    const navigate = useNavigate();

    const [filteredItems, setFilteredItems] = useState<any>([]);

    useEffect(() => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.typePaiement.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList]);

  
    useEffect(() => {
        getModule()
        getStatus()
    }, []);


    const clotureCaisse=async()=>{
        setShowLoader(true)
        await sendData(
            "api/cloture_caisse",
            {},
           )
            .then(async (resp:any)=> {
               console.log("resp",resp?.data)
               handlePrintSituation()
               
            })
            .catch((resp:any) => {
             
                let violations = resp?.response?.data?.message ;
                console.log("errros",resp)
 
            });
            setShowLoader(false)
    }

    const saveUser = async(e:any) => {
        let msg=e?.id?"modifié":"ajouté"
        setLoading(true)
        console.log("req",e)
            await sendData(
                "api/caisse",
                e,
               )
                .then(async (resp:any)=> {
                   console.log("resp",resp?.data)
                   if(resp?.data?.data){
                        setVenteId(resp?.data?.data?.services[0]?.id)
                        refreshData(resp?.data?.data?.services[0])
                        setResponse(resp?.data?.data?.services[0])
                        setParams({})
                        setLoading(false)
                        showMessage(`Service ${msg} avec succès.`);
                        
                   }else{
                    setLoading(false)
                    showMessage(`${resp?.data?.errors}`,'error');
                   }
                   
                })
                .catch((resp:any) => {
                    setLoading(false)
                    let violations = resp?.response?.data?.errors ;
                    showMessage(`${violations}`,'error');

                    console.log("errros",violations)
     
                });
                
                // setAddContactModal(false);
            
       

        
    };

    const refreshData=(data:any)=>{

        if(params?.id){
            const id: any = filteredItems.findIndex((d: any) => d.id === params.id);
            let old=filteredItems
            old[id]=data
            setFilteredItems(old)
            setFilteredItemsInit(old)
        }else{
            setFilteredItems([data,...filteredItems])
            setFilteredItemsInit([data,...filteredItems])
        }
    }

  

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const handleInfos = (user: any ) => {
        setParams(user);
        
        setDetailModal(true);
    };

    const handlePrint=(el:any)=>{
        setVenteId(el?.id)
        setTimeout(()=>document?.getElementById("pdf")?.click())
    }

    const handlePrintSituation=()=>{
        // document?.getElementById("pdf-cloture")?.click()
        dispatch(setDisconnect("deconnexion"))
        navigate("/auth/boxed-signin")
    }

   const handleFilter=(e:any)=>{
    setModuleSelected(parseInt(e))
    setFilteredItems(filteredItemsInit?.filter((el:any)=>el?.module.id==e))
   }

    const getStatus=async()=>{
        const { data } = await getData(SERVICE_URL);
        setFilteredItems(data?.data?.services || []);
        setFilteredItemsInit(data?.data?.services || [])
    }

    const CloseCaisse=()=>{
        Swal.fire({
            icon: 'warning',
            title: 'Etes vous sur d\'éffectuer cette tache?',
            text: "Cette action est irreversible\n et vous serai déconnecté après cette action; rassurez-vous d'avoir imprimer votre situation générale.",
            showCancelButton: true,
            confirmButtonText: 'Cloturer ma caisse',
			cancelButtonText: "Annuler",
            showLoaderOnConfirm: true,
            padding: '2em',
            customClass: 'sweet-alerts',
        }).then((result) => {
            if (result.value) {
                clotureCaisse()
            }
        });
    }

    const getModule=async()=>{
        const { data } = await getData(MODULE_URL);
        setModules(data?.data?.modules?.map((val:any)=>({label:val?.nom,value:val?.id})))
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

    const handlePrintByService=()=>{
        let docUrl = document.createElement('a');
        docUrl.href = getApiUrl()+"/vente/historique-pdf-module/"+moduleSelected;
        docUrl.target="_blank"
        document.body.appendChild(docUrl);
        docUrl.click();
        
  }

    return (
        <div>
             {showLoader && (
                    <Loader/>
                )}
                <a id="pdf" style={{display:"none"}} href={getApiUrl()+"/vente/ticket-pdf-service/"+venteId} target="_blank">pdf link</a>
                <a id="pdf-cloture" style={{display:"none"}} href={getApiUrl()+"/vente/situation-generale-pdf"} target="_blank">pdf link</a>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex sm:flex-row flex-col">
                    {/* <h2 className="text-xl mt-1">CAISSE</h2> */}
                    <div style={{minWidth:250}} className="mb-0 ml-5 w-full">
                        <Select  placeholder="Filter par service" onChange={(e:any)=>{handleFilter(e?.value)}} options={modules}  isSearchable={true}/>
                    </div>
                </div>
                
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    
                    <div className="flex gap-3">
                        {moduleSelected>=0 && <div>
                            <button type="button" className="btn btn-warning" onClick={() => handlePrintByService()}>
                            <PrinterIcon strokeWidth={1} className="h-6 w-6 hover mr-1 text-white" />

                                Imprimer la caisse
                            </button>
                        </div>}
                        {filteredItems?.length!==0 && (<div>
                            <button type="button" className="btn btn-danger" onClick={() => CloseCaisse()}>
                            <PowerIcon strokeWidth={1} className="h-6 w-6 hover mr-1 text-white" />

                                Cloturer la caisse
                            </button>
                        </div>)}
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                            <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                                Nouveau service
                            </button>
                        </div>
                       
                       
                    </div>
                    {/* <div className="relative">
                        <input type="text" placeholder="Recherche" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div> */}
                </div>
            </div>
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Nom du patient</th>
                                    <th>Service</th>
                                    <th>Medecin</th>
                                    <th>Total(Fcfa)</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.created_at}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{(contact?.patient?.prenom || "")+" "+(contact?.patient?.nom ||"")}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.module?.nom}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.medecin?.nom+" "+contact?.medecin?.prenom}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.montant_total?.toLocaleString()}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                   <IconBtn
                                                        isPrint={true}
                                                        isInfos={true}
                                                        handleInfos={()=>handleInfos(contact)}
                                                        handlePrint={()=>handlePrint(contact)}
                                                   />
                                                 
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            {addContactModal && <ServiceList loadingForm={loading} handleNewService={()=>setResponse({})} response={response} open={addContactModal} setOpen={()=>{setResponse({});setAddContactModal(false)}} handleValidate={(e:any)=>saveUser(e)}/>}
            {detailModal && <DetailFacture data={params}  open={detailModal} setOpen={()=>setDetailModal(false)} />}

        </div>
    );
};

export default Caisse;
