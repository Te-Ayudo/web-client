import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { useNavigate, useParams } from "react-router-dom";
import { sendCodeWithWhatsapp, startListServicios, startUserWithWhatsapp } from "../../store";
import { useForm } from "../../hooks/useForm";
import { Alert } from "../atoms/Alert";
import phone_code from "../../assets/phone_code.json";

const formValidations = {
  // email: [ (value) => value.includes('@'), 'El correo debe de tener una @' ],
  // password: [ (value) => value.length >= 6, 'El password debe de tener mas de 6 letras.' ],
  first_name: [(value) => value.length >= 1, "El nombre es obligatorio"],
  last_name: [(value) => value.length >= 1, "El nombre es obligatorio"],
  phone: [(value) => value.length >= 1, "El teléfono es obligatorio"],
};

const formData = {
  first_name: "",
  last_name: "",
  codePhone: "591",
  phone: "",
  otpCode: "",
};

export const UpdateCustomer = () => {
  const { providerid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formSubmitedd, setFormSubmitedd] = useState(false);
  const [otpUpdateSent, setOtpUpdateSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { status, error } = useSelector((state) => state.auth);
  const isCheckingAuthentication = useMemo(() => status === "checking", [status]);

  useEffect(() => {
    if (error !== null && formSubmitedd) {
      Swal.fire("Error en la authentificacion", error, "error");
    }
  }, [error]);

  const { formState, first_name, last_name, codePhone, phone, otpCode, onInputChange, isFormValid, first_nameValid, last_nameValid } = useForm(formData, formValidations);

  const onServicios = () => {
    navigate(`/${providerid}/`);
  };

  const onSubmitPhone = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);
    if (!isFormValid) return;

    dispatch(sendCodeWithWhatsapp(formState, () => setOtpUpdateSent(true))).finally(() => setLoading(false));
    // setOtpUpdateSent(true);
  };

  const onSubmitOTP = (event) => {
    event.preventDefault();
    setFormSubmitedd(true);
    setLoading(true);
    dispatch(startListServicios());
    dispatch(startUserWithWhatsapp({ code: otpCode }, onServicios)).finally(() => setLoading(false));
  };
  const isProviedor = !!providerid;
  return (
    <form className="text-center" onSubmit={otpUpdateSent ? onSubmitOTP : onSubmitPhone}>
      <h3 className="h3 text-primary">Completa tu perfil</h3>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Input type="text" label="Nombre(s)" name="first_name" value={first_name} onChange={onInputChange} error={!!first_nameValid && formSubmitedd} helperText={first_nameValid} />
        </div>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Input type="text" label="Apellido(s)" name="last_name" value={last_name} onChange={onInputChange} error={!!last_nameValid && formSubmitedd} helperText={last_nameValid} />
        </div>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <select className={`rounded-2xl bg-white border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary ${error ? "border-red-700" : ""} `} defaultValue={codePhone} value={codePhone} name="codePhone" onChange={onInputChange}>
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
          <Input type="text" label="Teléfono" name="phone" value={phone} onChange={onInputChange} />
        </div>
      </div>
      {otpUpdateSent && (
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
          <Button disabled={loading || !isProviedor} type="submit" bg="bg-primary w-[250px] sm:w-[270px] mx-auto hover:bg-white " tc="text-white hover:text-secondary" className="sm:h-[48px] !text-[14px] bordered">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : otpUpdateSent ? (
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

export default UpdateCustomer;
