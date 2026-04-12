# Workwear Konfigurator

Konfigurator für Workwear-Produkte mit festen, template-basierten Zonen pro Produktansicht.

## Überblick

Der Konfigurator ist in zwei Bereiche aufgeteilt:

- Links: Asset-Auswahl, Zonen-Auswahl, Rotation, Material und Anfrage-Flow
- Rechts: Produktvorschau mit festen Zonen und Thumbnail-Navigation

Zonen sind nicht mehr per Drag/Resize veränderbar. Ihre Position, Größe und Anzahl werden zentral in [constants.ts](constants.ts) definiert und in [utils/zoneCalculations.ts](utils/zoneCalculations.ts) daraus erzeugt.

## Features

- Drag & Drop von Logos auf feste Zonen
- Rotation in 5°-Schritten
- Entfernen von Assets aus einer Zone
- Pro Bildansicht konfigurierbare Zonenanzahl
- Pro Zone konfigurierbare Position und Größe
- Draft-Erstellung für das Kontaktformular
- Preview-Ansicht mit Thumbnail-Navigation

## Struktur

### Kern-Dateien

| Datei | Beschreibung |
|-------|-------------|
| [page.tsx](page.tsx) | Orchestriert Hook-State, Sidebar und Preview |
| [constants.ts](constants.ts) | Produktdaten, Bildpfade, Zonen-Templates und Zonenanzahl pro Bild |
| [types.ts](types.ts) | Gemeinsame Typen wie Asset, ZoneRectangle und PrintMaterial |
| [workwearState.ts](workwearState.ts) | Normalisierung und Wiederherstellung des In-Memory-Zone-States |
| [submission.ts](submission.ts) | Erzeugung der Snapshots vor dem Versand |
| [submissionDraft.ts](submissionDraft.ts) | Draft-Struktur für sessionStorage |

### Hooks

| Hook | Datei | Beschreibung |
|------|-------|-------------|
| [useZoneState](hooks/useZoneState.ts) | [hooks/useZoneState.ts](hooks/useZoneState.ts) | Zone-Auswahl, Rotation und Zonen-Updates |
| [useAssetManagement](hooks/useAssetManagement.ts) | [hooks/useAssetManagement.ts](hooks/useAssetManagement.ts) | Upload, Asset-Zuordnung und Cleanup |
| [useWorkwearPersistence](hooks/useWorkwearPersistence.ts) | [hooks/useWorkwearPersistence.ts](hooks/useWorkwearPersistence.ts) | In-Memory-State pro Bild und Draft-Erstellung |

### Komponenten

| Komponente | Datei | Beschreibung |
|-----------|-------|-------------|
| [KonfiguratorSidebar](components/KonfiguratorSidebar.tsx) | [components/KonfiguratorSidebar.tsx](components/KonfiguratorSidebar.tsx) | Controls, Upload, Material und Anfrage |
| [KonfiguratorPreview](components/KonfiguratorPreview.tsx) | [components/KonfiguratorPreview.tsx](components/KonfiguratorPreview.tsx) | Produktvorschau und Zonen-Rendering |
| [WorkwearZone](components/WorkwearZone.tsx) | [components/WorkwearZone.tsx](components/WorkwearZone.tsx) | Eine einzelne feste Zone mit Asset-Buttons |
| [DraggableAssetCard](components/DraggableAssetCard.tsx) | [components/DraggableAssetCard.tsx](components/DraggableAssetCard.tsx) | Draggbare Asset-Karte |
| [ProductSelectionSection](components/ProductSelectionSection.tsx) | [components/ProductSelectionSection.tsx](components/ProductSelectionSection.tsx) | Produkt-Auswahl |
| [UploadModal](components/UploadModal.tsx) | [components/UploadModal.tsx](components/UploadModal.tsx) | Datei-Upload |

## Zonen-Modell

### ZoneRectangle

```typescript
{
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  rotation: number;
  assetId: string | null;
  artworkOffset: Point;
}
```

### Template-Quelle

Die aktive Zone-Konfiguration pro Bild kommt aus:

- [ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW](constants.ts)
- [getZoneTemplatesForImage()](constants.ts)
- [getMaxZonesForImage()](constants.ts)

Die Zonen werden in [createZone()](utils/zoneCalculations.ts) aus den Templates erzeugt und in [workwearState.ts](workwearState.ts) auf die aktive Ansicht normalisiert.

## Verhalten

- Keine Drag-/Resize-Bedienung für Zonen
- Keine LocalStorage-Persistenz für den Zone-Stand
- Der aktuelle Workwear-Stand bleibt während der Session im Speicher, damit das Wechseln zwischen Ansichten funktioniert
- Drafts werden nur beim Absenden in sessionStorage abgelegt

## Anpassungen

### 1. Zonen für ein Bild ändern

In [constants.ts](constants.ts) in `ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW`.

Jeder Eintrag ist eine Zone mit:

- `x` = Position links in Prozent
- `y` = Position oben in Prozent
- `w` = Breite in Prozent
- `h` = Höhe in Prozent

Die Anzahl der Einträge bestimmt direkt die Anzahl der Zonen pro Bild.

### 2. Zonenanzahl pro Bild ändern

Auch in [constants.ts](constants.ts) über die Länge des jeweiligen Template-Arrays.

Beispiel:

```typescript
jacke: {
  vorne: [
    { x: 27, y: 37, w: 12, h: 7.2 },
  ],
  hinten: [
    { x: 47, y: 18, w: 8, h: 2.7 },
    { x: 24, y: 28, w: 52, h: 34.7 },
  ],
}
```

### 3. Neue Produktansicht hinzufügen

Anpassung in [constants.ts](constants.ts):

- Produkt in `WORKWEAR_PRODUCTS` ergänzen
- Passende Bildpfade in `WORKWEAR_VIEW_FILENAMES` oder im Storage-Layout bereitstellen
- Templates in `ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW` definieren

### 4. Rotation anpassen

In [page.tsx](page.tsx) werden die Buttons mit `-5` und `+5` Grad verbunden.

### 5. Preview-Styling ändern

Die visuelle Gestaltung der Vorschau liegt in [components/KonfiguratorPreview.tsx](components/KonfiguratorPreview.tsx). Sie nutzt bewusst dieselbe Card-Sprache wie die Sidebar.

## API-Routen

| Route | Beschreibung |
|-------|-------------|
| `POST /api/contact` | Kontaktformular absenden |
| `POST /api/konfigurator/submit` | Konfiguration absenden |

## Persistenz

- Kein LocalStorage für den Konfigurator-Workflow
- sessionStorage nur für den Draft vor dem Absenden

## Workwear-Produkte

Aktuell unterstützt:

- Jacke
- Hose
- Latzhose
- Weste

Die Bild-Reihenfolge wird aus [WORKWEAR_PRODUCTS](constants.ts) und [WORKWEAR_VIEW_FILENAMES](constants.ts) zusammengesetzt.

## Styling

Der Konfigurator verwendet eine konsistente Kartenoptik mit:

- dunklen, leicht verlaufenden Hintergründen
- weißen Borders mit Transparenz
- Orange als Akzentfarbe
- abgerundeten Cards und kontrollierten Schatten

Die zentrale Tailwind-Optik liegt in [components/KonfiguratorSidebar.tsx](components/KonfiguratorSidebar.tsx) und [components/KonfiguratorPreview.tsx](components/KonfiguratorPreview.tsx).

## Hinweise

- [types.ts](types.ts) enthält keine Drag-/Resize-State-Typen mehr
- [utils/zoneCalculations.ts](utils/zoneCalculations.ts) arbeitet direkt mit den Zone-Templates
- Alte Backup- und Doku-Reste wie [page.tsx.bak](page.tsx.bak) wurden nicht automatisch entfernt

💡 Tipp: Mit Cmd/Ctrl+Click auf die Links kannst du direkt in die jeweiligen Dateien springen.
