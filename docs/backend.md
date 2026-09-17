# Cómo se habla con el backend

El backend es FastAPI y lo mantiene otro equipo. Este documento junta lo que el frontend necesita saber
para conectarse, y lo que costó descubrir en la versión anterior.

## Backend real y backend simulado

El frontend **siempre** hace pedidos HTTP de verdad. Lo único que cambia es a dónde apuntan:

| Variable              | Backend simulado (desarrollo)    | Backend real    |
| --------------------- | -------------------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api/mock` | URL del FastAPI |
| `MOCK_API_HABILITADO` | `true`                           | `false`         |

Los valores del simulado están en `.env.development`. Para usar el real, creá `.env.development.local`
(no se sube al repo) con los valores del real: pisa lo del otro archivo.

El simulado (`app/api/mock/[...ruta]/route.ts` + `mocks/`) imita al real: mismas rutas, cookies HttpOnly,
formato de errores y una demora de 250 ms. Los datos viven en memoria y se reinician al reiniciar `npm run dev`.

### Cuentas de prueba

Contraseña de todas: `demo1234`. Código de verificación: `123456`. Token de restablecer contraseña: `token-demo`.

| Email                    | Rol           | Nota                          |
| ------------------------ | ------------- | ----------------------------- |
| `trabajador@ejemplo.com` | Trabajador    | Perfil completo               |
| `ana@ejemplo.com`        | Trabajador    |                               |
| `nuevo@ejemplo.com`      | Trabajador    | Email sin verificar           |
| `empresa@ejemplo.com`    | Empresa       | Tiene búsquedas y postulantes |
| `estudio@ejemplo.com`    | Empresa       |                               |
| `admin@ejemplo.com`      | Administrador |                               |

## Endpoints que usa el frontend

Todos se llaman desde `lib/api/`. Los marcados con ⚠ **no están confirmados** por el equipo de backend:
los definió el frontend para poder avanzar y hay que validarlos antes de conectar.

| Método         | Ruta                                       | Archivo                       | Estado |
| -------------- | ------------------------------------------ | ----------------------------- | ------ |
| POST           | `/login` (form-urlencoded)                 | `auth.ts`                     | ✓      |
| POST           | `/logout`                                  | `auth.ts`                     | ✓      |
| POST           | `/refresh`                                 | `cliente.ts`, `renovacion.ts` | ✓      |
| POST           | `/register`                                | `auth.ts`                     | ✓      |
| POST           | `/verify-email`                            | `auth.ts`                     | ✓      |
| POST           | `/resend-verification`                     | `auth.ts`                     | ✓      |
| POST           | `/forgot-password`                         | `auth.ts`                     | ✓      |
| POST           | `/reset-password`                          | `auth.ts`                     | ✓      |
| GET/PUT/DELETE | `/users/me`                                | `usuarios.ts`                 | ✓      |
| GET            | `/paises`                                  | `paises.ts`                   | ✓      |
| POST           | `/perfiles-trabajador/`                    | `perfil-trabajador.ts`        | ✓      |
| GET/PUT        | `/perfiles-trabajador/me`                  | `perfil-trabajador.ts`        | ✓      |
| GET/PUT        | `/perfiles-empresa/me`                     | `perfil-empresa.ts`           | ✓      |
| CRUD           | `/educaciones`                             | `educacion.ts`                | ✓      |
| CRUD           | `/experiencias-laborales`                  | `experiencia.ts`              | ✓      |
| CRUD           | `/idiomas`                                 | `idiomas.ts`                  | ⚠      |
| GET/PUT        | `/habilidades/me`                          | `preferencias.ts`             | ⚠      |
| GET/PUT        | `/preferencias-laborales/me`               | `preferencias.ts`             | ⚠      |
| GET            | `/puestos`, `/puestos/{id}`, `/puestos/me` | `empleos.ts`                  | ⚠      |
| GET            | `/puestos/{id}/postulaciones`              | `empleos.ts`                  | ⚠      |
| POST           | `/postulaciones`                           | `empleos.ts`                  | ⚠      |
| GET            | `/postulaciones/me`                        | `empleos.ts`                  | ⚠      |

Los CRUD de lista (`recurso-lista.ts`) usan: `GET <ruta>/me`, `POST <ruta>`, `PUT <ruta>/{id}`, `DELETE <ruta>/{id}`.

## Comportamientos que hay que respetar

- **El login no manda JSON.** FastAPI usa `OAuth2PasswordRequestForm`: el pedido es `application/x-www-form-urlencoded` y el email viaja en el campo `username`.
- **Los errores 422 traen una lista.** `detail` puede ser un texto o una lista de `{ loc, msg, type }`. `extraerDetalle()` lo convierte siempre en texto.
- **Códigos de error.** Si la respuesta trae `code` (por ejemplo `"EMAIL_REGISTRADO"`), se usa ese código. Si no, se deduce del estado HTTP (401 → `NO_AUTENTICADO`, 404 → `NO_ENCONTRADO`…). Hay que pedirle al backend que mande `code`: sin él, casos como "email ya registrado" no se pueden distinguir de otros errores 400.
- **Sesión en cookies HttpOnly** (`laburar_token` y `laburar_refresh`, en `lib/config.ts`). El frontend nunca ve los tokens. Todos los pedidos van con `credentials: "include"`.
- **Renovación única.** Si varios pedidos reciben 401 a la vez, todos esperan la misma llamada a `/refresh`. En el servidor la renovación la hace `proxy.ts`, porque las páginas no pueden escribir cookies.
- **Recuperar contraseña** responde igual exista o no el email. La pantalla muestra siempre el mismo mensaje.
- **Registro de trabajador en tres pasos:** `/register` → `/login` → `POST /perfiles-trabajador/`. Si falla el tercero, la cuenta ya existe: el usuario completa el perfil desde `/perfil`.
- **Timeout:** 15 segundos (`TIEMPO_MAXIMO_PEDIDO_MS`). Pasado ese tiempo, el error es `TIEMPO_AGOTADO`.
- **Snake_case solo en `lib/api/`.** Cada módulo traduce el formato del backend a los tipos de `types/` y valida con Zod. Si el backend cambia un campo, el error aparece en un solo lugar.
- **Cada módulo tiene las dos direcciones juntas y arriba de todo:** `esquema...` (leer: lo que manda el backend) y `...HaciaApi()` (escribir: lo que espera el backend). Las funciones exportadas que están más abajo solo llaman al endpoint. Cuando backend renombra un campo, se cambia ahí y en `mocks/`: son los dos únicos lugares donde aparece el nombre en `snake_case`. **Ojo: el nombre está en las dos direcciones**, así que si el campo se lee y se escribe, hay que tocar las dos.

## Checklist para conectar un módulo al backend real

1. Confirmar la ruta y el formato con el equipo de backend (ver `/docs` de FastAPI).
2. Ajustar el esquema de Zod y la función `...HaciaApi` en `lib/api/<modulo>.ts`.
3. Ajustar la ruta simulada en `mocks/` para que siga imitando al real.
4. Probar con `MOCK_API_HABILITADO=false`.
5. Marcar el endpoint como ✓ en la tabla de arriba.

## Preguntas abiertas para el equipo de backend

1. ¿Frontend y backend van a compartir dominio en producción? Es necesario para que el servidor de Next reciba las cookies. En desarrollo funciona porque `localhost` comparte cookies entre puertos.
2. ¿Los nombres de las cookies son `laburar_token` y `laburar_refresh`?
3. Valores exactos de los enums: `tipo_usuario`, `estado_cuenta`, `nivel_educativo`, `estado_educativo`, modalidad, estado de postulación.
4. ¿`usuario_id` es UUID o número? (El frontend lo trata como texto.)
5. ¿Existe verificación por link además del código de 6 dígitos?
6. ¿Pueden agregar un campo `code` a las respuestas de error?
7. Rutas definitivas de los endpoints marcados con ⚠, y cómo se suben el CV y el logo (hoy son URLs).
8. ¿El perfil se puede desactivar, o solo existe la baja de la cuenta?
9. ¿Hay forma de traer los postulantes de todas las búsquedas de una empresa en un solo pedido?
   Hoy `/postulaciones` pide `/puestos/me` y después un `/puestos/{id}/postulaciones` por cada empleo
   (ver `app/(app)/postulaciones/page.tsx`). Con el simulado no se nota; contra el backend real, una
   empresa con muchas búsquedas son muchos pedidos.
