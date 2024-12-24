import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import logo from '/assets/images/logo_diamant_.png'

const FinanceApescol = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Finance'));
    });

    const [dateTime, setDateTime] = useState<any>({ date1: 0, date2: 0 });

    const handleDate1 = (e: any) => {
        const d = new Date(e + "T00:00:00").getTime();
        setDateTime({ ...dateTime, date1: d });
    };

    const handleDate2 = (e: any) => {
        const d = new Date(e + "T23:59:59").getTime();
        setDateTime({ ...dateTime, date2: d });
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    return (
        <div className="relative w-full h-[1000px] bg-cover bg-center bg-[url('/assets/images/medecin2.jpg')]">
            {/* Conteneur en flex positionné en haut de l'image */}
            <div className="absolute top-0 left-0 w-full flex items-center justify-start p-10">
                {/* Ajout du logo */}
                <img
                    className="w-40"
                    src={logo}
                    alt="logo"
                />

                {/* Texte stylé sur la même ligne */}
                <div className="text-white ml-4">
                    {/* <span className="text-5xl font-bold shadow-sm tracking-wide text-[#00FF00]">DIAMANT</span> */}
                    <span className="text-3xl font-light italic tracking-wider ml-4 text-black">Nous prenons soin de votre santé à chaque instant</span>
                </div>
            </div>
        </div>
    );
};

export default FinanceApescol;
