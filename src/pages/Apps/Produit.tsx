import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getApiUrl, getData, sendData } from '../../Methodes';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import DepenseForm from '../Components/Forms/DepenseForm';
import { DEPENSE_URL } from '../../store/constants';
import logo from "/assets/images/product.png"
import ProduitForm from '../Components/Forms/ProduitForm';
import Pagination from '../Components/Pagination';


const Produit = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState<number>(0);
    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        id: null,
        libelle: '',
        color: '',
        
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');
    const [contactList] = useState<any>([]);

    const [filteredItems, setFilteredItems] = useState<any>([]);

    useEffect(() => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.modePaiement.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList]);

   const getProduitsPaginated = async (count:number,page:number,search?:string) => {
      let datas=[]
      const init = "graphql?query={produitspaginated(count:" + count + ",page:" + page + "){metadata{current_page total per_page} data{id  code   designation  pa qte pv famille{nom id}  }}}"
      const url = "graphql?query={produitspaginated(count:" + count + ",page:" + page + ",search:\"" + search +"\"){metadata{current_page total per_page} data{id code  designation  pa qte pv famille{nom id}  }}}"
      setLoading(true)
      const { data } = await getData(search?url:init);
      setTotal(data.data?.produitspaginated?.metadata?.total)
      setFilteredItems(data?.data?.produitspaginated?.data || [])
      setLoading(false)

    };

    const getProduits = async () => {
      let datas=[]
      const init = "graphql?query={ produits{id  pa qte pv  designation  famille{nom id}  }}"
      setLoading(true)
      const { data } = await getData(init);
     
      setFilteredItems(data?.data?.produits)
      setLoading(false)

    };

    useEffect(() => {
            getProduitsPaginated(15,1)

    }, []);

    const saveUser = async(e:any) => {
        if (!e.designation) {
            showMessage('Nom de produit obligatoire.', 'error');
            return true;
        }

        if (!e.famille_id && !e.id) {
            showMessage('Famille requise.', 'error');
            return true;
        }


        setLoading(true)
        let msg=e?.id?"modifié":"ajouté"
       
            
            await sendData(
                "api/produits",
                e,
               )
                .then(async (resp:any)=> {
                   console.log("resp",resp?.data)
                   refreshData(resp?.data?.data?.produits[0])
                   setParams({})
                   showMessage(`Produit ${msg} avec succès.`);
                })
                .catch((resp:any) => {
                 
                    let violations = resp?.response?.data?.message ;
                 
     
                });
                setLoading(false)
                setAddContactModal(false);

        
    };

    const refreshData=(data:any)=>{

        if(params?.id){
            const id: any = filteredItems.findIndex((d: any) => d.id === params.id);
            let old=filteredItems
            old[id]=data
            setFilteredItems(old)
            
        }else{
            setFilteredItems([data,...filteredItems])
        }
    }

    const editUser = (user: any = null) => {
        setParams({});
        if (user) {
            setParams({...user,famille_id:user?.famille.id});
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        showMessage('Mode de paiement supprimé avec succès.');
    };

    const getStatus=async()=>{
        const { data } = await getData(DEPENSE_URL);
        console.log("statut",data)
        setFilteredItems(data?.data?.depenses)
        setShowLoader(false)
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
        <div>
             {showLoader && (
                    <Loader/>
                )}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">PRODUIT</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                            <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                                Nouveau produit
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
                                    <th >Ref</th>
                                    <th>Nom</th>
                                    <th>Famille</th>
                                    <th>Prix</th>
                                    <th>Quantité</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.map((contact: any) => {
                                    return (
                                        <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                            
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.code ? contact?.code : "No ref"}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.designation}</div>
                                                </div>
                                            </td>
                                             <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.famille.nom}</div>
                                                </div>
                                            </td>
                                           
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.pa.toLocaleString()}</div>
                                                </div>
                                            </td>
                                             <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.qte}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                  <IconBtn
                                                    isUpdate={true}
                                                    // isDelete={true}
                                                    // handleDelete={()=>deleteUser(contact)}
                                                    handleUpdate={()=>editUser(contact)}
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
                    handleClick={(e:any)=>{getProduitsPaginated(15, e,"")}}
                />
        </div>}
            {addContactModal && <ProduitForm data={params} loading={loading} open={addContactModal} setOpen={()=>{setAddContactModal(false);setParams({})}} handleValidate={(e:any)=>saveUser(e)}/>}
          
        </div>
    );
};

export default Produit;
