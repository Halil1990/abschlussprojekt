const STORAGE_BASE_URL = (process.env.NEXT_PUBLIC_WORKWEAR_BASE_URL || '').replace(/\/+$/, '');
const IMAGE_VERSION = process.env.NEXT_PUBLIC_WORKWEAR_IMAGE_VERSION || String(Date.now());
const WORKWEAR_VIEW_FILENAMES = [
  'vorne.jpg',
  'hinten.jpg',
  'links.jpg',
  'rechts.jpg',
] as const;
type WorkwearView = (typeof WORKWEAR_VIEW_FILENAMES)[number] extends `${infer Name}.jpg`
  ? Name
  : never;

export type ZoneTemplate = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const WORKWEAR_PRODUCTS = [
  {
    id: 'jacke',
    label: 'Jacke',
    shortLabel: 'Jacke',
    folder: 'jacke',
    imageExtension: 'png',
  },
  {
    id: 'hose',
    label: 'Hose',
    shortLabel: 'Hose',
    folder: 'hose',
    imageExtension: 'png',
  },
  {
    id: 'latzhose',
    label: 'Latzhose',
    shortLabel: 'Latzhose',
    folder: 'latzhose',
    imageExtension: 'png',
  },
  {
    id: 'weste',
    label: 'Weste',
    shortLabel: 'Weste',
    folder: 'weste',
    imageExtension: 'png',
  },
] as const;

export type WorkwearProductId = (typeof WORKWEAR_PRODUCTS)[number]['id'];
export const WORKWEAR_VIEWS_PER_PRODUCT = WORKWEAR_VIEW_FILENAMES.length;

export const WORKWEAR_PREVIEW_COLORS = [
  {
    id: 'black',
    label: 'Schwarz',
    hex: '#1f1f1f',
  },
  {
    id: 'blue',
    label: 'Blau',
    hex: '#1d4ed8',
  },
  {
    id: 'red',
    label: 'Rot',
    hex: '#dc2626',
  },
  {
    id: 'white',
    label: 'Weiss',
    hex: '#f3f4f6',
  },
] as const;

export type WorkwearPreviewColorId =
  (typeof WORKWEAR_PREVIEW_COLORS)[number]['id'];

const buildImageSequence = (folder: string, imageExtension: string) =>
  WORKWEAR_VIEW_FILENAMES.map((fileName) => {
    const viewName = fileName.replace(/\.[^.]+$/, '');
    const relativePath = folder + '/' + viewName + '.' + imageExtension;
    const baseUrl = STORAGE_BASE_URL + '/' + relativePath;

    // Uses Supabase Storage exclusively
    return IMAGE_VERSION ? baseUrl + '?v=' + IMAGE_VERSION : baseUrl;
  });

export const WORKWEAR_IMAGES: readonly string[] = [
  ...WORKWEAR_PRODUCTS.flatMap((product) =>
    buildImageSequence(product.folder, product.imageExtension),
  ),
];

export const WORKWEAR_COLOR_PREVIEW_IMAGES: Record<
  WorkwearProductId,
  Record<WorkwearPreviewColorId, string>
> = Object.fromEntries(
  WORKWEAR_PRODUCTS.map((product) => {
    const colorEntries = WORKWEAR_PREVIEW_COLORS.map((color) => {
      const baseUrl =
        STORAGE_BASE_URL + '/preview/' + product.folder + '/' + color.id + '.png';
      const url = IMAGE_VERSION ? baseUrl + '?v=' + IMAGE_VERSION : baseUrl;
      return [color.id, url] as const;
    });

    return [
      product.id,
      Object.fromEntries(colorEntries),
    ] as const;
  }),
) as Record<WorkwearProductId, Record<WorkwearPreviewColorId, string>>;

export const DEFAULT_WORKWEAR_INDEX = 0;

export const PREVIEW_DROP_ID = 'preview-drop';
export const ZONE_DROP_PREFIX = 'zone:';

const DEFAULT_ZONE_TEMPLATES: readonly ZoneTemplate[] = [
  { x: 29, y: 38, w: 11.3, h: 6.3 },
  { x: 62, y: 38, w: 11.3, h: 6.3 },
];

export const ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW: Record<
  WorkwearProductId,
  Record<WorkwearView, readonly ZoneTemplate[]>
> = {
  jacke: {
    vorne: [
      { x: 30, y: 37, w: 12, h: 7.2 },
    ],
    hinten: [
      { x: 47, y: 18, w: 8, h: 2.7 },
      { x: 24, y: 28, w: 52, h: 34.7 },
    ],
    links: [
      { x: 50, y: 42, w: 9.5, h: 9.5 },
    ],
    rechts: [
      { x: 33, y: 42, w: 9.5, h: 9.5 },
    ],
  },
  hose: {
    vorne: [
      { x: 30, y: 24, w: 11.3, h: 6.3 },
      { x: 56, y: 24, w: 11.3, h: 6.3 },
    ],
    hinten: [
      { x: 30, y: 24, w: 11.3, h: 6.3 },
      { x: 56, y: 24, w: 11.3, h: 6.3 },
    ],
    links: [
      { x: 30, y: 24, w: 11.3, h: 6.3 },
      { x: 56, y: 24, w: 11.3, h: 6.3 },
    ],
    rechts: [
      { x: 30, y: 24, w: 11.3, h: 6.3 },
      { x: 56, y: 24, w: 11.3, h: 6.3 },
    ],
  },
  latzhose: {
    vorne: [
      { x: 36, y: 40, w: 11.3, h: 6.3 },
      { x: 56, y: 40, w: 11.3, h: 6.3 },
    ],
    hinten: [
      { x: 36, y: 40, w: 11.3, h: 6.3 },
      { x: 56, y: 40, w: 11.3, h: 6.3 },
    ],
    links: [
      { x: 36, y: 40, w: 11.3, h: 6.3 },
      { x: 56, y: 40, w: 11.3, h: 6.3 },
    ],
    rechts: [
      { x: 36, y: 40, w: 11.3, h: 6.3 },
      { x: 56, y: 40, w: 11.3, h: 6.3 },
    ],
  },
  weste: {
    vorne: [
      { x: 27, y: 38, w: 11.3, h: 6.3 },
      { x: 62, y: 38, w: 11.3, h: 6.3 },
    ],
    hinten: [
      { x: 27, y: 38, w: 11.3, h: 6.3 },
      { x: 62, y: 38, w: 11.3, h: 6.3 },
    ],
    links: [
      { x: 27, y: 38, w: 11.3, h: 6.3 },
      { x: 62, y: 38, w: 11.3, h: 6.3 },
    ],
    rechts: [
      { x: 27, y: 38, w: 11.3, h: 6.3 },
      { x: 62, y: 38, w: 11.3, h: 6.3 },
    ],
  },
};

function toValidZoneCount(value: number) {
  return Math.max(0, Math.floor(value));
}

export function getZoneTemplatesForImage(
  imageIndex: number,
): readonly ZoneTemplate[] {
  const productIndex = Math.floor(imageIndex / WORKWEAR_VIEWS_PER_PRODUCT);
  const viewIndex = imageIndex % WORKWEAR_VIEWS_PER_PRODUCT;
  const productId =
    WORKWEAR_PRODUCTS[productIndex]?.id ?? WORKWEAR_PRODUCTS[0].id;
  const fileName =
    WORKWEAR_VIEW_FILENAMES[viewIndex] ?? WORKWEAR_VIEW_FILENAMES[0];
  const view = fileName.replace('.jpg', '') as WorkwearView;

  const configured = ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW[productId]?.[view];
  return configured ?? DEFAULT_ZONE_TEMPLATES;
}

// Maximale Zonen pro Bild-Index, aus Zone-Templates berechnet
export const MAX_ZONES_PER_IMAGE: readonly number[] = WORKWEAR_PRODUCTS.flatMap(
  (product) => {
    return WORKWEAR_VIEW_FILENAMES.map((fileName) => {
      const view = fileName.replace('.jpg', '') as WorkwearView;
      const templates =
        ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW[product.id]?.[view] ??
        DEFAULT_ZONE_TEMPLATES;
      return toValidZoneCount(templates.length);
    });
  },
);

export function getMaxZonesForImage(imageIndex: number): number {
  return MAX_ZONES_PER_IMAGE[imageIndex] ?? DEFAULT_ZONE_TEMPLATES.length;
}