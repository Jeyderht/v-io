# V-IO · Visuales de club

Web para vender suscripciones a un catálogo de visuales para DJs, clubs y eventos, y cotizar visuales a medida.

Hecha con **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, exportada como **sitio estático** (`out/`) para Netlify, sin funciones de servidor. Los datos (catálogo, códigos de acceso, administradores, portada) viven en **Supabase**, usando `@supabase/supabase-js` desde el navegador.

## Cómo funciona

- Cada sección tiene su URL: `/`, `/visuales`, `/planes`, `/contacto`, `/licencia`, `/terminos`, `/privacidad` y `/admin`. Ingresar, Suscripción, Cotización y la vista previa son ventanas (modales) sobre la página actual.
- El estado de la web (sesión del cliente, catálogo, filtros, formularios del admin) vive en un store pequeño (`src/lib/estado.ts`) que sobrevive al cambiar de página.
- Los clientes pagan por WhatsApp; el admin crea un código `VIO-XXXX-XXXX` en Admin → Miembros y se lo envía. En la base solo se guarda la huella SHA-256 de `"v-io:" + código`. El servidor (RPC `canjear`) activa el código en 1, 2 o 5 dispositivos según el plan.
- Los visuales premium llegan **sin** enlace de Drive a quien no es miembro (RPC `catalogo`); los miembros los reciben con `catalogo_miembro`, que valida código y dispositivo en el servidor.

## Estructura

```
/
├─ src/
│  ├─ app/                 rutas (page.tsx por sección), layout, sitemap, robots, ícono, 404
│  ├─ components/          Dock, Hero, Footer, VisualCard, PlanCard, vistas de cada página
│  │  ├─ admin/            AdminView, AdminLogin, TabVisuales, TabMiembros, TabPortada
│  │  └─ modales/          Sheet (base), PreviewModal, SuscripcionSheet, LoginSheet, CotizacionSheet
│  ├─ content/             TEXTOS EDITABLES: planes.ts, faq.ts, legales.ts, catalogo.ts
│  ├─ lib/                 supabase, auth, catalogo, miembros, portada, dispositivo, codigos, estado (store)…
│  └─ types/               tipos compartidos
├─ public/img/             fotos de portada, logos de pago e isotipo
├─ supabase/schema.sql     base de datos (se pega en Supabase → SQL Editor)
├─ netlify.toml            build de Netlify
└─ .env.example            variables necesarias
```

## Dónde editar cada cosa

| Quiero cambiar…                                    | Archivo                                  |
| -------------------------------------------------- | ---------------------------------------- |
| Precios, nombres, beneficios y dispositivos        | `src/content/planes.ts` → `PLANES`       |
| Precio "desde" de visuales a medida                | `src/content/planes.ts` → `PRECIO_A_MEDIDA` |
| Duraciones al crear un acceso                      | `src/content/planes.ts` → `DURACIONES_ACCESO` |
| Preguntas frecuentes                               | `src/content/faq.ts`                     |
| Licencia, Términos y Privacidad                    | `src/content/legales.ts`                 |
| Categorías, tipos de cotización, catálogo de ejemplo | `src/content/catalogo.ts`             |
| Portada por defecto (imágenes, encuadre, alto)     | `src/lib/portada.ts` → `PORTADA_DEFECTO` (o desde Admin → Portada) |
| Textos fijos de una página                         | el componente en `src/components/`       |
| WhatsApp, color de acento, Supabase                | variables de entorno (ver abajo)         |

- Si cambias los **dispositivos** de un plan, cambia también la función `max_disp` en `supabase/schema.sql` y vuelve a ejecutarla.
- No cambies los `id` de planes ni de categorías (`dj`, `pro`, `prod`, `vj`, `led`…): se guardan en la base.

## Correr en local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
```

Otros comandos:

```bash
npm run build      # genera el sitio estático en out/
npm run start      # sirve out/ en local
npm run check      # tipos + ESLint (sin warnings) + formato Prettier
npm run format     # formatea todo con Prettier
```

> En Windows, `next build` 16.4 guarda algunos archivos de prefetch en subcarpetas; servido en local, la navegación entre páginas funciona pero recarga la página. En Netlify (Linux) no pasa.

## Variables de entorno

| Variable                         | Valor                                                    |
| -------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase → Project Settings → API → Project URL          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase → Project Settings → API Keys → **Publishable key** (`sb_publishable_…`) |
| `NEXT_PUBLIC_WHATSAPP`           | WhatsApp con código de país, solo números (Perú = 51)    |
| `NEXT_PUBLIC_ACCENT`             | Color de acento, por ejemplo `#1CA9E5`                   |
| `NEXT_PUBLIC_SITE_URL`           | URL pública del sitio, sin barra final (sitemap, robots, Open Graph) |

Todas son públicas: se incrustan en el JavaScript del sitio. **Nunca** uses la clave `secret` ni la `service_role` de Supabase. `.env.local` está en `.gitignore`.

## Puesta en marcha (primera vez)

1. Crea un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pega todo `supabase/schema.sql` y pulsa **Run**.
3. Configura las variables de entorno (arriba) en `.env.local` y en Netlify.
4. Hazte administrador:
   - **Authentication → Users → Add user** (tu correo + contraseña).
   - En el SQL Editor ejecuta solo la última línea de `schema.sql`, con tu correo:
     ```sql
     insert into public.admins (user_id) select id from auth.users where email = 'TU_CORREO@ejemplo.com';
     ```
5. Publica en Netlify (abajo).
6. Entra a tu web → pie de página → **Admin** → tu correo y contraseña.

### SQL que hay que correr en Supabase

- **Primera vez**: todo `supabase/schema.sql` y la línea `insert into public.admins …` del paso 4.
- **Actualizaciones**: el archivo se puede volver a ejecutar completo sin borrar datos. Si la portada administrable no guarda ("¿Corriste el SQL de la portada?"), ejecútalo de nuevo: crea la tabla `ajustes`.

## Publicar en Netlify

El repositorio ya trae `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"
[build.environment]
  NODE_VERSION = "20"
```

1. Netlify → **Add new project → Import an existing project** → GitHub → repositorio `v-io`.
2. **Project configuration → Environment variables**: agrega las 5 variables de la tabla de arriba.
3. Deploy. Cada push a `main` publica la web; cada pull request genera un **Deploy Preview**.

## Uso diario

- **Admin → Visuales**: pega el enlace de un archivo de Google Drive (compartido como "Cualquier persona con el enlace"), título, categoría y si es Premium.
- **Admin → Miembros**: cuando un cliente paga, crea su código y envíalo por WhatsApp (el botón arma el mensaje). El código se muestra una sola vez. "Liberar dispositivos" si cambia de equipo; "+1 mes" renueva.
- **Admin → Portada**: imágenes de escritorio y móvil, diseño, encuadre, alto y oscurecido, con vista previa. Se publica al tocar **Guardar portada**.
