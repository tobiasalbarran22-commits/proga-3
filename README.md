# laburAR · Frontend

Bolsa de trabajo de tecnología para Argentina. Proyecto de Práctica Profesional 2026.

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zod

## Arrancar

Requiere Node 20.9 o superior.

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Por defecto la app usa un **backend simulado**, así que no hace falta levantar el FastAPI.

Cuentas de prueba (contraseña `demo1234`):

- `trabajador@ejemplo.com`
- `empresa@ejemplo.com`
- `admin@ejemplo.com`
- `nuevo@ejemplo.com`: sin verificar; el código es `123456`

Muestra de componentes (solo en desarrollo): http://localhost:3000/dev/ui

## Usar el backend real

La explicación completa está en [`docs/backend.md`](docs/backend.md). En resumen:

Creá `.env.development.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
MOCK_API_HABILITADO=false
```

Para producción, copiá `.env.example` y completá los valores.

## Scripts

| Comando             | Qué hace                                        |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                          |
| `npm run build`     | Compilación de producción                       |
| `npm run start`     | Sirve la compilación de producción              |
| `npm run check`     | Tipos + lint + formato + tests (lo corre el CI) |
| `npm run typecheck` | Solo TypeScript                                 |
| `npm run lint`      | ESLint (incluye las reglas de capas)            |
| `npm run format`    | Formatea todo con Prettier                      |
| `npm run test`      | Tests con Vitest                                |

Antes de abrir un PR, `npm run check` tiene que pasar.

## Estructura

```
app/            rutas: (auth) para quien no inició sesión, (app) para quien sí
components/     ui/ piezas base · layout/ navbar y tarjetas · compartidos/
features/       auth · perfil · empleos · postulaciones
lib/            api/ backend · formulario/ validación · sesion · rutas · config
types/          tipos del dominio (diccionario de datos)
mocks/          backend simulado
docs/           arquitectura, mapa de archivos, backend y decisiones
proxy.ts        filtro de sesión antes de cada página privada
```

## Documentación

- [`docs/arquitectura.md`](docs/arquitectura.md): capas, patrones, convenciones y dónde va cada cosa. **Empezá por acá.**
- [`docs/mapa-de-archivos.md`](docs/mapa-de-archivos.md): qué hace cada archivo.
- [`docs/backend.md`](docs/backend.md): endpoints, comportamiento del backend y cuentas de prueba.
- [`docs/decisiones.md`](docs/decisiones.md): por qué el proyecto está hecho así.
