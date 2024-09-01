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
import { startListProveedores } from '../../store';
import { ProveedoresItem } from '../atoms/ProveedoresItem';

export const ProveedoresPage = () => {

  const {selected} = useSelector( state => state.booking );
  const branches = useSelector( state => state.branch.item );
	const providers = useSelector((state) => state.proveedor.item)
  const category = useSelector((state) => state.category.selected)

  const [useCategoriesFilter, setuseCategoriesFilter] = useState(null)
	const [filtered, setFiltered] = useState([])

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch( startListSucursales() );
    // dispatch( startListProveedores() );
		setFiltered(providers)
  }, [])

  useEffect(() => {
    let filtered = filteredByBranchAvailability(providers);
		setFiltered(filtered)
  }, [providers])


  const filteredByBranchAvailability = (providers) =>selected.isInBranch?
    providers.filter((provider) => {
      return branches.filter(branch => branch.providerId === provider._id).length > 0
    })
    : providers


  const onLogin = (  ) => {
    navigate('/login');
  }

  return (
    <>
      <Main header={<Header />} footer={<Footer />}>
        <List>
          <Button  className="btn-auto font-normal mb-5" disabled={true} > Sucursales </Button>
          <ul>
            { filtered.map((item) => (
              <ProveedoresItem key={item.id} {...item}  />
           ))}
          </ul>
        </List>
      </Main>
    </>
  );
}
