import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { useNavigate, useParams } from "react-router-dom";
import {
  sendRegisterCodeWithWhatsapp,
  startCreatingUserWithEmailPassword,
  startCreatingUserWithWhatsapp,
  startListServicios,
} from "../../store";
import { useForm } from "../../hooks/useForm";
import { Alert } from "../atoms/Alert";
import phone_code from "../../assets/phone_code.json";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { paises } from "@/lib/getCountryData";
import CountryFlag from "react-country-flag";
const formValidations = {
  // email: [ (value) => value.includes('@'), 'El correo debe de tener una @' ],
  // password: [ (value) => value.length >= 6, 'El password debe de tener mas de 6 letras.' ],
  first_name: [(value) => value.length >= 1, "El nombre es obligatorio"],
  last_name: [(value) => value.length >= 1, "El nombre es obligatorio"],
};

const formData = {
  first_name: "",
  last_name: "",
  codePhone: "591",
  phone: "",
  otpCode: "",
};

export const Registro = () => {
  const { providerid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formSubmitedd, setFormSubmitedd] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { status, error } = useSelector((state) => state.auth);
  const isCheckingAuthentication = useMemo(() => status === "checking", [status]);

  useEffect(() => {
    if (formSubmitedd && error) {
      Swal.fire({
        title: "Número ya registrado",
        text: error,
        icon: "error",

        showConfirmButton: true,
        confirmButtonText: "Iniciar sesión",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none",
        },

        showCloseButton: true,
        closeButtonHtml: '<span class="text-gray-500 text-3xl font-bold leading-none">&times;</span>',
        showCancelButton: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/${providerid}/login/telefono`);
        }
      });

      setLoading(false);
      setFormSubmitedd(false);
      setTimeout(() => {
        document.getElementById("phone")?.focus(); // asegúrate que el input tenga id="phone"
      }, 0);
    }
  }, [error, formSubmitedd]);

  const {
    formState,
    first_name,
    last_name,
    codePhone,
    phone,
    otpCode,
    onInputChange,
    isFormValid,
    first_nameValid,
    last_nameValid,
  } = useForm(formData, formValidations);

  const onServicios = () => {
    navigate(`/${providerid}/`);
  };

  const onSubmitPhone = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);

    if (!isFormValid) return;

    // dispatch(sendRegisterCodeWithWhatsapp(formState, () => setOtpSent(true))).finally(() => setLoading(false));
    dispatch(
      sendRegisterCodeWithWhatsapp(formState, () => navigate(`/${providerid}/registrarse/codigo`, { state: { phone } }))
    ).finally(() => setLoading(false));
  };

  const onSubmitOTP = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);
    // Eliminamos la llamada innecesaria a startListServicios
    // dispatch(startListServicios());
    dispatch(startCreatingUserWithWhatsapp({ code: otpCode }, onServicios)).finally(() => setLoading(false));
  };
  const isProviedor = !!providerid;
  return (
    <form className="text-center" method="POST" onSubmit={otpSent ? onSubmitOTP : onSubmitPhone}>
      <div className="mb-6 sm:mb-10">
        <h1 className="text-orange-500 font-bold text-3xl sm:text-4xl">
          Bienvenido a {providerid.charAt(0).toUpperCase() + providerid.slice(1)}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Ingresa tus datos para crear tu cuenta y continuar</p>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Input
            type="text"
            label="Nombre(s)"
            name="first_name"
            value={first_name}
            onChange={onInputChange}
            error={!!first_nameValid && formSubmitedd}
            helperText={first_nameValid}
            data-cy="input-first-name"
          />
        </div>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Input
            type="text"
            label="Apellido(s)"
            name="last_name"
            data-cy="input-last-name"
            value={last_name}
            onChange={onInputChange}
            error={!!last_nameValid && formSubmitedd}
            helperText={last_nameValid}
          />
        </div>
      </div>
      {/* <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <select className={`rounded-2xl bg-white border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary ${error ? "border-red-700" : ""} `} defaultValue={codePhone} value={codePhone} name="codePhone" onChange={onInputChange}>
            {phone_code.paises.map((pais) => (
              <option key={pais.name} value={pais.dial_code}>
                {pais.name + " ( +" + pais.dial_code + ")"}
              </option>
            ))}
          </select>
        </div>
      </div> */}
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <div className="relative">
            <Select
              value={codePhone}
              onValueChange={(val) => onInputChange({ target: { name: "codePhone", value: val } })}
            >
              <SelectTrigger className="w-full px-4 py-5 sm:py-6 rounded-2xl border border-primary text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="+591" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto z-[999]">
                {paises.map((p) => {
                  const cleanName = p.name.replace(/^[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "");
                  return (
                    <SelectItem
                      key={p.iso2}
                      value={p.dial_code}
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <CountryFlag countryCode={p.iso2} svg style={{ width: "1.2rem", height: "1.2rem" }} />
                      <span className="text-gray-700 ml-auto">
                        {cleanName} ( +{p.dial_code})
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Input
            id="phone"
            type="text"
            label="Teléfono"
            name="phone"
            value={phone}
            onChange={onInputChange}
            data-cy="input-phone"
          />
        </div>
      </div>
      {otpSent && (
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <Input type="text" label="Código OTP" name="otpCode" value={otpCode} onChange={onInputChange} />
          </div>
        </div>
      )}
      <div className={`col-span-full ${!!error ? "" : "hidden"} `}>
        <Alert mensaje={error} />
      </div>

      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Button
            disabled={loading || !isProviedor}
            type="submit"
            bg="bg-primary w-[250px] sm:w-[270px] mx-auto hover:bg-white "
            tc="text-white hover:text-secondary"
            className="sm:h-[48px] !text-[14px] bordered"
            data-cy="btn-submit"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : otpSent ? (
              "Verificar"
            ) : (
              "Enviar código"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Registro;
