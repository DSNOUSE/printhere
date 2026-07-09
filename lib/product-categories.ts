export type SubCategory = {
  label: string
  href: string
}

export type ProductCategory = {
  label: string
  href: string
  items: SubCategory[]
}

export const productCategories: ProductCategory[] = [
  {
    label: 'Business Cards',
    href: '/products/business-cards',
    items: [
      { label: 'Standard Business Cards', href: '/products/business-cards/standard' },
      { label: 'Premium Business Cards', href: '/products/business-cards/premium' },
      { label: 'Rounded Corner Cards', href: '/products/business-cards/rounded-corner' },
      { label: 'Spot UV Business Cards', href: '/products/business-cards/spot-uv' },
    ],
  },
  {
    label: 'Flyers & Leaflets',
    href: '/products/flyers-leaflets',
    items: [
      { label: 'A5 Flyers', href: '/products/flyers-leaflets/a5' },
      { label: 'A6 Flyers', href: '/products/flyers-leaflets/a6' },
      { label: 'DL Flyers', href: '/products/flyers-leaflets/dl' },
      { label: 'A4 Flyers', href: '/products/flyers-leaflets/a4' },
    ],
  },
  {
    label: 'Posters & Banners',
    href: '/products/posters-banners',
    items: [
      { label: 'A3 Posters', href: '/products/posters-banners/a3' },
      { label: 'A2 Posters', href: '/products/posters-banners/a2' },
      { label: 'A1 Posters', href: '/products/posters-banners/a1' },
      { label: 'Roller Banners', href: '/products/posters-banners/roller-banners' },
      { label: 'PVC Banners', href: '/products/posters-banners/pvc-banners' },
    ],
  },
  {
    label: 'Booklets & Brochures',
    href: '/products/booklets-brochures',
    items: [
      { label: 'Saddle Stitched', href: '/products/booklets-brochures/saddle-stitched' },
      { label: 'Wire Bound', href: '/products/booklets-brochures/wire-bound' },
      { label: 'Perfect Bound', href: '/products/booklets-brochures/perfect-bound' },
    ],
  },
  {
    label: 'Large Format',
    href: '/products/large-format',
    items: [
      { label: 'Canvas Prints', href: '/products/large-format/canvas' },
      { label: 'Foamex Boards', href: '/products/large-format/foamex-boards' },
      { label: 'Stickers & Decals', href: '/products/large-format/stickers' },
    ],
  },
  {
    label: 'Stationery',
    href: '/products/stationery',
    items: [
      { label: 'Notepads', href: '/products/stationery/notepads' },
      { label: 'Letterheads', href: '/products/stationery/letterheads' },
      { label: 'Envelopes', href: '/products/stationery/envelopes' },
      { label: 'Receipt Books', href: '/products/stationery/receipt-books' },
    ],
  },
]