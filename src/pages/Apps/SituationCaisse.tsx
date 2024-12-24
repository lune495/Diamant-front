import { useState,FunctionComponent, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setDisconnect, setPageTitle } from '../../store/themeConfigSlice';
import Btn from '../Components/Buttons/Btn';
import { getApiUrl, getData, sendData } from '../../Methodes';
import IconBtn from '../Components/Buttons/IconBtn';
import Loader from '../Components/Utils/Loader';
import Select from 'react-select';
import { CLOTURE_URL, MODULE_URL, SERVICE_URL } from '../../store/constants';
import ServiceList from '../Components/Details/ServiceList';
import DetailFacture from '../Components/Details/DetailFacture';
import { LockClosedIcon, MagnifyingGlassCircleIcon, PowerIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


const SituationCaisse:FunctionComponent<BtnProps> = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profil'));
    });
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [detailModal, setDetailModal] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(false);
    const [venteId, setVenteId] = useState<any>();
    const [defaultParams] = useState({
        id: null,
        libelle: '',
        color: '',
        
    });

    const [params, setParams] = useState<any>({});
    const [search, setSearch] = useState<any>('');
    const [modules, setModules] = useState<any>([]);
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


  const handleSearch=()=>{
        let docUrl = document.createElement('a');
        docUrl.href = getApiUrl()+"/vente/situation-caisse-par-date/"+params.date1+"/"+params.date2;
        docUrl.target="_blank"
        document.body.appendChild(docUrl);
        if(params.date1 && params.date2){
          docUrl.click();
        }
        
  }
 useEffect(() => {
    getStatus()
 },[])

    const getStatus=async()=>{
        const { data } = await getData(CLOTURE_URL);
        setFilteredItems((data?.data?.cloturecaisses || [])?.map((el:any)=>({label:el.date_fermeture_fr,value:el.date_fermeture})))
        setShowLoader(false)
    }




    return (
        <div className='panel'>
             
             <div className="flex items-center w-full  flex-wrap gap-4">
                <div className="flex items-center">
                    <div style={{width:300}} className="mb-0 mr-5 ">
                        <label htmlFor="name">Date 1</label>
                        <Select  placeholder="Filter par service" onChange={(e:any)=>{setParams({...params,date1:e?.value})}} options={filteredItems}  isSearchable={true}/>
                    </div>
                    <div style={{width:300}} className="mb-0 mr-5">
                        <label htmlFor="name">Date 2</label>
                        <Select  placeholder="Filter par service" onChange={(e:any)=>{setParams({...params,date2:e?.value})}} options={filteredItems}  isSearchable={true}/>
                    </div>
                    <div className="ml-3" style={{width:"10%"}}>
                        <label htmlFor="name">&nbsp;</label>
                        <MagnifyingGlassCircleIcon onClick={()=>handleSearch()} style={{cursor:"pointer"}} strokeWidth={2} className="h-9 w-9
                         hover text-info mt-1" />
                    </div>
                </div>
               
            </div>
           
        </div>
    );
};

export default SituationCaisse;
interface BtnProps {
    loadingForm?: boolean;
   
    
}
