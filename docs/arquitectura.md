# Arquitectura del frontend

Este documento explica cómo está organizado el proyecto y qué reglas lo mantienen ordenado.
Si vas a agregar algo, leé primero la sección **"¿Dónde va esto?"**.
Para saber qué hace cada archivo, está [`mapa-de-archivos.md`](mapa-de-archivos.md).

## Las capas

El proyecto se divide en capas. Cada capa tiene un solo trabajo y **solo puede importar de las capas de abajo**.
ESLint hace cumplir estas reglas (`eslint.config.mjs`): si rompés una, `npm run lint` falla.

| Capa             | Carpeta                                                           | Qué hace                                                                    | Puede importar de               |
| ---------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------- |
| Rutas            | `app/`                                                            | URLs, layouts, quién puede entrar. Pide los datos iniciales en el servidor. | todo, menos `mocks/`            |
| Features         | `features/<modulo>/`                                              | Las piezas de cada módulo: formularios, listas, tarjetas.                   | `components`, `lib`, `types`    |
| Componentes      | `components/ui/`, `components/layout/`, `components/compartidos/` | Piezas reutilizables sin lógica de negocio.                                 | `lib` (sin `lib/api`), `types`* |
| Lógica y datos   | `lib/`                                                            | Hablar con el backend, sesión, validación, configuración.                   | `types`                         |
| Modelo           | `types/`                                                          | Tipos del dominio, sacados del diccionario de datos.                        | nada                            |
| Backend simulado | `mocks/` (+ `app/api/mock/`)                                      | Un backend falso para desarrollar sin depender del real.                    | `types`                         |

\* `components/ui` no puede importar `types`: un botón no sabe qué es un empleo.

Dos reglas extra:

- **Una feature nunca importa otra feature.** Si dos features necesitan lo mismo, eso se muda a `components/` o a `lib/`.
- **Solo `lib/api/` usa `fetch`.** El resto llama a funciones de `lib/api/`.

## Recorrido de una pantalla

Tomemos `/empleos`:

1. `proxy.ts` ve que la ruta es privada. Si no hay cookie de sesión, redirige a `/login` sin renderizar nada.
2. `app/(app)/layout.tsx` llama a `exigirUsuarioVerificado()` (`lib/sesion.ts`), que le pregunta al backend quién es el usuario. Sin sesión → login. Sin verificar → `/verificar-cuenta`.
3. Mientras la página pide datos, Next muestra `app/(app)/loading.tsx`.
4. `app/(app)/empleos/page.tsx` llama a `listarEmpleos()` (`lib/api/empleos.ts`).
5. `listarEmpleos()` usa `pedir()` (`lib/api/cliente.ts`), valida la respuesta con Zod y la convierte de `snake_case` a los tipos de `types/empleo.ts`.
6. La página le pasa los empleos a `<ListaEmpleos>` (`features/empleos`), que arma las tarjetas.
7. Si algo falla y nadie lo maneja, Next muestra `app/error.tsx`.

## Leer y escribir datos

**Leer:** siempre en el servidor, dentro de `page.tsx`. Las features reciben los datos por props.
No hay que manejar "cargando" ni "error" a mano: de eso se encargan `loading.tsx` y `error.tsx`.

**Escribir:** un componente cliente (un formulario) llama a `lib/api` y, si sale bien, ejecuta
`router.refresh()`. Next vuelve a pedir los datos en el servidor y la pantalla se actualiza.

## Formularios

Todos siguen el mismo patrón, con `useFormulario` (`lib/formulario/use-formulario.ts`):

```tsx
const { onSubmit, errores, errorGeneral, enviando } = useFormulario(esquema, async (datos) => {
  await guardarAlgo(datos);
  router.refresh();
});

<form onSubmit={onSubmit} noValidate>
  <Field label="Email" error={errores.email}>
    {(control) => <Input {...control} name="email" type="email" />}
  </Field>
  {errorGeneral && <Alert tipo="error">{errorGeneral}</Alert>}
  <FormActions enviando={enviando} />
</form>;
```

- Los formularios son **no controlados**: no hay un `useState` por campo. Los valores se leen del `<form>` al enviarlo (`leerFormulario`).
- La validación vive en `features/<modulo>/esquemas.ts`, con Zod. El mismo esquema valida y genera el tipo.
- Las reglas que se repiten (email, contraseña, CUIT, DNI, fechas) están en `lib/formulario/reglas.ts`. **No se escriben de nuevo en cada esquema.**
- Los campos tipo lista (habilidades) viajan como inputs ocultos con nombre `campo[]`.
- `Field` genera los `id` solo: es imposible dejar un label sin asociar.

## Errores del backend

`lib/api/errores.ts` convierte cualquier respuesta fallida en un `ApiError` con un **código** (`EMAIL_REGISTRADO`, `NO_AUTENTICADO`…).

- Para decidir qué hacer, se compara `error.codigo`. **Nunca el texto del mensaje**.
- Para mostrar algo al usuario, se usa `mensajeParaUsuario(error)`. Todos los textos están en un solo lugar.

## Sesión y permisos

| Nivel         | Dónde                                       | Qué controla                                       |
| ------------- | ------------------------------------------- | -------------------------------------------------- |
| Filtro rápido | `proxy.ts`                                  | Que exista la cookie. Renueva la sesión si venció. |
| Control real  | `lib/sesion.ts`, usado en layouts y páginas | Quién es el usuario, si verificó el email, su rol. |
| Barrera final | Backend                                     | Todo. El frontend nunca lo reemplaza.              |

- El navegador **nunca** guarda el rol. Se consulta al backend en cada pedido (`obtenerUsuarioActual` usa `cache` para no repetir la consulta dentro del mismo pedido).
- Sin permiso se muestra un **404**, igual que una URL inexistente (`exigirRol`).
- Los enlaces del menú por rol están en `lib/navegacion.ts`. Ocultar un enlace es solo comodidad: el control lo hace `exigirRol`.

**Limitación conocida:** como `app/(app)/loading.tsx` hace que Next empiece a enviar la página antes de
revisar el rol, las pantallas sin permiso muestran el 404 con código HTTP 200. Para el usuario no cambia
nada y Next agrega `noindex` para que los buscadores no la indexen.

## Estilos

- Los colores están **solo** en `app/globals.css` (`@theme`). En los componentes se usan por nombre: `bg-bordo`, `text-tinta-suave`. ESLint rechaza un hex escrito a mano.
- Todos los colores de texto cumplen contraste AA (4.5:1).
- Para combinar clases se usa `cn()` (`lib/utils.ts`).
- Antes de crear un componente visual, revisá `/dev/ui` (solo en desarrollo): muestra todo lo que ya existe.

## ¿Dónde va esto?

| Quiero agregar…                       | Va en                                                   |
| ------------------------------------- | ------------------------------------------------------- |
| Una pantalla nueva                    | `app/(app)/<ruta>/page.tsx` y la ruta en `lib/rutas.ts` |
| Una pantalla pública o de login       | `app/(auth)/<ruta>/page.tsx`                            |
| Un formulario o lista de un módulo    | `features/<modulo>/`                                    |
| Un botón, campo o caja genérica       | `components/ui/` (y mostrarlo en `/dev/ui`)             |
| Un pedido nuevo al backend            | `lib/api/<modulo>.ts` (y su ruta en `mocks/`)           |
| Un tipo del dominio o un enum         | `types/`                                                |
| El texto visible de un enum           | `lib/etiquetas.ts`                                      |
| Una regla de validación que se repite | `lib/formulario/reglas.ts`                              |
| Un dato de prueba                     | `mocks/semillas.ts`                                     |

## Convenciones

| Qué                     | Regla                                                                                                                    | Ejemplo                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Archivos                | kebab-case                                                                                                               | `login-form.tsx`                      |
| Componentes             | PascalCase, export con nombre                                                                                            | `export function LoginForm`           |
| Componentes por archivo | Uno exportado por archivo. Se permiten componentes internos chicos que solo usa ese archivo                              | `perfil-empresa-seccion.tsx`          |
| Export por defecto      | Solo en `page`, `layout`, `loading`, `error`, `not-found` (lo exige Next)                                                |                                       |
| Idioma                  | Dominio en español; componentes base y términos de React en inglés                                                       | `listarEmpleos`, `Button`, `onSubmit` |
| Caracteres              | Sin ñ ni tildes en identificadores                                                                                       | `contrasena`, `tamano`                |
| Booleanos               | Que se lean como sí o no                                                                                                 | `yaPostulado`, `enviando`, `abierto`  |
| Rutas                   | Nunca escritas a mano: `rutas.perfil`                                                                                    |                                       |
| Client Components       | Solo si hay estado, eventos o APIs del navegador, en el archivo más chico posible                                        |                                       |
| Clickeables             | Siempre `<button>` o `<a>`/`<Link>`, nunca `div` con `onClick`                                                           |                                       |
| Comentarios             | Explican el porqué. Si el código cambia, el comentario también                                                           |                                       |
| Repetición              | Regla de tres: a la tercera vez, se extrae                                                                               |                                       |
| Tamaño                  | Si un archivo pasa las 150 líneas, probablemente hace más de una cosa: dividilo (los datos de `mocks/` son la excepción) |                                       |

## Tests

Se escriben con Vitest y viven al lado del archivo que prueban (`reglas.ts` → `reglas.test.ts`).
Se prueba la lógica que no se ve: el cliente HTTP, los errores, la sesión y los esquemas de validación.

- `lib/test/vacio.ts` reemplaza a `server-only` para poder probar código de servidor.
- `lib/test/mapa-de-archivos.test.ts` falla si un archivo no está anotado en `mapa-de-archivos.md`.
- Cuidado con `beforeEach(() => algo())`: si `algo()` devuelve una función, Vitest la ejecuta al terminar cada test. Usá llaves.

## Cuándo algo está terminado

- [ ] `npm run check` pasa.
- [ ] Funciona solo con teclado (Tab, Enter, Escape).
- [ ] Se ve bien a 360 px de ancho.
- [ ] Tiene estado de carga, de error y de vacío (si corresponde).
- [ ] No repite algo que ya existe en `components/` o `lib/`.
- [ ] Si agregaste o renombraste un archivo, está en `mapa-de-archivos.md` (el test lo controla).
- [ ] Si cambió una regla o una decisión, `docs/` está actualizado.
