import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { startLoginWithWhatsapp, startLoginWithWhatsappOTP } from "../../store/auth";
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
  const [secondsLeft, setSecondsLeft] = useState(180); // 3 min
  const [canResend, setCanResend] = useState(false);
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
    if (newCode.every((d) => d !== "") && index === 5) {
      const code = newCode.join("");
      setLoading(true);
      setFormSubmitted(true);
      dispatch(startLoginWithWhatsappOTP({ otpCode: code }, () => navigate(`/${providerid}/`))).finally(() =>
        setLoading(false)
      );
    }
  };
  const storedPhone = localStorage.getItem("otpPhone");
  const storedCodePhone = localStorage.getItem("otpCodePhone");
  useEffect(() => {
    if (!secondsLeft) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);
  const resendCode = () => {
    setCanResend(false);
    setSecondsLeft(180);
    dispatch(startLoginWithWhatsapp({ phone: storedPhone, codePhone: storedCodePhone }, () => {})).finally(() =>
      setLoading(false)
    );
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Código reenviado",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#fff",
      color: "#333",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otpCode.join("");
    setLoading(true);
    setFormSubmitted(true);
    dispatch(startLoginWithWhatsappOTP({ otpCode: code }, () => navigate(`/${providerid}/`))).finally(() =>
      setLoading(false)
    );
  };

  useEffect(() => {
    const handleGlobalBackspace = (e) => {
      if (e.key === "Backspace") {
        setOtpCode((prevCode) => {
          const lastFilledIndex = [...prevCode]
            .map((digit, i) => ({ digit, i }))
            .reverse()
            .find(({ digit }) => digit !== "");

          if (!lastFilledIndex) return prevCode;

          const newCode = [...prevCode];
          newCode[lastFilledIndex.i] = "";

          setTimeout(() => {
            const prevInput = document.getElementById(`otp-${lastFilledIndex.i}`);
            if (prevInput) prevInput.focus();
          }, 0);

          return newCode;
        });
      }
    };

    window.addEventListener("keydown", handleGlobalBackspace);
    return () => window.removeEventListener("keydown", handleGlobalBackspace);
  }, []);

  return (
    <Main header={<Header />}>
      <Modal>
        <form
          onSubmit={handleSubmit}
          className="px-6 pt-10 pb-6 flex flex-col justify-between items-center text-center"
        >
          <div>
            <div className="mb-6 sm:mb-10">
              <h1 className="text-orange-500 font-bold text-3xl">Bienvenido a {providerid}</h1>
            </div>
            <h2 className="text-xl font-bold text-orange-500 mb-2">Ingresa el código recibido en tu WhatsApp</h2>
            <p className="text-sm text-gray-600 mb-6">
              Recibirás un código de 6 dígitos enviado al número {storedPhone}. Esto puede tardar 1 minuto
            </p>

            <div className="flex justify-center gap-2 bg-white p-4 rounded-2xl mb-10">
              {otpCode.map((digit, index) => (
                <input
                  data-testId={`otp-${index}`}
                  key={index}
                  id={`otp-${index}`}
                  type="tel"
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && otpCode[index] === "") {
                      if (index > 0) {
                        document.getElementById(`otp-${index - 1}`)?.focus();
                      }
                    }
                  }}
                  maxLength="1"
                  className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              ))}
            </div>
            <div className="mt-4">
              {canResend ? (
                <button onClick={resendCode} className="text-primary underline font-semibold">
                  Reenviar código
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Puedes reenviar el código en {Math.floor(secondsLeft / 60)}:
                  {(secondsLeft % 60).toString().padStart(2, "0")}
                </p>
              )}
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
