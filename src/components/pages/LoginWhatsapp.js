import Main from "../templates/Main";
import Header from "../organisms/Header";
import LoginWhatsapp from "../organisms/LoginWhatsapp";

const LoginWhatsappPage = () => {  
  return (
    <Main header={<Header isAuthentication={false}/>} >
        <LoginWhatsapp />
    </Main>
  );
};

export default LoginWhatsappPage;
