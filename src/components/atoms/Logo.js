import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Logo = ({className}) => {

  const navigate = useNavigate();

  const onClick = () => {
    console.log('cabecera');
    const currentSlug = window.location.pathname.split('/')[1];
    navigate(`/${currentSlug}`);

  }

  return(
  <a onClick={onClick}  className='flex justify-center cursor-pointer'>
    <img src={logo} className={className} alt="Te Ayudo" />
  </a>
  )
}

export default Logo
