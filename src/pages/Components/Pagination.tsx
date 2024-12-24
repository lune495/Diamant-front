import React, { FunctionComponent } from "react";

const Pagination:FunctionComponent<PaginationProps> = ({total,handleClick,per_page}) => {

  const [page, setPage] = React.useState<number>(1);

   const generateArray=(size:number, start:number)=> {
      return Array.from({ length: size }, (_, index) => index + start)
    }

 const getTotalPage=()=> {
      return Math.ceil(total/per_page)
    }


const handlePreviewInt=()=>{
  const newEl=page-1
  setPage(newEl)
  handleClick(newEl)
}
const handleNextInt=()=>{
  const newEl=page+1
  setPage(newEl)
  handleClick(newEl)
}

const handleChange=(e:any)=>{
  setPage(parseInt(e))
  if(page!==e){
    handleClick(e)
  }
  
}

    return (
          <div className="mb-5 mt-3">
                        <div className="flex justify-center flex-col w-full">
                            <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-4">
                                <li>
                                    <button
                                        type="button"
                                        disabled={page==1}
                                        onClick={handlePreviewInt}
                                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:rotate-180">
                                            <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </li>
                               {
                                generateArray(getTotalPage(),1).map((el:any,id:number)=>(
                                    <li key={id}>
                                        <button onClick={()=>handleChange(el)} type="button" className={`flex justify-center  font-semibold px-3.5 py-2 rounded transition hover:bg-primary dark:text-white-light dark:bg-primary ${el==page?'bg-primary text-white':"bg-white-light text-dark"}`}>
                                            {el}
                                        </button>
                                    </li>
                                ))
                               }
                              
                                <li>
                                    <button
                                        type="button"
                                        disabled={page==getTotalPage()}
                                        onClick={handleNextInt}
                                        className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:rotate-180">
                                            <path d="M11 19L17 12L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                          
                        </div>
                </div>
         )

     }

export default Pagination;

interface PaginationProps {
    per_page: number;
    total: number;
    handleClick?: any;
    
}