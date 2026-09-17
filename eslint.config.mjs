// eslint.config.mjs
//
// Además de las reglas de Next y de accesibilidad, este archivo hace
// cumplir la arquitectura por capas (ver docs/arquitectura.md): cada
// bloque de abajo dice qué NO puede importar cada carpeta.

import next from "eslint-config-next";
import jsxA11y from "eslint-plugin-jsx-a11y";

const MSG_CAPAS = "Rompe las capas del proyecto. Ver docs/arquitectura.md.";

/** Arma la regla no-restricted-imports con una lista de patrones prohibidos. */
function prohibir(...patrones) {
  return {
    "no-restricted-imports": ["error", { patterns: [{ group: patrones, message: MSG_CAPAS }] }],
  };
}

/**
 * Cada feature no puede importar a otra feature.
 * Se usa una expresión regular porque los patrones con "!" no pueden
 * volver a permitir una subcarpeta de algo ya prohibido (igual que .gitignore).
 */
const FEATURES = ["auth", "perfil", "empleos", "postulaciones"];
const reglasPorFeature = FEATURES.map((feature) => ({
  files: [`features/${feature}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["@/app/*", "@/mocks/*"], message: MSG_CAPAS },
          { regex: `^@/features/(?!${feature}/)`, message: MSG_CAPAS },
        ],
      },
    ],
  },
}));

const config = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**", "docs/**"],
  },

  // --- Reglas generales ---
  {
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "no-console": ["warn", { allow: ["error"] }],
      eqeqeq: "error",
      // Nada de colores escritos a mano: se usan los tokens de app/globals.css.
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "No escribas colores a mano: usá los tokens de app/globals.css.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "No escribas colores a mano: usá los tokens de app/globals.css.",
        },
      ],
      // Todos los pedidos HTTP pasan por lib/api.
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Usá las funciones de lib/api en lugar de fetch." },
      ],
    },
  },

  // --- Reglas de TypeScript (el plugin solo está cargado para .ts/.tsx) ---
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // --- Capas ---
  {
    files: ["types/**"],
    rules: prohibir("@/app/*", "@/features/*", "@/components/*", "@/lib/*", "@/mocks/*"),
  },
  {
    files: ["mocks/**"],
    rules: prohibir("@/app/*", "@/features/*", "@/components/*", "@/lib/*"),
  },
  {
    files: ["lib/**"],
    rules: prohibir("@/app/*", "@/features/*", "@/components/*", "@/mocks/*"),
  },
  {
    files: ["components/ui/**"],
    rules: prohibir("@/app/*", "@/features/*", "@/mocks/*", "@/types/*", "@/lib/api/*"),
  },
  {
    files: ["components/layout/**", "components/compartidos/**"],
    rules: prohibir("@/app/*", "@/features/*", "@/mocks/*", "@/lib/api/*"),
  },
  ...reglasPorFeature,
  { files: ["app/**"], ignores: ["app/api/mock/**"], rules: prohibir("@/mocks/*") },

  // --- Excepciones justificadas ---
  {
    // El cliente HTTP y el backend simulado son los únicos que usan fetch/Response.
    files: ["lib/api/**", "mocks/**", "**/*.test.ts"],
    rules: { "no-restricted-globals": "off" },
  },
];

export default config;
