import { SucursalesItem } from "../atoms/SucursalesItem"
import List from "../molecules/List"
import Main from "../templates/Main"
import { useDispatch, useSelector } from 'react-redux';
import { startListSucursales } from '../../store/branch';
import { useEffect } from 'react';
import Header from '../organisms/HeaderInit';


export const SucursalesPage = () => {

	const proveedor = useSelector((state) => state.proveedor.selected)
  const branches = useSelector( state => state.branch.item );

  const dispatch = useDispatch();

  const listSucursales = (sucursales) => {
    return sucursales.filter((sucursal)=>(
      proveedor._id === sucursal.providerId ? sucursal : false
    ))
    
  }  
  
  useEffect(() => {
    dispatch( startListSucursales() );
  }, [])

  return (
    <>
      <Main header={<Header isSticky={true} back={true}/>} isSticky={true}>
        <List>
          {/* <Button  className="btn-auto font-normal mb-5" disabled={true} > Sucursales </Button> */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-1">Sucursales</h2>
            <p className="text-sm text-gray-600">Elija la sucursal de su preferencia para continuar con su reserva</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            { listSucursales(branches).map((item) => (
              <SucursalesItem key={item.id} {...item} />
            ))}
          </ul>
        </List>
      </Main>
    </>
  );
}
