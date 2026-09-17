# Registro de decisiones

Cada decisión técnica importante, con el motivo. Si alguien pregunta "¿por qué se hace así?", la respuesta
debería estar acá. Cuando cambies una decisión, no la borres: agregá una nueva que la reemplace.

## D1. Reescribir el frontend desde cero

La versión anterior tenía dos fuentes de verdad para la sesión, estilos copiados, código duplicado y datos
de prueba mezclados con los reales. El equipo decidió reescribirlo y reconectar el backend al final.
Del código anterior se conservó el conocimiento (ver `backend.md`), el texto de términos, la lista de
países de respaldo y el logo.

## D2. Next.js 16 con App Router y Server Components por defecto

Las pantallas privadas se resuelven en el servidor: llegan al navegador ya con los datos y sin pantallazo
en blanco. `"use client"` se usa solo en componentes con estado o eventos.

## D3. La sesión se consulta siempre al backend

El rol nunca se guarda en el navegador (antes estaba en sessionStorage y se podía editar).
`lib/sesion.ts` pregunta al backend en cada pedido; `cache()` evita repetir la consulta dentro del mismo pedido.

## D4. `proxy.ts` en lugar de `middleware.ts`

En Next 16 el archivo se llama `proxy.ts` y exporta `proxy`. Se usa para el filtro rápido de cookie y para
renovar la sesión, que es lo único que no puede hacer una página (las páginas no escriben cookies).

## D5. Sin permiso se muestra 404

Para no confirmar que una pantalla existe. Consecuencia aceptada: por el streaming de `loading.tsx`,
el código HTTP es 200 (con `noindex`).

## D6. Backend simulado como ruta HTTP, no como `if` en cada función

El reporte inicial proponía un `if (usarMocks)` dentro de cada función de `lib/api`. Se cambió por un backend
falso en `app/api/mock` que responde por HTTP. Motivos:

- El cliente real (cookies, errores, renovación, timeout) se usa desde el primer día, no recién al conectar.
- `lib/api` no tiene ramas de código que después haya que borrar.
- Pasar al backend real es cambiar dos variables de entorno.

El simulado queda deshabilitado si `MOCK_API_HABILITADO` no es `true`.

## D7. Tailwind CSS 4 con tokens en `@theme`

Los colores se definen una sola vez en `app/globals.css` y generan clases con nombre (`bg-bordo`).
ESLint rechaza hex escritos a mano. Todos los colores de texto se verificaron con contraste AA.

## D8. Zod para validar formularios y respuestas

Un mismo esquema valida y genera el tipo, así las reglas no se escriben dos veces. Las respuestas del backend
también se validan: si el backend cambia un campo, el error aparece en `lib/api/` y no en un componente.
Se usa Zod 4.

## D9. Formularios no controlados con `useFormulario`

Los valores se leen del `<form>` al enviar, sin un `useState` por campo. Un solo hook resuelve validación,
errores por campo, error general y estado de envío para todos los formularios.

## D10. Errores con código estable

Se decide por `ApiError.codigo`, nunca por el texto. Los mensajes al usuario están todos en `lib/api/errores.ts`.

## D11. Un solo componente para las listas del perfil

Educación, experiencia e idiomas usan `ListaEditable` (y `crearRecursoLista` en `lib/api`). Antes eran
archivos casi idénticos.

## D12. Capas controladas por ESLint

`no-restricted-imports` impide, por ejemplo, que una feature importe otra o que `lib` importe componentes.
Para "una feature solo puede importarse a sí misma" se usa una expresión regular, porque los patrones con `!`
no pueden volver a permitir una subcarpeta de algo ya prohibido (funcionan como `.gitignore`).

## D13. Detalle de empleo con URL propia

`/empleos/[id]` en lugar de un modal: se puede compartir, abrir en otra pestaña y usar el botón "atrás".

## D14. Código de verificación en un solo campo

Un `input` con `autocomplete="one-time-code"` en lugar de seis casillas: el celular sugiere el código solo,
se puede pegar y los lectores de pantalla lo leen como un único campo.

## D15. Video de fondo liviano y opcional

El video pasó de 7 MB a 1,5 MB (720p, sin audio), tiene una imagen de portada y solo se carga en pantallas
medianas o grandes cuando la persona no pidió reducir el movimiento.

## D16. Vitest 3

Vitest 4 hacía fallar `npm install` por un error de npm (`Cannot read properties of null (reading 'edgesOut')`).
Revisar al actualizar npm.

## D17. Una sola pantalla de carga para las pantallas internas

El reporte proponía un `loading.tsx` por página. Se usa uno solo en `app/(app)/`: todas las pantallas muestran
lo mismo mientras cargan, y la navbar queda visible porque pertenece al layout.

## D18. Nombres de archivos distintos a los del reporte

El árbol del reporte era una propuesta. Al construir, algunos nombres cambiaron para ser más claros o porque
la pieza creció:

- Las secciones del perfil terminan en `-seccion` (`educacion-seccion.tsx`), porque cada una es un panel completo.
- `selector-pais.tsx` pasó a `components/compartidos/campos-ubicacion.tsx`: agrupa país, provincia y ciudad, y lo usan dos features.
- `codigo-verificacion.tsx` pasó a `verificar-cuenta-form.tsx` (ver D14).
- Los mocks se organizan por rutas del backend (`rutas-auth.ts`…) y no por entidad, porque imitan al servidor (ver D6).
- `lib/api/perfiles.ts` se dividió en `perfil-trabajador.ts` y `perfil-empresa.ts`.

Aparecieron piezas que el reporte no preveía: `lib/formulario/` (D9), `lib/etiquetas.ts`, `lib/navegacion.ts`
y componentes base como `Panel`, `Badge`, `DataList`, `TagInput` y `EnlaceExterno`.
El nombre real de cada archivo y su función están en `mapa-de-archivos.md`.

## D19. Fuente Inter servida desde el proyecto

Se usa el paquete `@fontsource-variable/inter` en lugar de `next/font/google`: no depende de acceder a Google
al compilar y el navegador descarga solo los caracteres que la página usa.

## D20. Ajuste de dos convenciones del reporte

- **Booleanos:** el reporte pedía que empiecen con `es`, `tiene` o `puede`. Se cambió por "que se lean como sí o no":
  `enviando` o `abierto` se entienden igual de bien, y forzar `estaEnviando` no agrega claridad.
- **Un componente por archivo:** se cambió por "un componente exportado por archivo". Los componentes internos
  chicos (por ejemplo, la vista y el formulario de la empresa) pueden quedar en el mismo archivo. Cuando un archivo
  crece o junta dos funciones distintas, se divide: así se separaron `cambiar-contrasena.tsx`, `eliminar-cuenta.tsx`,
  `vista-perfil-trabajador.tsx` y `formulario-perfil-trabajador.tsx`.

## D21. El mapa de archivos lo controla un test

`docs/mapa-de-archivos.md` explica qué hace cada archivo. Para que no quede desactualizado,
`lib/test/mapa-de-archivos.test.ts` falla si un archivo no está anotado o si el mapa nombra uno que ya no existe.

## D22. Sin `as` sobre datos externos

Los códigos de error del backend se validan con una guarda de tipo (`esCodigoDelBackend`) y `opcionesDe` usa
`Object.entries`. Los únicos `as` que quedan están en `mocks/`, que es código de prueba.

## D23. Un 401 en `/login` no dispara la renovación de sesión

En `/login` y `/refresh`, un 401 significa "datos incorrectos" y no "sesión vencida". Antes, una contraseña
incorrecta hacía un pedido extra a `/refresh` antes de mostrar el error. Lo cubre un test en `cliente.test.ts`.

## D24. Idiomas y habilidades no rompen el perfil si el backend no los tiene

Mientras esos endpoints no existan, un 404 al pedirlos se muestra como lista vacía en `/perfil`. Así se puede
probar el resto del perfil contra el backend real. Cuando backend los cree, esta tolerancia se puede quitar
(`app/(app)/perfil/page.tsx`).

## D25. `Form` en `components/ui/` en lugar de repetirlo en cada feature

`features/perfil/formulario-seccion.tsx` (form + error general + botones) resolvía esto para el perfil, pero
`features/auth` no podía importarlo por la regla "una feature nunca importa otra" (D12) y terminó repitiendo el
mismo marcado en sus seis formularios. Se subió el marco genérico a `components/ui/form.tsx` (no depende de
`types/` ni de otra feature) y ambas features lo usan; `formulario-item.tsx` ahora es una versión de `Form` con
el estilo de caja de `ListaEditable`. Mismo motivo que D11, un nivel más arriba en las capas.

## D26. `AuthFooterLink` para el enlace de pie de las pantallas de acceso

Login, registro (y sus dos variantes) y recuperar contraseña repetían el mismo párrafo para pasar a la pantalla
relacionada. Se extrajo a `components/layout/auth-footer-link.tsx`.
