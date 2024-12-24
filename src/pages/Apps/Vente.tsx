import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getApiUrl, getData, sendData } from '../../Methodes';
import DropDownAction from '../Components/Buttons/DropDownAction';
import Select from 'react-select';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import DocteurForm from '../Components/Forms/DocteurForm';
import { DOCTEUR_URL, MODULE_URL } from '../../store/constants';
import VenteForm from '../Components/Forms/VenteForm';
import DetailVente from '../Components/Details/DetailVente';

const Vente = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isOpenInfo,setIsOpenInfo] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({});


    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [user, setUser] = useState<any>({});
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');
    const [contactList] = useState<any>([]);
    const [classe, setClasse] = useState<any>([]);
    const [filteredItemsInit, setFilteredItemsInit] = useState<any>([]);
    const [vente, setVente] = useState<any>([]);
    const [filteredItems, setFilteredItems] = useState<any>(contactList);

    useEffect(()=>{
        const el:any=localStorage.getItem("apescol_user")
        const userPars=JSON.parse(el)
        setUser(userPars)
        getVentes()
    },[])

     const getVentesPaginated = async () => {
      const url="graphql?query={ventes{id statut nom_complet paye  numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name}}}"
      // const url1 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",user_id:" + user_id +"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name} }}}"
      // const url2 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",created_at_start:\"" + date1 + "\",created_at_end:\"" + date2 +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant remise_total montant_avec_remise qte montant_ht montant_ttc user { id name} }}}"
      // const url3 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",reference:\"" + ref +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise remise_total qte montant_ttc montant_ht user { id name} }}}"
      // setLoading(true)
      const { data } = await getData(url);
      let datas=[]
      setFilteredItems(data?.data?.ventes)
      setLoading(false)
      
    };

    const getVentes = async () => {
      const url="graphql?query={ventes{id statut nom_complet paye  numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte pu_net montant_net prix_vente remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name}}}"
      // const url1 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",user_id:" + user_id +"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} numero montant_ht montant_ttc remise_total montant_avec_remise created_at vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise qte montant_ht montant_ttc remise_total user { id name} }}}"
      // const url2 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",created_at_start:\"" + date1 + "\",created_at_end:\"" + date2 +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant remise_total montant_avec_remise qte montant_ht montant_ttc user { id name} }}}"
      // const url3 = "graphql?query={ventespaginated(count:" + count + ",page:" + page + ",reference:\"" + ref +"\"){metadata{current_page per_page} data{id statut nom_client client{nom_complet} created_at numero montant_ttc remise_total montant_avec_remise vente_produits{qte remise montant_remise total produit{designation} }  montant montant_avec_remise remise_total qte montant_ttc montant_ht user { id name} }}}"
      // setLoading(true)
      const { data } = await getData(url);
      let datas=[]
      setFilteredItems(data?.data?.ventes)
      setLoading(false)
      
    };


    useEffect(() => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList]);

    const saveUser = async(req:any) => {
        console.log("req",req)
        
        setLoading(true)
        let msg=req?.id?"modifié":"ajouté"

            //add user
            await sendData(
                "api/ventes",
                req,
               )
                .then(async (resp:any)=> {
                    refreshData(resp?.data?.data?.ventes[0])
                  
                    showMessage(`Vente ${msg} avec succès.`);
                    setAddContactModal(false);
                   
                })
                .catch((resp:any) => {
                 
                    let violations = resp?.response?.data?.message ;
                    showMessage(violations?violations:"une erreur est survenue",'error');
                });
                    

                
                setLoading(false)
        
    };




    const refreshData=(data:any)=>{
        console.log("update",data,"",params)
        if(params?.id){
            const id: any = filteredItems.findIndex((d: any) => +d.id === +params.id);
            let old=filteredItems
            old[id]=data
            setFilteredItems(old)
            
        }else{
            setFilteredItems([data,...filteredItems])
        }
    }

    const handleFilter=(e:any)=>{
        setFilteredItems(filteredItemsInit?.filter((val:any)=>val?.classe.nom===e))
    }
    

    const editUser = (user: any = {}) => {
        setParams(user);
        setIsOpenInfo(true);
    };

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        showMessage('Classe supprimé avec succès.');
    };

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

const handleDownload=(data:any)=>{
    
     let docUrl = document.createElement('a');
    docUrl.target = '_blank';
      docUrl.href = getApiUrl()+"/vente/generate-pdf/"+data.id;
      document.body.appendChild(docUrl);
      docUrl.click();
  }

const handleSituation=()=>{
    
     let docUrl = document.createElement('a');
    docUrl.target = '_blank';
      docUrl.href = getApiUrl()+"//vente/situation";
      document.body.appendChild(docUrl);
      docUrl.click();
  }

const confirmClose=()=>{
  Swal.fire({
            title: "Confirmation fermeture",
            text: 'Confirmez-vous la fermeture de la page?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            reverseButtons:true
            }).then((result) => {
            if (result.isConfirmed) {
                setAddContactModal(false)
            }
        });
}
    

    return (
        <div>

             {showLoader && (
                    <Loader/>
                )}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">VENTE</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                {/* <div className="mb-0 mr-5">
                        <Select  placeholder="Filter par classe" onChange={(e:any)=>{handleFilter(e?.value)}} options={classe}  isSearchable={true}/>
                </div> */}
                 <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => {setParams({});setAddContactModal(true)}}>
                                <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Nouvelle Vente
                            </button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-warning flex gap-2" onClick={() => {handleSituation()}}>
                                <svg style={{cursor:"pointer"}}  xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-file-earmark-pdf-fill" viewBox="0 0 16 16">
                                    <path d="M5.523 12.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 6.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"/>
                                    <path fill-rule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.7 11.7 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"/>
                                </svg>
                                Situation Journalière
                            </button>
                        </div>
                         
                    </div>
                    
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Ref</th>
                                    <th>Quantité</th>
                                    <th>Total (FCFA)</th>
                                    <th>
                                          <div className="flex gap-4 items-center justify-center">
                                          Actions
                                         </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.map((contact: any) => {
                                    return (
                                        <tr key={contact.id} style={contact?.statut?{backgroundColor:"#f7d0c8"}:{}}>
                                        <td>{new Date(contact?.created_at)?.toLocaleDateString()+ " "+ new Date(contact?.created_at)?.toLocaleTimeString()}</td>
                                        <td>{contact?.numero}</td>
                                        <td>{contact?.qte}</td>
                                        <td>{contact.montant_ttc ? contact.montant_ttc : contact.montant_avec_remise}</td>
                                        {/* <td><span style={{ fontSize: 14, paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 30, fontWeight: 900, backgroundColor: contact?.paye === true ? "#83f789" :"rgb(242 123 114)"}}>{contact?.paye?"PAYE":"NON PAYE"}</span></td> */}
                                        <td>
                                          <div className="flex gap-4 items-center justify-center">
                                                  <IconBtn
                                                    isInfos={true}
                                                    isPdf={true}

                                                    // isDelete={true}
                                                    // handleDelete={()=>deleteUser(contact)}
                                                    handleInfos={()=>editUser(contact)}
                                                    handlePdf={()=>handleDownload(contact)}
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
            )}
            {addContactModal && <VenteForm loading={loading} data={params} open={addContactModal} setOpen={()=>confirmClose()} handleValidate={(e:any)=>saveUser(e)}/>}
            {isOpenInfo && <DetailVente data={params} open={isOpenInfo} setOpen={()=>{setIsOpenInfo(false);setParams({})}} />}
        </div>
    );
};

export default Vente;
