import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { FunctionComponent } from 'react';

const TableUser:FunctionComponent<BtnProps> =  ({data,handleValidate}) => {
  
   
  

    return (
        <div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Téléphone</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((contact: any) => {
                                return (
                                    <tr style={{backgroundColor:"#e0dfdc"}} key={contact.id}>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <div>{contact?.nom}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <div>{contact?.prenom}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center w-max">
                                                <div>{contact?.telephone}</div>
                                            </div>
                                        </td>
                                      
                                        <td>
                                            <div className="flex gap-4 items-center justify-center">
                                              <PlusCircleIcon onClick={() =>handleValidate(contact)} style={{cursor:"pointer"}} strokeWidth={2} className="h-6 w-6 hover text-info "/>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableUser;

interface BtnProps {
    data: any;
    handleValidate: any;
    
}