import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getData, sendData } from '../../Methodes';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import DepenseForm from '../Components/Forms/DepenseForm';
import { DEPENSE_URL } from '../../store/constants';
import SuivieForm from '../Components/Forms/SuiviForm';
import { useParams } from 'react-router-dom';

const Suivie = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState({});
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
    const { dossierId,patientId,nom_patient } = useParams();

    const [filteredItems, setFilteredItems] = useState<any>([]);

    useEffect(() => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.modePaiement.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList]);

    useEffect(() => {
       handleFiltrer()
    }, []);

    const saveUser = async(e:any) => {
     
        setLoading(true)
        let msg=e?.id?"modifié":"ajouté"

        let payload=e
        if(!e.id){
            payload={...payload,patient_id:patientId}
        }
            
        await sendData(
            "api/suivi",
            payload,
            )
        .then(async (resp:any)=> {
            console.log("resp",resp?.data)
            handleFiltrer()
            setParams({})
            showMessage(`Suivie ${msg} avec succès.`);
        })
        .catch((resp:any) => {
            
            let violations = resp?.response?.data?.message ;
            

        });
        setLoading(false)
        setAddContactModal(false);

        
    };

  const handleFiltrer= async ()=>{
      const { data } = await getData("graphql?query={suivis(dossier_id:"+dossierId+"){"+
         "id  patient{nom prenom telephone} diagnostic rdv traitement"+
      "}}");
    setFilteredItems(data?.data?.suivis)
    

  }
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
            setParams(user);
        }
        setAddContactModal(true);
    };

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        showMessage('Mode de paiement supprimé avec succès.');
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

    return (
        <div>
             {showLoader && (
                    <Loader/>
                )}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl font-bold text-center uppercase underline">{nom_patient}</h1>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                            <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                                Nouvel suivie
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
                                    <th>Diagnostic</th>
                                    <th>Traitement</th>
                                    <th>Rendez-vous</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.map((contact: any) => {
                                    return (
                                        <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                         
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div style={{flexWrap:"wrap"}}>{contact?.diagnostic}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div style={{flexWrap:"wrap"}}>{contact?.traitement}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    <div>{contact?.rdv}</div>
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

            {addContactModal && <SuivieForm data={params} loading={loading} open={addContactModal} setOpen={()=>{setAddContactModal(false);setParams({})}} handleValidate={(e:any)=>saveUser(e)}/>}
          
        </div>
    );
};

export default Suivie;
