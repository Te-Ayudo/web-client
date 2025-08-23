import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "../atoms/Button";
import Main from "../templates/Main";
import Header from "./HeaderInit";
import Modal from "../molecules/Modal";
import { startCreatingUserWithWhatsapp, startListServicios, startLoginWithWhatsapp } from "../../store";

const OtpRegisterPage = () => {
  const { providerid } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((s) => s.auth);

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180); // 3 min

  useEffect(() => {
    if (formSubmitted && error) {
      Swal.fire("Código incorrecto", error, "error");
      setOtpCode(["", "", "", "", "", ""]);
      setLoading(false);
      setFormSubmitted(false);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 0);
    }
  }, [error, formSubmitted]);

  /* ------ helpers ---------- */
  const verificarOTP = (code) => {
    setLoading(true);
    setFormSubmitted(true);
    // Eliminamos la llamada innecesaria a startListServicios
    // dispatch(startListServicios()); // si aún lo necesitas
    dispatch(startCreatingUserWithWhatsapp({ code }, () => navigate(`/${providerid}/`))).finally(() =>
      setLoading(false)
    );
  };

  const handleInputChange = (i, v) => {
    if (v.length > 1) return;
    const next = [...otpCode];
    next[i] = v;
    setOtpCode(next);
    if (v && i < 5) document.getElementById(`otp-${i + 1}`).focus();
    if (next.every((d) => d !== "") && i === 5) verificarOTP(next.join(""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verificarOTP(otpCode.join(""));
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
        <form onSubmit={handleSubmit} className="px-6 pt-10 pb-6 flex flex-col items-center text-center">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-orange-500 font-bold text-3xl">Bienvenido a {providerid}</h1>
          </div>

          <h2 className="text-xl font-bold text-orange-500 mb-2">Ingresa el código enviado a tu WhatsApp</h2>
          <p className="text-sm text-gray-600 mb-6">Código de 6 dígitos. Puede tardar hasta 1&nbsp;minuto.</p>

          <div className="flex justify-center gap-2 bg-white p-4 rounded-2xl mb-10">
            {otpCode.map((d, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="tel"
                maxLength="1"
                className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg font-semibold"
                value={d}
                onChange={(e) => handleInputChange(i, e.target.value)}
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
          {loading && (
            <div className="animate-spin mt-2 rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent" />
          )}
        </form>
      </Modal>
    </Main>
  );
};

export default OtpRegisterPage;
