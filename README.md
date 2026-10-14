# Suite Firma B2B · Edición Panamá 2026

Generador de firmas de correo profesionales y estudio de firma manuscrita digital.
Todo se procesa **100% en el navegador**: ningún dato, imagen o firma se envía a un servidor.

## Funciones

### Firma de correo
- **6 plantillas** (Ejecutivo, Corporativa B2B, Panamá 2026, Firma Manuscrita, Clásica, Minimalista) con miniaturas en vivo.
- **Logo de la empresa** y foto de perfil: subir desde el equipo (se optimizan automáticamente) o por URL pública.
- Contacto con **formato panameño automático (+507)**, enlace directo a **WhatsApp** y dirección enlazada a Google Maps.
- 6 redes sociales, **botón de acción** (agenda, WhatsApp, cotización…) y **avisos legales** (confidencialidad, Ley 81 de 2019 de datos personales).
- Color de marca con control de contraste y 5 tipografías seguras para correo.
- Vista previa en ventana de correo simulada: PC/móvil y tema claro/oscuro.
- **Puntaje de calidad** con recomendaciones.
- Exportación: copiar para Gmail/Apple Mail/Outlook web, copiar con RTF para Outlook escritorio, `.htm`, `.txt` y código HTML.
- Autoguardado local, exportar/importar perfil y **kit de marca** para equipos.

### Firma manuscrita
- **Dibujar** con mouse, dedo o lápiz digital (presión real en Apple Pencil, S Pen, Wacom), trazo de pluma natural, deshacer/rehacer (Ctrl+Z / Ctrl+Y) y pantalla completa.
- **Escribir** el nombre en 6 estilos caligráficos con tamaño, inclinación y color.
- **Subir foto** de una firma en papel: corrección de sombras, umbral automático (Otsu) y recorte al contenido.
- Exporta PNG transparente HD, SVG vectorial, copia la imagen al portapapeles o la añade a la firma de correo con un clic.

### Manual de uso
Guía paso a paso, instrucciones de instalación para Gmail, Outlook (web, nuevo y clásico), Apple Mail e iPhone, consejos y preguntas frecuentes.

## Desarrollo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

```bash
npm run lint
npm run build
```

## Estructura

- `app/` — layout, página, fuentes y la imagen OG.
- `components/Workspace.tsx` — estado compartido, pestañas (sincronizadas con `#hash`) y persistencia.
- `components/generator/` — paneles del generador de firmas de correo.
- `components/studio/` — lienzo, firma escrita y extractor de foto.
- `components/manual/` — manual de uso.
- `lib/templates.ts` — modelo de datos y HTML de las plantillas (tablas compatibles con clientes de correo).
- `lib/rtf.ts`, `lib/phone.ts`, `lib/images.ts`, `lib/processing.ts`, `lib/signature-drawing.ts`, `lib/profile.ts` — utilidades.
