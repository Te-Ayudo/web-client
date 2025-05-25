import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import phone_code from "../../assets/phone_code.json";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { startLoginWithWhatsapp } from "../../store/auth";
import Main from "../templates/Main";
import Header from "./HeaderInit";
import Modal from "../molecules/Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { paises } from "@/lib/getCountryData";
import CountryFlag from "react-country-flag";
import Swal from "sweetalert2";
const PhoneInputPage = () => {
    const { providerid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formSubmitted, setFormSubmitted] = useState(false)
    // 1 · Leemos el error que el thunk deja en Redux
    const { error } = useSelector((state) => state.auth);
    const [phone, setPhone] = useState("");
    const [codePhone, setCodePhone] = useState("591");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (formSubmitted && error) {
            // Swal.fire("Error en la autenticación", error, "error");
            Swal.fire({
                  title: "Usuario no encontrado",
                  text: error,
                  icon: "error",
            
                  // ► Botón principal personalizado
                  showConfirmButton: true,
                  confirmButtonText: "Regístrate",
                  buttonsStyling: false,
                  customClass: {
                    confirmButton:
                      "bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md px-4 py-2 focus:outline-none",
                  },
            
                  // ► Botón “X” arriba a la derecha
                  showCloseButton: true,
                  closeButtonHtml: '<span class="text-gray-500 text-3xl font-bold leading-none">&times;</span>',
            
                  // Quita botones extra
                  showCancelButton: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate(`/${providerid}/registrarse`);
                  }
            });
            
            setLoading(false);
            setFormSubmitted(false);
            setPhone("");                  // ← limpia input (opcional)
            setTimeout(() => {
                document.getElementById("phone-input")?.focus(); // refocus (opcional)
            }, 0);
        }
    }, [error, formSubmitted]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormSubmitted(true);
        dispatch(startLoginWithWhatsapp({ phone, codePhone }, () =>
        navigate(`/${providerid}/login/codigo`)
        )).finally(() => setLoading(false));
    };
  return (
    <Main
      header={<Header/>}
    >
      <Modal>
        <form
            onSubmit={handleSubmit}
            className="pt-10 pb-6 flex flex-col justify-between items-center text-center"
        >
            <div className="w-full">
                <div className="mb-6 sm:mb-10">
                    <h1 className="text-orange-500 font-bold text-3xl">Bienvenido a {providerid}</h1>
                </div>
                <h2 className="text-xl font-bold text-orange-500 mb-2">
                    Ingresa tu número de teléfono
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    Recibirás un código de 6 dígitos enviado a tu WhatsApp.
                    Esto puede tardar 1 minuto
                </p>

                <div className="bg-white rounded-2xl py-4 w-full max-w-sm mx-auto">
                    <label className="text-left text-sm font-semibold text-gray-800 block mb-2">
                        Número de celular
                    </label>
                    <div className="flex gap-2">
                    {/* selector país/código */}
                    <Select defaultValue={codePhone} onValueChange={setCodePhone}>
                        <SelectTrigger className="w-24 bg-gray-100 rounded-xl px-3 py-5 [&>svg]:hidden">
                        <SelectValue placeholder="+591" />
                        </SelectTrigger>

                        <SelectContent className="max-h-60">
                        {paises.map((p) => (
                            <SelectItem
                            key={p.iso2}
                            value={p.dial_code}
                            className="flex items-center gap-2 py-2"
                            >
                            <CountryFlag
                                countryCode={p.iso2}
                                svg
                                style={{ width: "1.5rem", height: "1.5rem" }}
                            />
                            {/* <span className="text-sm">{p.name}</span> */}
                            <span className="ml-auto text-gray-500">+{p.dial_code}</span>
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>

                    {/* input teléfono */}
                    <Input
                        type="tel"
                        value={phone}
                        name="phone"
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-gray-100 rounded-xl"
                        placeholder="Ej: 76543210"
                    />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full max-w-sm py-3 mt-6 sm:mt-10"
                bg="bg-orange-500 hover:bg-orange-600"
                tc="text-white"
                disabled={loading || !phone}
            >
                {loading ? (
                    <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                    </div>
                ) : (
                    "Continuar"
                )}
            </Button>
        </form>
      </Modal>
    </Main>
    
  );
};

export default PhoneInputPage;
