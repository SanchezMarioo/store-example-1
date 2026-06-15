@AGENTS.md
# GRIETA — CLAUDE.md

## Stack
- Backend: Medusa.js v2 + PostgreSQL en Railway
- Frontend: Next.js 18 App Router
- Estilos: Tailwind CSS
- Pagos: Stripe plugin oficial de Medusa

## Identidad visual
Concepto "Hormigón y ácido". Fuente de verdad: design-system/MASTER.md
(si existe design-system/pages/<página>.md, tiene prioridad).

- Fondo base: gris cemento (#E5E4DF), secciones oscuras en grafito (#141414)
- Texto: tinta (#0E0E0E) sobre claro, hueso (#FAFAF7) sobre oscuro
- Acento único: amarillo ácido (#D8E000), nunca como color de texto sobre fondo claro
- Tipografía: Anton (títulos, uppercase) + Epilogue (cuerpo), vía next/font
- Estilo: brutalismo streetwear — radio 0px, bordes 2px, sin sombras difusas, inversión en hover
- Usar siempre clases de token (bg-cement, text-ink, bg-acid...), prohibido hex suelto

## Reglas de código
- const por defecto, let solo si el valor cambia
- Componentes pequeños con nombre descriptivo
- Sin comentarios
- Solo clases Tailwind, nada de estilos inline

## Diseño UI/UX
Tienes instalada la skill ui-ux-pro-max. Antes de diseñar 
cualquier página o componente consulta la skill y aplica:
- El patrón de layout recomendado para ecommerce dark mode
- Las UX guidelines para ese componente específico
- Las recomendaciones para Next.js + Tailwind
No escribas código visual sin haberla consultado primero.

## Reglas generales
- Trabaja solo en lo que se te pida en cada mensaje
- No adelantes código de otras secciones
- Cada fase debe funcionar antes de pasar a la siguiente