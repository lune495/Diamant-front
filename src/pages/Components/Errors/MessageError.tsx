import { FunctionComponent } from "react"


const MessageError:FunctionComponent<BtnProps> = ({open,title,message,handleClose}) =>{
    return(
        <>
        {open && (<div id="toast-danger" className="flex items-center w-full p-1  text-gray-500 rounded-lg shadow dark:text-gray-400 bg-[#e6c191]" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 text-red">
            <svg className="w-6 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
            </svg>
            <span className="sr-only text-xl">{title}</span>
        </div>
        <div style={{color:"red"}} className="ml-3 text-xl p-2 font-normal text-red">{message}</div>
        <button style={{color:"red"}}  type="button" onClick={handleClose} className="ml-auto mr-1 -mx-1.5 -my-1.5 hover:bg-red bg-white text-gray-400 hover:text-red rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5  inline-flex items-center justify-center h-6 w-6 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
            <span className="sr-only">Fermer</span>
            <svg className="w-3 h-2 text-red" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
        </div>)}
        </>
        )
    }

    export default MessageError;

    interface BtnProps {
        open: boolean;
        handleClose: any;
        message:string;
        title:string;
        
    }