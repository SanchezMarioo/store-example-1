export type Variant = {
  id: string
  size: string
  available: boolean
}

export type Product = {
  id: string
  handle: string
  name: string
  price: number
  compareAtPrice?: number
  images: string[]
  variants: Variant[]
  description: string
  details: string
}

export type Drop = {
  name: string
  number: string
  window: string
  products: Product[]
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1100&q=80`

function sizes(handle: string, map: Record<string, boolean>): Variant[] {
  return Object.entries(map).map(([size, available]) => ({
    id: `${handle}-${size.toLowerCase()}`,
    size,
    available,
  }))
}

export const drop: Drop = {
  name: 'ASFALTO',
  number: '04',
  window: 'JUN 2026',
  products: [
    {
      id: 'hoodie-asfalto',
      handle: 'hoodie-asfalto',
      name: 'HOODIE ASFALTO',
      price: 95,
      images: [
        img('1620799140188-3b2a02fd9a77'),
        img('1680292783974-a9a336c10366'),
        img('1673092147872-5ddb03194341'),
        img('1655141559697-f927ed68170c'),
      ],
      variants: sizes('hoodie-asfalto', { S: true, M: false, L: true, XL: true }),
      description: '100% ALGODÓN ORGÁNICO - CORTE OVERSIZE',
      details:
        'Sudadera con capucha de algodón orgánico, felpa pesada de 480 g/m². Corte oversize con hombros caídos y bolsillo canguro. Serigrafía a mano del drop ASFALTO en la espalda. Producción limitada, sin reposición.',
    },
    {
      id: 'hoodie-nucleo',
      handle: 'hoodie-nucleo',
      name: 'HOODIE NÚCLEO',
      price: 98,
      images: [img('1564557287817-3785e38ec1f5'), img('1578768079052-aa76e52ff62e')],
      variants: sizes('hoodie-nucleo', { S: true, M: true, L: true, XL: false }),
      description: 'FELPA PESADA 480GSM - CORTE RELAJADO',
      details:
        'Sudadera de felpa cepillada por dentro, tacto denso y caída recta. Cordón plano a juego y puños acanalados. Tinte sólido en masa para un negro/crudo que no destiñe.',
    },
    {
      id: 'tee-estatica',
      handle: 'tee-estatica',
      name: 'TEE ESTÁTICA',
      price: 44,
      images: [
        img('1589902860314-e910697dea18'),
        img('1503341733017-1901578f9f1e'),
        img('1503341338985-c0477be52513'),
      ],
      variants: sizes('tee-estatica', { XS: false, S: false, M: false, L: false, XL: false }),
      description: '100% ALGODÓN - CAÍDA OVERSIZE',
      details:
        'Camiseta de algodón pesado con caída oversize y cuello reforzado. Gráfica ESTÁTICA serigrafiada a tres tintas en la espalda. Agotada en el último drop.',
    },
    {
      id: 'hoodie-hormigon',
      handle: 'hoodie-hormigon',
      name: 'HOODIE HORMIGÓN',
      price: 84,
      compareAtPrice: 105,
      images: [img('1615397587950-3cbb55f95b77'), img('1611817757591-c3f345024273')],
      variants: sizes('hoodie-hormigon', { S: true, M: true, L: false, XL: true }),
      description: 'TWILL DE ALGODÓN - CORTE CAJA',
      details:
        'Sudadera de corte caja, estructura firme y caída cuadrada. Últimas unidades del drop anterior a precio reducido. Sin reposición.',
    },
    {
      id: 'tee-ruido',
      handle: 'tee-ruido',
      name: 'TEE RUIDO',
      price: 42,
      images: [img('1635650804060-bb009bcb2ea5'), img('1593726891090-b4c6bc09c819')],
      variants: sizes('tee-ruido', { XS: true, S: true, M: true, L: true, XL: true }),
      description: 'JERSEY 220GSM - CORTE RECTO',
      details:
        'Camiseta de jersey de algodón peinado, gramaje medio y corte recto. Estampado RUIDO al tono en el pecho. Pieza base del drop ASFALTO.',
    },
    {
      id: 'hoodie-oxido',
      handle: 'hoodie-oxido',
      name: 'HOODIE ÓXIDO',
      price: 120,
      images: [img('1614214191247-5b2d3a734f1b'), img('1579269896398-4deb6cbdc320')],
      variants: sizes('hoodie-oxido', { S: false, M: true, L: true, XL: true }),
      description: 'FELPA CEPILLADA - CAPUCHA FORRADA',
      details:
        'Sudadera premium de felpa cepillada con capucha forrada a doble capa. Bordado ÓXIDO en la manga. La pieza más pesada del drop.',
    },
    {
      id: 'hoodie-sombra',
      handle: 'hoodie-sombra',
      name: 'HOODIE SOMBRA',
      price: 92,
      images: [img('1688111421205-a0a85415b224'), img('1610582144787-eda2e6f293b4')],
      variants: sizes('hoodie-sombra', { S: false, M: false, L: false, XL: false }),
      description: 'ALGODÓN PEINADO - UNISEX',
      details:
        'Sudadera unisex de algodón peinado, corte medio y caída limpia. Agotada por completo en este drop.',
    },
    {
      id: 'hoodie-humo',
      handle: 'hoodie-humo',
      name: 'HOODIE HUMO',
      price: 110,
      images: [img('1633292750937-120a94f5c2bb'), img('1571821324176-52ff15e96348')],
      variants: sizes('hoodie-humo', { S: true, M: true, L: false, XL: false }),
      description: 'FELPA PESADA - TINTE PRENDA',
      details:
        'Sudadera teñida en prenda para un negro lavado irrepetible entre unidades. Felpa pesada, corte relajado, sin gráfica. El producto habla solo.',
    },
  ],
}

export const shippingNotice = 'PRE-MADE - ENVÍO EN 1-3 DÍAS LABORABLES'

export const policies = ['PEDIDOS +150€ - ENVÍO GRATIS', 'SIN DEVOLUCIONES']

export const careInstructions = [
  'LAVAR A 30°',
  'NO USAR LEJÍA',
  'SECAR EN HORIZONTAL',
  'PLANCHAR DEL REVÉS',
  'NO LIMPIAR EN SECO',
]

export function getProduct(handle: string): Product | undefined {
  return drop.products.find((p) => p.handle === handle)
}

export function isSoldOut(product: Product): boolean {
  return product.variants.every((v) => !v.available)
}

export function formatPrice(value: number): string {
  return `€${value}`
}
