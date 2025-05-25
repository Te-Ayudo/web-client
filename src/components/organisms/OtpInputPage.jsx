import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../atoms/Button";
import { startLoginWithWhatsappOTP } from "../../store/auth";
import Modal from "../molecules/Modal";
import Main from "../templates/Main";
import Header from "./HeaderInit";
import Swal from "sweetalert2";
const OtpInputPage = () => {
  const { providerid } = useParams();
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { error } = useSelector((state) => state.auth);

useEffect(() => {
  if (formSubmitted && error) {
    Swal.fire("Código incorrecto", error, "error");
    // Limpia dígitos y vuelve a enfocar el primero
    setOtpCode(["", "", "", "", "", ""]);
    setLoading(false);
    setFormSubmitted(false);
    setTimeout(() => document.getElementById("otp-0")?.focus(), 0);
  }
}, [error, formSubmitted]);
  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
  
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);
  
    // Foco al siguiente input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  
    // Si todos los dígitos están llenos, enviar automáticamente
    if (newCode.every(d => d !== "") && index === 5) {
      const code = newCode.join("");
      setLoading(true);
      setFormSubmitted(true);
      dispatch(startLoginWithWhatsappOTP({ otpCode: code }, () =>
        navigate(`/${providerid}/`)
      )).finally(() => setLoading(false));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otpCode.join("");
    setLoading(true);
    setFormSubmitted(true);
    dispatch(startLoginWithWhatsappOTP({ otpCode: code }, () =>
      navigate(`/${providerid}/`)
    )).finally(() => setLoading(false));
  };

  return (
    <Main
      header={<Header/>}
    >
      <Modal>
        <form
        onSubmit={handleSubmit}
        className="px-6 pt-10 pb-6 flex flex-col justify-between items-center text-center"
        >
        <div>
            <div className="mb-6 sm:mb-10">
                <h1 className="text-orange-500 font-bold text-3xl">Bienvenido a {providerid}</h1>
            </div>
            <h2 className="text-xl font-bold text-orange-500 mb-2">
            Ingresa el código recibido en tu WhatsApp
            </h2>
            <p className="text-sm text-gray-600 mb-6">
            Recibirás un código de 6 dígitos enviado.
            Esto puede tardar 1 minuto
            </p>

            <div className="flex justify-center gap-2 bg-white p-4 rounded-2xl mb-10">
            {otpCode.map((digit, index) => (
                <input
                key={index}
                id={`otp-${index}`}
                type="tel"
                maxLength="1"
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                />
            ))}
            </div>
        </div>

        {loading && (
        <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent mx-auto" />
        </div>
        )}
        </form>
      </Modal>
    </Main>
  );
};

export default OtpInputPage;
