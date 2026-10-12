# V-IO · Visuales de club

Web estática (sin build, sin npm) para vender suscripciones a un catálogo de visuales para DJs, clubs y eventos, y cotizar visuales a medida. Se publica en Netlify subiendo la carpeta tal cual. Los datos (catálogo, códigos de acceso, administradores) viven en Supabase.

## Cómo funciona

- **index.html** contiene la plantilla de toda la web (`<template id="tpl">`) con huecos `{{nombre}}`, bloques condicionales `<sc-if value="{{x}}">` y listas `<sc-for list="{{lista}}" as="item">`.
- **js/runtime.js** es un mini motor propio: lee esa plantilla y la dibuja dentro de `<div id="app">`, actualizando el DOM cada vez que cambia el estado.
- **js/component.js** (`class Component`) define el estado de la página y el método `renderVals()`, que devuelve el valor de cada `{{hueco}}`.
- **js/app.js** (`class App extends Component`) añade la conexión con Supabase por REST: login de admin, catálogo, canje de códigos, miembros y páginas legales.
- **js/main.js** monta la app.

Los clientes pagan por WhatsApp; el admin crea un código `VIO-XXXX-XXXX` en el panel y se lo envía. En la base solo se guarda la huella (SHA-256) del código. Cada código se activa en 1, 2 o 5 dispositivos según el plan.

## Estructura

```
/
├─ index.html          plantilla de la web + carga de scripts
├─ config.js           TUS DATOS: Supabase, WhatsApp y color de acento
├─ css/
│  └─ styles.css       animaciones, media queries y estados (:hover, :focus)
├─ js/
│  ├─ runtime.js       motor de plantillas (no hace falta tocarlo)
│  ├─ component.js     interfaz: textos, planes, precios, FAQ, catálogo
│  ├─ app.js           Supabase, admin, miembros y textos legales
│  └─ main.js          arranque
├─ img/                fotos de la portada (hero-1.jpg, hero-2.jpg)
└─ supabase/
   └─ schema.sql       base de datos (se pega una vez en Supabase)
```

Los scripts se cargan en este orden y sin `type="module"`, porque comparten clases y constantes como globales: `config.js` → `runtime.js` → `component.js` → `app.js` → `main.js`.

## Dónde editar cada cosa

| Quiero cambiar…                              | Archivo                    | Dónde                                    |
| -------------------------------------------- | -------------------------- | ---------------------------------------- |
| WhatsApp, Supabase, color de acento          | `config.js`                | todo el archivo                          |
| Precios, nombres y beneficios de los planes  | `js/component.js`          | `PLANES` (arriba del archivo)            |
| Precio "desde" de visuales a medida          | `js/component.js`          | `PRECIO_A_MEDIDA`                        |
| Preguntas frecuentes                         | `js/component.js`          | `FAQ`                                    |
| Categorías / filtros del catálogo            | `js/component.js`          | `CATEGORIAS`                             |
| Tipos de visual del formulario de cotización | `js/component.js`          | `TIPOS_COTIZACION`                       |
| Duraciones al crear un acceso                | `js/component.js`          | `DURACIONES_ACCESO`                      |
| Catálogo de ejemplo (sin Supabase)           | `js/component.js`          | `VISUALES_DEMO`                          |
| Licencia, Términos y Privacidad              | `js/app.js`                | `textosLegales()` y `LEGAL_FECHA`        |
| Textos fijos de la página (títulos, botones) | `index.html`               | dentro de `<template id="tpl">`, buscando el texto |
| Animaciones y diseño de escritorio/móvil     | `css/styles.css`           |                                          |
| Fotos de la portada                          | `img/`                     | reemplaza `hero-1.jpg` / `hero-2.jpg` con el mismo nombre |

Notas:

- **Dispositivos por plan**: si cambias `dispositivos` en `PLANES`, cambia también la función `max_disp` en `supabase/schema.sql` y vuelve a ejecutarla en Supabase. Si no, la web y la base no coincidirán.
- **No cambies los `id`** de planes ni de categorías (`dj`, `pro`, `prod`, `vj`, `led`…): se guardan en la base de datos.
- En la plantilla, **no renombres** un `{{hueco}}` sin renombrarlo también en `renderVals()` (`js/component.js` o `js/app.js`).
- Casi todo el diseño son `style="..."` en línea dentro de la plantilla; muchos dependen de huecos `{{...}}`, por eso no se pasaron a clases.

## Puesta en marcha

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega todo `supabase/schema.sql` y pulsa **Run**.
3. En **Project Settings → API**, copia "Project URL" y la clave "anon public" en `config.js` (y tu WhatsApp con código de país, solo números).
4. Hazte administrador:
   - **Authentication → Users → Add user** (tu correo + contraseña).
   - En el SQL Editor ejecuta solo la última línea de `schema.sql`, con tu correo:
     ```sql
     insert into public.admins (user_id) select id from auth.users where email = 'TU_CORREO@ejemplo.com';
     ```
5. Publica la carpeta (ver abajo).
6. Entra a tu web → pie de página → **Admin** → tu correo y contraseña.

### SQL que hay que correr en Supabase

- **Primera vez**: todo `supabase/schema.sql` y después la línea `insert into public.admins …` del paso 4.
- **Actualizaciones**: el archivo se puede volver a ejecutar completo sin borrar datos (usa `create … if not exists`, `create or replace` y `drop policy if exists`).

## Publicar en Netlify

- **Rápido**: entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta completa (o un .zip de ella).
- **Actualizar** un sitio que ya existe: en Netlify → tu sitio → **Deploys** → arrastra de nuevo la carpeta.

No hay comando de build ni carpeta de salida: se publica la raíz del proyecto. La carpeta `supabase/` y este README pueden subirse sin problema (no afectan a la web).

## Probar en tu computadora

Abre la carpeta con un servidor local, por ejemplo la extensión **Live Server** de VS Code, o:

```
npx serve .
```

Abrir `index.html` con doble clic también carga la página, pero algunas funciones del navegador (portapapeles, cifrado de códigos) solo van completas en `http://localhost` o `https://`.

## Uso diario

- **Admin → Visuales**: pega el enlace de un archivo de Google Drive (compartido como "Cualquier persona con el enlace"), título, categoría y si es Premium. Los visuales premium se envían sin enlace a quien no es miembro.
- **Admin → Miembros**: cuando un cliente paga, crea su código y envíalo por WhatsApp (el botón arma el mensaje). El código se muestra una sola vez. Si el cliente cambia de equipo, usa "Liberar dispositivos"; "+1 mes" renueva.
