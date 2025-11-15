export const loadGoogleMaps = (() => {
  let promise: Promise<void> | null = null;

  return () => {
    if (window.google && window.google.maps) {
      return Promise.resolve();
    }

    if (promise) {
      return promise;
    }

    // Carga
    promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&language=es`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Error al cargar Google Maps"));
      document.head.appendChild(script);
    });

    return promise;
  };
})();
