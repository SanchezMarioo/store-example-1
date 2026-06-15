 # GRIETA — Design System MASTER

Fuente de verdad global. Antes de construir una página, comprueba si existe `design-system/pages/<página>.md`; si existe, sus reglas tienen prioridad sobre este archivo. Si no, aplica este archivo en exclusiva.

Validado con la skill `ui-ux-pro-max`: patrón e-commerce **Feature-Rich Showcase**, estilos **Kinetic Brutalism** (street, zine, acid yellow, uppercase, marquee) + **Minimalist Monochrome** (luxury fashion e-commerce) + **Exaggerated Minimalism** (fashion, un solo acento), tipografía nº57 **"Gen Z Brutal"** (etiquetada streetwear).

## Marca

- **Nombre**: GRIETA. La grieta del hormigón: lo que se abre paso desde abajo. Logo tipográfico en Anton, sin símbolo.
- **Concepto visual**: "Hormigón y ácido" — base gris cemento, estructura en tinta casi-negra, un único acento amarillo ácido como señal de obra. Secciones oscuras puntuales en grafito.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `cement` | `#E5E4DF` | Fondo base |
| `cement-light` | `#F2F1EC` | Sección alterna clara / superficies elevadas |
| `ink` | `#0E0E0E` | Texto principal, bordes, botón primario |
| `graphite` | `#141414` | Sección oscura (footer, banners, menú mobile) |
| `bone` | `#FAFAF7` | Texto sobre fondos oscuros |
| `acid` | `#D8E000` | Acento único: hover de CTA, badges, subrayados, marquee |
| `acid-press` | `#B9C000` | Estado pressed/active del acento |
| `zinc-mid` | `#52525B` | Texto secundario sobre claro |
| `zinc-soft` | `#A1A1AA` | Texto secundario sobre oscuro |
| `line-dark` | `#3F3F46` | Bordes/divisores en secciones oscuras |
| `error` | `#DC2626` | Errores, urgencia real |
| `success` | `#16A34A` | Confirmaciones |

Reglas duras:
- `acid` **nunca** como color de texto sobre fondo claro (no llega a 4.5:1). Solo fondo, subrayado o marca gráfica.
- Hover global = inversión (claro→`ink`) o flood `acid` con texto `ink`. Transición 150ms.
- Estados funcionales (error/success) siempre con icono o texto, nunca solo color.

## Tipografía

- **Display**: Anton 400, siempre uppercase, `tracking-tight`, `leading-[0.9]`. Solo títulos, logo, marquees, cifras hero.
- **Cuerpo**: Epilogue 400 / 500 / 700.
- Escala: H1 `clamp(2.75rem, 8vw, 6rem)` Anton · H2 `2.25rem` (mobile `1.75rem`) Anton · H3 `1.25rem` Epilogue 700 uppercase tracking-wide · Párrafo `1rem/1.6` Epilogue 400 (mínimo 16px) · Caption `0.75rem` Epilogue 700 uppercase `tracking-widest`.
- Precios, cantidades y totales con `tabular-nums`.
- Carga vía `next/font/google` en el root layout (`--font-anton`, `--font-epilogue`).

## Espaciado, forma y ritmo

- Sistema 4/8. Jerarquía vertical: 16 / 24 / 32 / 48 / 96.
- Secciones `py-16` mobile / `py-24` desktop. Container `max-w-7xl`, gutters `px-4` mobile / `px-8` desktop.
- **Radio 0px en todo.** Sin sombras difusas: o nada, o sombra dura `4px 4px 0 #0E0E0E`.
- Divisores entre secciones: regla horizontal 2px `ink` full-bleed.
- Gaps grandes entre bloques (≥48px).

## Imágenes

- Producto: fondo gris cemento liso (tono `cement`), luz dura, encuadre frontal + detalle de tejido. Ratio fijo **3:4** en todo el sitio.
- Lookbook: exterior urbano real (hormigón, persianas, asfalto), grano leve.
- `next/image` siempre: `fill` + aspect-ratio reservado o width/height (CLS < 0.1), `priority` solo en hero, lazy el resto, `remotePatterns` para el CDN de Medusa.
- Loading: skeleton shimmer gris cemento, nunca spinner sobre fotos.

## Componentes

- **Botón primario**: rectangular, `bg-ink text-bone`, borde 2px `ink`, alto mín 48px, Epilogue 700 uppercase tracking-wide. Hover → `bg-acid text-ink` (150ms). Pressed → `acid-press` + scale 0.98. Disabled → opacidad 0.4. Loading → spinner + disabled.
- **Botón secundario**: outline 2px `ink` transparente; hover → inversión `bg-ink text-bone`.
- **Badges**: `bg-acid text-ink` uppercase 11px 700 ("NUEVO", "DROP 03"); urgencia real en `error`. Prohibidos contadores falsos.
- **Tags de categoría**: outline 1px `zinc-mid`, caption uppercase, hover inversión.
- **Chips de talla**: cuadrados ≥44×44px, borde 2px `ink`; seleccionada → inversión; agotada → opacidad 0.38 + tachado diagonal, no interactiva.
- **Cards de producto**: sin borde ni sombra; foto 3:4 full-bleed, nombre Epilogue 500, precio 700 tabular. Hover desktop: crossfade a segunda foto (200ms) + subrayado `acid` 3px bajo el nombre + cursor-pointer. Press: scale 0.98. Mobile: toda la info siempre visible.
- **Inputs**: caja borde 2px `ink` sobre `cement-light`, label siempre visible arriba, alto ≥48px, focus ring `acid` 2px con offset, helper text persistente, error bajo el campo con causa + solución.
- **Iconos**: Lucide, stroke 2px, un solo estilo. Nunca emojis.
- **Toasts**: bloque `bg-ink text-bone` borde `acid` 2px, radio 0; bottom-right desktop / bottom full-width mobile; auto-dismiss 4s; `aria-live="polite"`.

## Layout por página

### Home
1. Announcement bar `bg-ink text-bone` con marquee (estática con `prefers-reduced-motion`).
2. Header: logo Anton izquierda · NUEVO / HOMBRE / MUJER / ACCESORIOS / LOOKBOOK · búsqueda, cuenta, carrito (badge `acid`). Transparente sobre hero → sticky `bg-cement/95 backdrop-blur` + borde inferior 2px tras 8px de scroll. Link activo con subrayado `acid`. Mobile: menú full-screen `bg-ink` con links Anton gigantes; header auto-hide al bajar.
3. Hero split 60/40: H1 Anton + línea Epilogue + CTA doble; foto lookbook 3:4. Mobile: foto 70vh con scrim negro 50% y texto encima.
4. Categorías: 3 bloques foto duotono + título Anton en marco 2px; hover flood `acid`.
5. Destacados: H2 "DROP ACTUAL", grid 2/4 cols, stagger 40ms, "VER TODO →".
6. Banner `bg-acid text-ink` marquee Anton loop lineal 5s.
7. Confianza: 3 columnas icono + caption (envío 24/48h · devoluciones 30 días · algodón 240gsm).
8. Footer `bg-graphite text-bone`: Tienda / Ayuda / Legal / Newsletter; cierre logo Anton a ancho completo.

### Catálogo `/productos`
- Filtros en top bar sticky (chips desplegables: Categoría · Talla · Precio · Color · Ordenar), igual en desktop y mobile; panel anclado desktop / bottom-sheet mobile; filtros activos eliminables + "Borrar todo" + contador; estado en URL.
- Grid 2 / 3 / 4 cols, gap-4/6. Hover desktop: franja de tallas de añadido rápido.
- Paginación: botón "CARGAR MÁS" + skeletons. No infinite scroll puro.

### Producto `/productos/[handle]`
- Desktop: galería izquierda ~55% (columna scrolleable) + panel derecho sticky. Mobile: carrusel scroll-snap con indicador.
- Galería 4–6 fotos 3:4, thumbnails verticales, lightbox con zoom, primera con `priority`.
- Orden: breadcrumb → tag categoría → H1 nombre → precio → color → tallas + "Guía de tallas" (modal/bottom-sheet con tabla cm) → AÑADIR AL CARRITO full-width 56px → acordeones (Descripción · Material y cuidados · Envío y devoluciones).
- Sin talla seleccionada: error junto al selector + focus.
- Relacionados: "COMBÍNALO CON", 4 cards.

### Carrito
- Slide-over derecho sobre scrim negro 50%; focus atrapado; cierre por X/scrim/swipe. `/carrito` como página completa para deep-linking.
- Item: thumb 80px, nombre, talla, precio tabular, stepper 44px, eliminar con toast "DESHACER".
- Resumen: subtotal · envío con barra de progreso hacia envío gratis +80€ · total 700 tabular.
- CTA "TRAMITAR PEDIDO" full-width + "Seguir comprando". Vacío: mensaje + "VER DROP".

### Checkout
- Desktop 2 columnas (form + resumen sticky). Mobile 1 columna con resumen colapsable arriba (total siempre visible).
- Pasos Contacto → Envío → Pago con indicador y vuelta atrás libre.
- Header reducido: logo + candado, sin nav.
- Validación on-blur, focus al primer campo inválido, `autocomplete`, tipos semánticos.
- Stripe Payment Element tematizado (ink/cement/acid).

### Login / Registro
- Split: foto lookbook duotono izquierda (oculta en mobile) + formulario `max-w-sm`.
- Login: email → contraseña (toggle mostrar) → primario → recuperar → "Crea tu cuenta" con subrayado `acid`. Registro: nombre, apellidos, email, contraseña con helper persistente.

### Cuenta `/cuenta`
- Desktop sidebar: Mis pedidos · Mis datos · Direcciones; "Cerrar sesión" separado abajo. Mobile: tabs horizontales sticky. Activo con subrayado `acid`.
- Pedidos: cards con nº, fecha, badge de estado con texto (en camino outline `acid` · entregado `success` · cancelado `error`), total, "VER DETALLE".
- Direcciones: cards con badge "PREDETERMINADA"; eliminar con confirmación.

## Microinteracciones

- Añadir al carrito: loading → "AÑADIDO ✓" flood `acid` 1s → badge scale-spring → slide-over a los 300ms.
- Timing 150–300ms, solo `transform`/`opacity`, ease-out entrando / ease-in saliendo, salidas ~60% de la entrada.
- Transiciones de página: fade 150ms (View Transitions si disponible).
- Todo respeta `prefers-reduced-motion`.
- Header mobile auto-hide; announcement bar desaparece tras 24px.

## Tono de marca

- "ROPA QUE AGUANTA LA CALLE." · "SIN TEMPORADAS. SOLO DROPS." · "COSIDO EN EUROPA. CURTIDO EN EL ASFALTO."
- Tuteo directo y seco, frases cortas, imperativos, cero emojis, cero exclamaciones dobles.
- Nunca: degradados multicolor, esquinas redondeadas, emojis como iconos, pasteles, stock sonriente, pop-ups de entrada, urgencia falsa, cursivas decorativas, soft UI.

## Tokens Tailwind v4

Definidos en `app/globals.css` bajo `@theme`; las fuentes se inyectan desde `app/layout.tsx` con `next/font`. Usar siempre clases de token (`bg-cement`, `text-ink`, `bg-acid`, `font-display`, `font-body`, `shadow-brutal`) — prohibido hex suelto en componentes.
