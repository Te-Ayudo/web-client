import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Main from "../templates/Main";
import Header from "../organisms/HeaderInit";

const NotFound = () => {
  const navigate = useNavigate();
  const { providerid } = useParams();
  const provider = useSelector((state) => state.proveedor.selected);

  const handleGoHome = () => {
    const providerSlug = provider?.slugUrl || providerid || "";
    navigate(`/${providerSlug}`);
  };

  return (
    <Main header={<Header />}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Número 404 */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-orange-500 mb-2">404</h1>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>

          {/* Mensaje principal */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Oops! Página no encontrada</h2>
            <p className="text-gray-600 leading-relaxed">
              La página que buscas no existe o ha sido movida. No te preocupes, te ayudamos a encontrar lo que
              necesitas.
            </p>
          </div>

          {/* Botón de acción */}
          <div className="mb-8">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Volver al Inicio
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-sm text-gray-500">
            <p>¿Necesitas ayuda? Contacta con nuestro soporte</p>
            <p className="mt-1">Error 404 - Página no encontrada</p>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-300 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-5 w-16 h-16 bg-orange-100 rounded-full opacity-30"></div>
          <div className="absolute top-1/3 right-8 w-12 h-12 bg-orange-200 rounded-full opacity-20"></div>
        </div>
      </div>
    </Main>
  );
};

export default NotFound;
