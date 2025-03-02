import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import Swal from "sweetalert2";
import { FiStar } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import _fetch from "../../wrappers/_fetch"

export const Rating = () => {

   const [searchParams] = useSearchParams();
   const bookId = searchParams.get("bookId");
   
   const [book, setBook] = useState(null);
   const [providerName, setProviderName] = useState('');

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

   useEffect(() => {
      if (bookId) {
         getBookById(bookId);
      }
   }, [bookId]);

   useEffect(() => {
      if (book?.data?.provider?.name) {
         setProviderName(book.data.provider.name);
      }
   }, [book]);

   async function getBookById(bookId) {

      try {
         const route = `${process.env.REACT_APP_API_URL}/booking/${bookId}`;
         const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
         };
         const data = await _fetch(route, requestOptions).then(handleResponse);
         setBook(data);
      } catch (error) {
         console.error("Error getting the booking:", error);
      }
   }

   async function updateBook(bookId, newBook) {

      const route = process.env.REACT_APP_API_URL + `/booking/${bookId}/updateRating`;

      const requestOptions = {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(newBook),
      };
      
      return await _fetch(route, requestOptions).then(handleResponse);
   }
   
   const [formValues, setFormValues] = useState({
      rating: 3,
      comment: '',
   });

   const onInputChange = (event) => {
      setFormValues(
         prev => ({ ...prev, comment: event.target.value })
      );
   };

   const onSubmit = async (event) => {

      event.preventDefault();

      if (!formValues.comment.trim()) {
         Swal.fire({ icon: "error", title: "Oops...", text: "El comentario no puede estar vacío." });
         return;
      }

      const _booking = {
         ...book,
         feedbackInfo: {
            ...book?.feedbackInfo,
            ...formValues,
         },
      };
      
      try {
         await updateBook(bookId, _booking);
         Swal.fire({ icon: "success", title: "¡Gracias!", text: "Calificación enviada." });
      } catch (error) {
         const messageError = error === "Ya se ha enviado la calificación." ? "Ya se ha enviado la calificación." : "No se pudo enviar la calificación.";
         Swal.fire({ icon: "error", title: "Error", text: messageError });
      }
   };

   return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-primary text-xl font-semibold text-center mb-5">
            ¡El servicio de la empresa {providerName} fue realizado exitosamente!
          </h2>
    
          <form
            type="POST"
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center text-center">
              <p className="text-md font-medium text-gray-700">
                Califica el servicio:
              </p>
              <div className="flex gap-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FiStar
                    key={index}
                    size={30}
                    strokeWidth={0}
                    fill={index + 1 <= formValues.rating ? "gold" : "#D6DBDF"}
                    cursor="pointer"
                    className="transition-transform transform hover:scale-110"
                    onClick={() =>
                     setFormValues(prev => ({ ...prev, rating: index + 1 }))
                    }
                  />
                ))}
              </div>
            </div>
    
            <div className="w-full">
              <TextArea
                onChange={onInputChange}
                name="comment"
                type="text"
                label="Déjanos tu comentario"
                className="w-full"
              />
            </div>
    
            <Button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-opacity-90 transition-all"
            >
              Calificar
            </Button>
          </form>
        </div>
      </div>
    );
    
};
