import Button from "../atoms/Button";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import thumbsUpAnimation from "../../assets/Animation - 1747864160019.json";
import _fetch from "@/wrappers/_fetch";
import { useEffect, useState } from "react";
import moment from "moment-timezone"; // Asegúrate de importar moment-timezone

export const Thanks = () => {
  const { providerid, bookingId } = useParams();
  const [book, setBook] = useState(null);

  console.log("Booking ID:", book);

  const navigate = useNavigate();

  const onInicio = () => {
    if (providerid) {
      navigate(`/${providerid}`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    if (bookingId) {
      getBookById(bookingId);
    }
  }, [bookingId]);

  function handleResponse(response) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        const error = (data && data.error) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  }

  async function getBookById(bookId) {
    try {
      const route = `${process.env.REACT_APP_API_URL}/booking/${bookId}`;
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const data = await _fetch(route, requestOptions).then(handleResponse);
      setBook(data.data);
      console.log("Booking data fetched:", data.data);
    } catch (error) {
      console.error("Error getting the booking:", error);
    }
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  // Ajustar las fechas a la zona horaria de Bolivia (UTC-4)
  const startDate = moment(book.bookingDate).tz("America/La_Paz", true); // Ajusta la fecha a Bolivia
  const endDate = moment(book.endDate).tz("America/La_Paz", true); // Ajusta la fecha a Bolivia
  const title = `Reservación en ${book.provider.name}`;

  // Descripción dinámica, solo incluye lo que existe
  const descriptionParts = [];
  descriptionParts.push(`📝 Servicios: ${book.serviceCart[0]?.service?.name || "No disponible"}`);
  descriptionParts.push(`👤 Colaborador: ${book.employee?.fullName || "No asignado"}`);
  descriptionParts.push(`🏢 Sucursal: ${book.branch?.name || "A domicilio"}`);

  const description = descriptionParts.filter(Boolean).join("\n");

  // Ubicación: Si no hay coordenadas, no se muestra
  const location = book.branch?.addressInfo?.coordinates
    ? `${book.branch.addressInfo.coordinates.latitude},${book.branch.addressInfo.coordinates.longitude}`
    : "No disponible";

  // Google Calendar URL
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&dates=${startDate.format("YYYYMMDDTHHmmss")}/${endDate.format("YYYYMMDDTHHmmss")}`;

  // Crear archivo .ics para Apple Calendar
  const generateAppleCalendarICS = () => {
    const icsFile = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${startDate.format("YYYYMMDDTHHmmss")}
DTEND:${endDate.format("YYYYMMDDTHHmmss")}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Recordatorio de tu cita
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsFile], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "evento_cita.ics";
    link.click();
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === "google_calendar") {
      window.location.href = googleCalendarUrl;
    } else if (value === "apple_calendar") {
      generateAppleCalendarICS();
    }
  };

  return (
    <>
      <div className="bg-white text-primary w-full relative z-50 flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center justify-center w-full p-5">
          <p className="text-4xl font-semibold text-center mb-5">¡Tu servicio ha sido procesado con éxito!</p>
          <div className="flex items-center justify-center w-full content-center mb-5">
            <Lottie animationData={thumbsUpAnimation} loop={true} autoplay={true} style={{ width: 300, height: 300 }} />
          </div>
          <div className="p-4 flex items-center justify-center bg-white text-primary w-full">
            <div className="relative group w-64 sm:w-80 md:w-96">
              {/* Botón principal */}
              <Button
                bg="white"
                tc="orange"
                className="w-full relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] border-0 text-base"
                onClick={() => window.open("http://onelink.to/teayudo", "_blank")}
              >
                <span className="flex items-center justify-center gap-2 font-medium">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Descargar nuestra App
                </span>
              </Button>

              {/* Animación sutil de borde */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

              {/* Efecto de brillo sutil */}
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 opacity-0 group-hover:opacity-15 blur-sm transition-opacity duration-400"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center bg-white text-primary w-full">
            <select
              onChange={handleSelectChange}
              className="w-64 sm:w-80 md:w-96 px-4 py-3 bg-white text-primary text-base border-orange-500 border-2 rounded-lg shadow-md hover:bg-orange-50 hover:border-orange-600 transition-all duration-200"
            >
              <option value="" disabled selected className="text-base bg-white text-primary">
                Agregar a mi calendario
              </option>
              <option value="google_calendar" className="text-base bg-white text-primary">
                Google Calendar
              </option>
              <option value="apple_calendar" className="text-base bg-white text-primary">
                Apple Calendar
              </option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-center bg-white text-primary w-full">
            <Button
              bg="white"
              tc="orange"
              className="w-64 sm:w-80 md:w-96 border-orange-500 border-2 py-3 px-6 rounded-lg shadow-md hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-base"
              onClick={onInicio}
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
