import { useParams, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

export const LoginWhatsapp = () => {
  const { providerid } = useParams();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate(`/${providerid}/login/telefono`);
  };

  const goToRegister = () => {
    navigate(`/${providerid}/registrarse`);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 w-full text-center">
      <div className="mb-8">
        <h1 className="text-orange-500 font-bold text-3xl">Bienvenido a {providerid}</h1>
        <p className="text-lg font-semibold mt-4 text-gray-800">Selecciona una opción</p>
      </div>
      <div className="mb-4 w-full max-w-sm">
        <Button
          onClick={goToRegister}
          bg="bg-orange-500 hover:bg-orange-600"
          tc="text-white"
          className="w-full rounded-full py-3"
        >
          Registrarte
        </Button>
      </div>
      <div className="w-full max-w-sm">
        <Button
          onClick={goToLogin}
          bg="bg-white border border-orange-500 hover:bg-orange-100"
          tc="text-orange-600"
          className="w-full rounded-full py-3"
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
};

export default LoginWhatsapp;
