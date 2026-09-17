# Mapa de archivos

Qué hace cada archivo del proyecto, carpeta por carpeta. Para entender cómo encajan entre sí,
leé primero [`arquitectura.md`](arquitectura.md).

> Este mapa lo controla un test (`lib/test/mapa-de-archivos.test.ts`): si agregás un archivo y no lo
> anotás acá, `npm run check` falla. Si lo borrás o lo renombrás, actualizá también su fila.

## Raíz

| Archivo    | Qué hace                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `proxy.ts` | Corre antes de cada página privada. Sin cookie de sesión, redirige al login; con la sesión vencida, la renueva. |

## `app/` — rutas

Cada carpeta con `page.tsx` es una URL. Las carpetas entre paréntesis agrupan páginas sin cambiar la URL.

| Archivo                                      | Qué hace                                                                               |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/layout.tsx`                             | HTML base de toda la app: idioma, fuente, estilos globales y título por defecto.       |
| `app/globals.css`                            | Tokens de diseño (colores, fuente) y estilos base como el foco visible.                |
| `app/page.tsx`                               | La raíz `/`: manda a cada persona a su pantalla, o al login si no inició sesión.       |
| `app/not-found.tsx`                          | Pantalla 404. También se muestra cuando alguien entra a algo sin permiso.              |
| `app/error.tsx`                              | Pantalla para errores inesperados, con botón para reintentar.                          |
| `app/terminos/page.tsx`                      | Términos y condiciones. Es pública.                                                    |
| `app/verificar-cuenta/page.tsx`              | Ingreso del código de verificación. Necesita sesión, pero no el email verificado.      |
| `app/(auth)/layout.tsx`                      | Marco de las pantallas de acceso. Si la persona ya inició sesión, la saca de acá.      |
| `app/(auth)/login/page.tsx`                  | Iniciar sesión.                                                                        |
| `app/(auth)/registro/page.tsx`               | Elegir si te registrás como trabajador o como empresa.                                 |
| `app/(auth)/registro/trabajador/page.tsx`    | Registro de trabajador. Pide la lista de países en el servidor.                        |
| `app/(auth)/registro/empresa/page.tsx`       | Registro de empresa. Pide la lista de países en el servidor.                           |
| `app/(auth)/recuperar-contrasena/page.tsx`   | Pedir el enlace para restablecer la contraseña.                                        |
| `app/(auth)/restablecer-contrasena/page.tsx` | Elegir la contraseña nueva con el token del enlace (`?token=`).                        |
| `app/(app)/layout.tsx`                       | Marco de las pantallas internas: exige sesión y email verificado, y muestra la navbar. |
| `app/(app)/loading.tsx`                      | Lo que se ve mientras una pantalla interna carga sus datos.                            |
| `app/(app)/perfil/page.tsx`                  | Perfil del trabajador o de la empresa, según el rol. El administrador ve un 404.       |
| `app/(app)/empleos/page.tsx`                 | Lista de empleos. Al trabajador le marca a cuáles ya se postuló.                       |
| `app/(app)/empleos/[id]/page.tsx`            | Detalle de un empleo, con botón para postularse si sos trabajador.                     |
| `app/(app)/postulaciones/page.tsx`           | El trabajador ve sus postulaciones; la empresa, los postulantes de cada búsqueda.      |
| `app/(app)/planes/page.tsx`                  | Pantalla de planes (todavía sin contenido).                                            |
| `app/(app)/admin/layout.tsx`                 | Exige rol administrador para todo lo que está bajo `/admin`.                           |
| `app/(app)/admin/page.tsx`                   | Panel de administración (todavía sin contenido).                                       |
| `app/api/mock/[...ruta]/route.ts`            | Entrada del backend simulado. Solo responde con `MOCK_API_HABILITADO=true`.            |
| `app/dev/ui/page.tsx`                        | Muestra de todos los componentes base. Solo existe en desarrollo.                      |
| `app/dev/ui/demos-interactivos.tsx`          | Los ejemplos de `/dev/ui` que necesitan estado (diálogo, pestañas, confirmación).      |

## `components/ui/` — piezas base

No saben nada del negocio. Antes de crear una nueva, revisá `/dev/ui`.

| Archivo                            | Qué hace                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `components/ui/button.tsx`         | Botón con variantes (primario, secundario, peligro, enlace) y estado "cargando".    |
| `components/ui/button-link.tsx`    | Un link con la misma apariencia que un botón.                                       |
| `components/ui/button-estilos.ts`  | Las clases de las variantes y tamaños de botón, compartidas por los dos anteriores. |
| `components/ui/field.tsx`          | Label + control + ayuda + error, conectados por `id` automáticamente.               |
| `components/ui/form.tsx`           | Marco común de un formulario: campos, error general y botón(es) de acción.          |
| `components/ui/control-estilos.ts` | Estilo común de `Input`, `Select` y `Textarea`.                                     |
| `components/ui/input.tsx`          | Campo de texto.                                                                     |
| `components/ui/textarea.tsx`       | Campo de texto largo.                                                               |
| `components/ui/select.tsx`         | Lista desplegable a partir de una lista de opciones.                                |
| `components/ui/checkbox.tsx`       | Casilla con su texto y, si hace falta, su error.                                    |
| `components/ui/tag-input.tsx`      | Carga de una lista de palabras (habilidades, áreas) que viaja en inputs ocultos.    |
| `components/ui/form-actions.tsx`   | Botones "Guardar" y "Cancelar" al pie de un formulario.                             |
| `components/ui/alert.tsx`          | Mensaje de error, éxito o aviso, con el rol ARIA correcto.                          |
| `components/ui/badge.tsx`          | Etiqueta chica para estados o categorías.                                           |
| `components/ui/spinner.tsx`        | Indicador de carga.                                                                 |
| `components/ui/panel.tsx`          | Sección con título: la unidad básica de las pantallas internas.                     |
| `components/ui/data-list.tsx`      | Lista de pares "etiqueta: valor". Muestra un guion si el valor está vacío.          |
| `components/ui/empty-state.tsx`    | Qué mostrar cuando una lista está vacía, con una acción opcional.                   |
| `components/ui/enlace-externo.tsx` | Link que abre en otra pestaña de forma segura. Si no hay URL, no muestra nada.      |
| `components/ui/confirm-button.tsx` | Botón para acciones destructivas: pide confirmación antes de ejecutar.              |
| `components/ui/dialog.tsx`         | Ventana modal basada en `<dialog>`: maneja el foco y se cierra con Escape.          |
| `components/ui/tabs.tsx`           | Pestañas accesibles, que se recorren con las flechas del teclado.                   |

## `components/layout/` y `components/compartidos/`

| Archivo                                       | Qué hace                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| `components/layout/navbar.tsx`                | Barra superior. En celulares el menú se abre con `<details>`, sin JavaScript. |
| `components/layout/nav-link.tsx`              | Enlace del menú que se marca cuando es la página actual.                      |
| `components/layout/pagina.tsx`                | Contenedor, título y bajada de cada pantalla interna.                         |
| `components/layout/auth-card.tsx`             | Fondo (video o imagen) y tarjeta de las pantallas de acceso.                  |
| `components/layout/auth-encabezado.tsx`       | Título y bajada de cada pantalla de acceso.                                   |
| `components/layout/auth-footer-link.tsx`      | Línea al pie de una pantalla de acceso, para pasar a la relacionada.          |
| `components/compartidos/campos-ubicacion.tsx` | Campos país, provincia y ciudad, que usan el registro y los perfiles.         |

## `features/auth/` — acceso y registro

| Archivo                                      | Qué hace                                                                          |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `features/auth/esquemas.ts`                  | Reglas de validación de login, registros, recuperación y código.                  |
| `features/auth/login-form.tsx`               | Formulario de login. Si el email no está verificado, lleva a verificar la cuenta. |
| `features/auth/registro-trabajador-form.tsx` | Registro de trabajador en tres pasos: cuenta, login y perfil.                     |
| `features/auth/registro-empresa-form.tsx`    | Registro de empresa (razón social, CUIT, rubro, ubicación).                       |
| `features/auth/campos-contrasena.tsx`        | Campos "contraseña" y "repetí la contraseña", compartidos por varios formularios. |
| `features/auth/campo-terminos.tsx`           | Casilla para aceptar los términos, con link a `/terminos`.                        |
| `features/auth/recuperar-form.tsx`           | Pedir el enlace de recuperación. Muestra el mismo mensaje exista o no el email.   |
| `features/auth/restablecer-form.tsx`         | Elegir la contraseña nueva.                                                       |
| `features/auth/verificar-cuenta-form.tsx`    | Ingresar el código de 6 números y pedir que se reenvíe.                           |
| `features/auth/boton-salir.tsx`              | Cerrar sesión. Si el backend no responde, lleva al login igual.                   |

## `features/perfil/` — perfil y cuenta

| Archivo                                            | Qué hace                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `features/perfil/esquemas.ts`                      | Reglas de validación de todos los formularios del perfil.                     |
| `features/perfil/seccion-editable.tsx`             | Patrón "ver / editar" de las secciones del perfil.                            |
| `features/perfil/lista-editable.tsx`               | Lista con agregar, editar y borrar. La usan educación, experiencia e idiomas. |
| `features/perfil/formulario-item.tsx`              | Marco de los formularios que aparecen dentro de una lista editable.           |
| `features/perfil/perfil-trabajador-seccion.tsx`    | Sección de datos del trabajador: une la vista y el formulario.                |
| `features/perfil/vista-perfil-trabajador.tsx`      | Cómo se ven los datos del trabajador cuando no se están editando.             |
| `features/perfil/formulario-perfil-trabajador.tsx` | Crea o actualiza el perfil del trabajador.                                    |
| `features/perfil/experiencia-seccion.tsx`          | Experiencia laboral (usa la lista editable).                                  |
| `features/perfil/educacion-seccion.tsx`            | Estudios (usa la lista editable).                                             |
| `features/perfil/idiomas-seccion.tsx`              | Idiomas (usa la lista editable).                                              |
| `features/perfil/habilidades-seccion.tsx`          | Habilidades, cargadas como etiquetas.                                         |
| `features/perfil/preferencias-seccion.tsx`         | Preferencias laborales: áreas, tipos de puesto y modalidad.                   |
| `features/perfil/perfil-empresa-seccion.tsx`       | Datos de la empresa, con su vista y su formulario.                            |
| `features/perfil/seguridad-cuenta.tsx`             | Panel "Cuenta y seguridad": une cambiar contraseña y eliminar cuenta.         |
| `features/perfil/cambiar-contrasena.tsx`           | Formulario para cambiar la contraseña.                                        |
| `features/perfil/eliminar-cuenta.tsx`              | Baja de la cuenta, con confirmación.                                          |

## `features/empleos/` y `features/postulaciones/`

| Archivo                                               | Qué hace                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `features/empleos/lista-empleos.tsx`                  | Grilla de tarjetas, o un aviso si no hay empleos.                         |
| `features/empleos/tarjeta-empleo.tsx`                 | Resumen de un empleo. Toda la tarjeta es clickeable a través del título.  |
| `features/empleos/detalle-empleo.tsx`                 | Descripción completa: requisitos, beneficios, habilidades y remuneración. |
| `features/empleos/boton-postularme.tsx`               | Postularse a un empleo (la única parte interactiva del detalle).          |
| `features/postulaciones/mis-postulaciones.tsx`        | Las postulaciones del trabajador con su estado.                           |
| `features/postulaciones/postulantes-por-busqueda.tsx` | Para la empresa: quién se postuló a cada una de sus búsquedas.            |
| `features/postulaciones/estado-postulacion.tsx`       | Etiqueta de color para cada estado de postulación.                        |

## `lib/` — lógica compartida

| Archivo                              | Qué hace                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `lib/config.ts`                      | Lee y valida las variables de entorno. Nombres de cookies y timeout.           |
| `lib/rutas.ts`                       | Todas las URLs de la app, y cuáles son privadas.                               |
| `lib/navegacion.ts`                  | Qué enlaces ve cada rol en la navbar.                                          |
| `lib/sesion.ts`                      | Quién inició sesión (consultando al backend) y los controles `exigir...`.      |
| `lib/etiquetas.ts`                   | Textos visibles de cada enum, y formatos de fecha y ubicación.                 |
| `lib/paises-respaldo.ts`             | Lista de países para cuando el backend no responde.                            |
| `lib/utils.ts`                       | `cn()`: combina clases de Tailwind sin conflictos.                             |
| `lib/formulario/use-formulario.ts`   | Hook de todos los formularios: leer, validar, enviar y mostrar errores.        |
| `lib/formulario/leer-formulario.ts`  | Convierte un `<form>` en un objeto (los campos `nombre[]` salen como lista).   |
| `lib/formulario/reglas.ts`           | Reglas reutilizables: email, contraseñas, CUIT, DNI, URLs, fechas, casillas.   |
| `lib/formulario/reglas-ubicacion.ts` | Reglas de país, provincia y ciudad, y de fecha de nacimiento (edad mínima 16). |
| `lib/formulario/errores.ts`          | Convierte un error del backend en el error de un campo puntual del formulario. |
| `lib/test/vacio.ts`                  | Módulo vacío que reemplaza a `server-only` en los tests.                       |

## `lib/api/` — conexión con el backend

El único lugar que hace pedidos HTTP. Cada archivo valida la respuesta y la traduce de `snake_case`.

| Archivo                          | Qué hace                                                              |
| -------------------------------- | --------------------------------------------------------------------- |
| `lib/api/cliente.ts`             | `pedir()`: cookies, timeout, renovación única de sesión y errores.    |
| `lib/api/errores.ts`             | `ApiError`, sus códigos y los mensajes que ve el usuario.             |
| `lib/api/renovacion.ts`          | Renovación de sesión desde `proxy.ts` (reenvía y devuelve cookies).   |
| `lib/api/opcional.ts`            | `nuloSiNoExiste()`: convierte un 404 en `null`.                       |
| `lib/api/recurso-lista.ts`       | Genera listar/crear/actualizar/eliminar para los recursos tipo lista. |
| `lib/api/auth.ts`                | Login, logout, registro, verificación y recuperación de contraseña.   |
| `lib/api/usuarios.ts`            | La cuenta actual: consultarla, cambiar la contraseña y eliminarla.    |
| `lib/api/paises.ts`              | Lista de países del backend.                                          |
| `lib/api/paises-con-respaldo.ts` | Lista de países, o la local si el backend falla.                      |
| `lib/api/perfil-trabajador.ts`   | Consultar, crear y actualizar el perfil del trabajador.               |
| `lib/api/perfil-empresa.ts`      | Consultar y actualizar el perfil de la empresa.                       |
| `lib/api/educacion.ts`           | Estudios del trabajador (usa `recurso-lista`).                        |
| `lib/api/experiencia.ts`         | Experiencia laboral (usa `recurso-lista`).                            |
| `lib/api/idiomas.ts`             | Idiomas (usa `recurso-lista`).                                        |
| `lib/api/preferencias.ts`        | Habilidades y preferencias laborales.                                 |
| `lib/api/empleos.ts`             | Empleos, postulaciones y postulantes.                                 |

## `types/` — modelo

| Archivo                | Qué hace                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `types/enums.ts`       | Los valores permitidos de cada enum del diccionario de datos, como listas y como tipos.      |
| `types/usuario.ts`     | La cuenta de usuario y el país.                                                              |
| `types/perfil.ts`      | Perfiles de trabajador y empresa, ubicación, educación, experiencia, idiomas y preferencias. |
| `types/empleo.ts`      | Un empleo publicado.                                                                         |
| `types/postulacion.ts` | Una postulación, vista por el trabajador y por la empresa.                                   |

## `mocks/` — backend simulado

| Archivo                  | Qué hace                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| `mocks/servidor.ts`      | Mini router: cookies, errores con el formato de FastAPI y demora simulada.     |
| `mocks/base-de-datos.ts` | Los datos en memoria (se reinician al reiniciar `npm run dev`).                |
| `mocks/semillas.ts`      | Datos iniciales: cuentas de prueba, perfiles, empleos y postulaciones.         |
| `mocks/tipos.ts`         | La forma de los datos tal como los guarda el backend (`snake_case`).           |
| `mocks/rutas-auth.ts`    | Login, registro, verificación, recuperación y `/users/me`.                     |
| `mocks/rutas-perfil.ts`  | Países, perfiles, educación, experiencia, idiomas, habilidades y preferencias. |
| `mocks/rutas-empleos.ts` | Empleos y postulaciones.                                                       |

## Tests

| Archivo                             | Qué prueba                                                               |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `lib/api/cliente.test.ts`           | Renovación única de sesión, errores de red y respuestas exitosas.        |
| `lib/api/errores.test.ts`           | Lectura de errores de FastAPI (incluido el 422) y asignación de códigos. |
| `lib/sesion.test.ts`                | Redirecciones por sesión, verificación y rol (404 sin permiso).          |
| `lib/etiquetas.test.ts`             | Opciones de enums y formatos de fecha y ubicación.                       |
| `lib/formulario/reglas.test.ts`     | CUIT, URLs y fechas.                                                     |
| `features/auth/esquemas.test.ts`    | Login, registro de empresa y código de verificación.                     |
| `features/perfil/esquemas.test.ts`  | Experiencia (trabajo actual y fechas), educación y habilidades.          |
| `lib/test/mapa-de-archivos.test.ts` | Que todos los archivos del proyecto estén anotados en este mapa.         |

## `public/` — archivos estáticos

| Archivo                          | Qué es                                                    |
| -------------------------------- | --------------------------------------------------------- |
| `public/logo.png`                | Logo (256 px).                                            |
| `public/videos/fondo-auth.mp4`   | Video de fondo de las pantallas de acceso (720p, 1,5 MB). |
| `public/imagenes/fondo-auth.jpg` | Imagen fija que reemplaza al video en celulares.          |
