import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useProviderData } from "../hooks/useProviderData";

/**
 * Componente para manejar dinámicamente el título, favicon y meta tags
 * basándose en los datos del proveedor desde Redux
 */
const DynamicHead = () => {
  const { provider: providerSelected } = useProviderData();
  const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");

  // Configuración por defecto
  const defaultTitle = "Te Ayudo - Plataforma de Servicios";
  const defaultDescription = "Encuentra y reserva los mejores servicios profesionales en tu área";

  // Extraer datos del proveedor
  const businessName = providerSelected?.business_name || providerSelected?.first_name;
  const providerImage = providerSelected?.picture;
  const providerDescription = providerSelected?.description;

  // Generar título dinámico
  const pageTitle = businessName || defaultTitle;

  // Generar descripción dinámica
  const pageDescription =
    providerDescription ||
    (businessName ? `Reserva servicios profesionales con ${businessName} a través de Te Ayudo` : defaultDescription);

  // Manejar favicon dinámico
  useEffect(() => {
    if (providerImage) {
      // Crear un favicon temporal desde la imagen del proveedor
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = 32;
        canvas.height = 32;

        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, 32, 32);

        // Convertir a data URL
        const faviconDataUrl = canvas.toDataURL("image/png");
        setFaviconUrl(faviconDataUrl);

        // Actualizar el favicon en el DOM
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
          existingFavicon.href = faviconDataUrl;
        }
      };

      img.onerror = () => {
        // Si hay error cargando la imagen, usar favicon por defecto
        setFaviconUrl("/favicon.ico");
      };

      img.src = providerImage;
    } else {
      // Restaurar favicon por defecto
      setFaviconUrl("/favicon.ico");
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.href = "/favicon.ico";
      }
    }
  }, [providerImage]);

  return (
    <Helmet>
      {/* Título de la página */}
      <title>{pageTitle}</title>

      {/* Meta descripción */}
      <meta name="description" content={pageDescription} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href={faviconUrl} />
      <link rel="shortcut icon" type="image/x-icon" href={faviconUrl} />

      {/* Meta tags para redes sociales */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {providerImage && <meta property="og:image" content={providerImage} />}
      <meta property="og:type" content="website" />

      {/* Meta tags para Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {providerImage && <meta name="twitter:image" content={providerImage} />}

      {/* Meta tags adicionales */}
      <meta name="author" content={businessName || "Te Ayudo"} />
      <meta
        name="keywords"
        content={`${businessName || "servicios"}, te ayudo, reservas, profesionales, ${businessName || ""}`}
      />

      {/* Tema de color para dispositivos móviles */}
      <meta name="theme-color" content="#FF770D" />
      <meta name="msapplication-TileColor" content="#FF770D" />
    </Helmet>
  );
};

export default DynamicHead;
