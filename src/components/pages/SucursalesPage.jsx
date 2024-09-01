import {useNavigate} from 'react-router-dom';
import Button from "../atoms/Button"
import { SucursalesItem } from "../atoms/SucursalesItem"
import List from "../molecules/List"
import Footer from "../organisms/Footer"
import Header from "../organisms/Header"
import Main from "../templates/Main"
import { useDispatch, useSelector } from 'react-redux';
import { startListSucursales } from '../../store/branch';
import { useEffect, useState } from 'react';


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
      <Main header={<Header />} footer={<Footer />}>
        <List>
          <Button  className="btn-auto font-normal mb-5" disabled={true} > Sucursales </Button>
          <ul>
            { listSucursales(branches).map((item) => (
              <SucursalesItem key={item.id} {...item}  />
           ))}
          </ul>
        </List>
      </Main>
    </>
  );
}
