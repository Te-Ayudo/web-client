import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { startLoginGoogle, startLoginWithWhatsapp, startLoginWithWhatsappOTP } from "../../store/auth";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { startListServicios } from "../../store";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import SVGComponent from "../atoms/Gmail";
import phone_code from "../../assets/phone_code.json";

const formData = {
  phone: "",
  codePhone: "591",
  otpCode: "",
};

export const LoginWhatsapp = () => {
  const { providerid } = useParams();
  const [formSubmitedd, setFormSubmitedd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { error } = useSelector((state) => state.auth);
  const { selected } = useSelector((state) => state.booking);
  const myprov = useSelector((state) => state.proveedor.selected);
  const [userg, setUserg] = useState([]);

  useEffect(() => {
    if (userg) {
      axios
        .get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${userg.access_token}`, {
          headers: {
            Authorization: `Bearer ${userg.access_token}`,
            Accept: "application/json",
          },
        })
        .then((res) => {
          dispatch(startLoginGoogle(res.data, onInicio));
        })
        .catch((err) => console.log(err));
    }
  }, [userg]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUserg(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const { phone, codePhone, otpCode, onInputChange, formState } = useForm(formData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error !== null && formSubmitedd) {
      Swal.fire("Error en la autenticación", error, "error");
      setLoading(false);
    }
  }, [error]);

  const onInicio = () => {
    navigate(`/${providerid}/`);
  };

  const onSubmitPhone = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);

    dispatch(startListServicios());
    dispatch(startLoginWithWhatsapp({ phone, codePhone }, () => setOtpSent(true))).finally(() => setLoading(false));
  };

  const onSubmitOTP = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);
    dispatch(startListServicios());
    dispatch(startLoginWithWhatsappOTP({ otpCode }, onInicio)).finally(() => setLoading(false));
  };

  const isProviedor = !!providerid;

  return (
    <>
      {myprov === undefined ? (
        "Error en el proveedor"
      ) : (
        <div>
          <form className="text-center" method="POST" onSubmit={otpSent ? onSubmitOTP : onSubmitPhone}>
            <Logo className="h-8 sm:h-14 mb-6 sm:mb-14 " />
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <select translate='no' className={`rounded-2xl bg-white border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary ${error ? "border-red-700" : ""} `} defaultValue={codePhone} value={codePhone} name="codePhone" onChange={onInputChange}>
                  {phone_code.paises.map((pais) => (
                    <option key={pais.name} value={pais.dial_code}>
                      {pais.name + " ( +" + pais.dial_code + ")"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Input type="tel" label="Número de teléfono" name="phone" value={phone} onChange={onInputChange} />
              </div>
            </div>
            {otpSent && (
              <div className="col-span-full">
                <div className="mb-3 sm:mb-6">
                  <Input type="text" label="Código OTP" name="otpCode" value={otpCode} onChange={onInputChange} />
                </div>
              </div>
            )}
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Button disabled={loading || !isProviedor} type="submit" bg="bg-primary w-[250px] sm:w-[270px] mx-auto hover:bg-white " tc="text-white hover:text-secondary" className="sm:h-[48px] !text-[12px] bordered">
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : otpSent ? (
                    <span translate="no">Verificar</span>
                  ) : (
                    <span translate="no">Enviar código</span>
                  )}
                </Button>
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Button href={`/${providerid}/login`} bg="btn-transparent w-[250px] sm:w-[270px] mx-auto" tc="text-secondary hover:text-white " className="sm:h-[48px] !text-[12px] bordered">
                  Iniciar sesión con correo
                </Button>
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Button href={`/${providerid}/registrarse`} bg="btn-transparent w-[250px] sm:w-[270px] mx-auto" tc="text-secondary hover:text-white " className="sm:h-[48px] !text-[12px] bordered">
                  Registrarse
                </Button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Button disabled={!isProviedor} onClick={() => login()} bg="btn-transparent w-[250px] sm:w-[270px] mx-auto" tc="text-secondary hover:text-white " className="sm:h-[48px] !text-[12px] bordered whitespace-nowrap">
                  <div className="flex items-center justify-center w-full">
                    <span className="flex items-center justify-center mr-2">
                      <SVGComponent width={"18px"} height={"18px"} fill={"#9c9a9a"} />
                    </span>
                    <span className="text-center">Iniciar sesión con Google</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginWhatsapp;
