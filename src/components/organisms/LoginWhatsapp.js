import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

export const LoginWhatsapp = () => {
  const { providerid } = useParams();
  const navigate = useNavigate();

  const { error, selected } = useSelector((state) => state.proveedor);
  const accesoBloqueado =
    Boolean(error?.message) || selected?.providerEnabledForWeb === false;

  const generarLinkWhatsapp = (telefono, codeCountry = '591') => {
    const numero = `${codeCountry}${telefono}`;
    const mensaje = encodeURIComponent(
      'Hola, estoy intentando acceder a su sitio web de clientes pero me aparece una restricción. ¿Podría ayudarme?'
    );
    return `https://wa.me/${numero}?text=${mensaje}`;
  };

  const goToLogin = () => {
    if (!accesoBloqueado) navigate(`/${providerid}/login/telefono`);
  };

  const goToRegister = () => {
    if (!accesoBloqueado) navigate(`/${providerid}/registrarse`);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 w-full text-center">
      <div className="mb-6">
        <h1 className="text-orange-500 font-bold text-3xl">
          Bienvenido a {selected?.first_name || 'Tu Proveedor'}
        </h1>

        {accesoBloqueado && selected?.picture && (
          <img
            src={selected.picture}
            alt="Logo del proveedor"
            className="w-30 h-28 object-contain mx-auto mt-4 rounded-md border border-gray-200 shadow"
          />
        )}
      </div>

      {accesoBloqueado ? (
        <div className="max-w-sm text-center text-black font-semibold flex flex-col items-center">
          <div className="text-gray-700 font-medium text-base mb-4">
            {error?.message ? (
              <p>
                <span className="text-orange-500">{error.message}</span>
                <br />
                Contacta con tu proveedor para activar esta funcionalidad.
              </p>
            ) : (
              <p>
                El proveedor tiene habilitado el{' '}
                <span className="text-orange-500 font-semibold">
                  plan gratuito
                </span>
                , el cual no incluye acceso web para clientes.
                <br />
                Contacta con el proveedor para actualizar su plan.
              </p>
            )}
          </div>

          {selected?.phone && (
            <Button
              onClick={() => {
                const link = generarLinkWhatsapp(
                  selected.phone,
                  selected.codeCountry || '591'
                );
                window.open(link, '_blank');
              }}
              bg="bg-orange-500 hover:bg-orange-500/90"
              tc="text-white"
              className="rounded-full px-6 w-full py-3 mt-4"
            >
              Contactar por WhatsApp
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold mt-4 text-gray-800">
            Selecciona una opción
          </p>

          <div className="mb-4 w-full max-w-sm mt-6">
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
              bg="bg-white hover:bg-orange-100"
              tc="text-orange-600"
              className="w-full rounded-full py-3 border border-orange-500"
            >
              Iniciar sesión
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginWhatsapp;
