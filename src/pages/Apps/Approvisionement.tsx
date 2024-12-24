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
import ApproForm from '../Components/Forms/ApproForm';
import DetailAppro from '../Components/Details/DetailAppro';
import Pagination from '../Components/Pagination';

const Approvisionement = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isOpenInfo,setIsOpenInfo] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<any>('list');
    const [total, setTotal] = useState<number>(0);
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
        getVentesPaginated(15,1)
    },[])

     const getVentesPaginated = async (count:number,page:number) => {
     
     const { data } = await getData("graphql?query={approvisionnementspaginated(count:" + count + ",page:" + page + "){ metadata{current_page total per_page} data{id statut numero montant qte_total_appro type_appro fournisseur{nom_complet} created_at ligne_approvisionnements{quantity_received  produit{designation pv pa qte} }  user { id name} }}}");

      let datas=[] 
      setFilteredItems(data.data?.approvisionnementspaginated?.data || [])
      setTotal(data.data?.approvisionnementspaginated?.metadata?.total)
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
                "api/approvisionnements",
                req,
               )
                .then(async (resp:any)=> {
                    refreshData(resp?.data?.data?.approvisionnements[0])
                  
                    showMessage(`Approvisionement ${msg} avec succès.`);
                   
                   
                })
                .catch((resp:any) => {
                 
                    let violations = resp?.response?.data?.message ;
     
                });
                setAddContactModal(false);
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
                <h2 className="text-xl">APPROVISIONNEMENT</h2>
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
                                Nouvel Approvisionement
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
                                        <td>{contact?.qte_total_appro}</td>
                                        <td>{contact.montant}</td>
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
            {total>0 && <div className="flex justify-end">
                <Pagination
                    total={total}
                    per_page={15}
                    handleClick={(e:any)=>{getVentesPaginated(15, e)}}
                />
        </div>}
            {addContactModal && <ApproForm loading={loading} data={params} open={addContactModal} setOpen={()=>confirmClose()} handleValidate={(e:any)=>saveUser(e)}/>}
            {isOpenInfo && <DetailAppro data={params} open={isOpenInfo} setOpen={()=>{setIsOpenInfo(false);setParams({})}} />}
        </div>
    );
};

export default Approvisionement;
