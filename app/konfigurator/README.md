# Workwear Konfigurator

Der Konfigurator ist für Arbeitskleidung mit festen Druckzonen.

## Was passiert hier?

Es gibt zwei Bereiche:

- Auswahl in [page.tsx](page.tsx)
  - Oben siehst du 4 Schritte
  - Darunter wählst du ein Produkt in [components/ProductSelectionSection.tsx](components/ProductSelectionSection.tsx)
- Konfiguration in [page.tsx](page.tsx)
  - Links: Upload, Material, Anfrage
  - Rechts: Vorschau mit festen Zonen

Die Zonen sind fest. Man kann sie nicht ziehen oder größer/kleiner machen.
Die Werte kommen aus [constants.ts](constants.ts) und werden in [utils/zoneCalculations.ts](utils/zoneCalculations.ts) genutzt.

## Funktionen

- Produkt wählen + Farbe wählen
- 4 Schritte:
  - Produkt auswählen
  - Konfigurieren
  - Anfrage senden
  - Angebot erhalten
- Logo per Drag & Drop auf eine Zone legen
- Logo drehen (in 5-Grad-Schritten)
- Logo aus Zone entfernen
- Entwurf für Kontaktformular erstellen
- Vorschau mit kleinen Bild-Buttons (Thumbnails)

## Wichtige Dateien

| Datei | Zweck |
|-------|------|
| [page.tsx](page.tsx) | Hauptseite vom Konfigurator |
| [constants.ts](constants.ts) | Produkte, Bilder, Farben, Zonen |
| [types.ts](types.ts) | Gemeinsame Typen |
| [workwearState.ts](workwearState.ts) | Speichert den Zustand pro Bild in der Session |
| [submission.ts](submission.ts) | Baut die Daten für den Versand |
| [submissionDraft.ts](submissionDraft.ts) | Entwurf für sessionStorage |

## Hooks

| Hook | Datei | Zweck |
|------|-------|------|
| [useZoneState](hooks/useZoneState.ts) | [hooks/useZoneState.ts](hooks/useZoneState.ts) | Auswahl und Änderungen an Zonen |
| [useAssetManagement](hooks/useAssetManagement.ts) | [hooks/useAssetManagement.ts](hooks/useAssetManagement.ts) | Upload und Asset-Zuordnung |
| [useWorkwearPersistence](hooks/useWorkwearPersistence.ts) | [hooks/useWorkwearPersistence.ts](hooks/useWorkwearPersistence.ts) | Zustand je Bild und Draft |

## Komponenten

| Komponente | Datei | Zweck |
|-----------|-------|------|
| [ProductSelectionSection](components/ProductSelectionSection.tsx) | [components/ProductSelectionSection.tsx](components/ProductSelectionSection.tsx) | Produktkarten und Farbwahl |
| [KonfiguratorSidebar](components/KonfiguratorSidebar.tsx) | [components/KonfiguratorSidebar.tsx](components/KonfiguratorSidebar.tsx) | Einstellungen links |
| [KonfiguratorPreview](components/KonfiguratorPreview.tsx) | [components/KonfiguratorPreview.tsx](components/KonfiguratorPreview.tsx) | Vorschau rechts |
| [WorkwearZone](components/WorkwearZone.tsx) | [components/WorkwearZone.tsx](components/WorkwearZone.tsx) | Einzelne Zone |
| [DraggableAssetCard](components/DraggableAssetCard.tsx) | [components/DraggableAssetCard.tsx](components/DraggableAssetCard.tsx) | Karte für Drag & Drop |
| [UploadModal](components/UploadModal.tsx) | [components/UploadModal.tsx](components/UploadModal.tsx) | Datei-Upload |
| [TutorialModal](components/TutorialModal.tsx) | [components/TutorialModal.tsx](components/TutorialModal.tsx) | Hilfe-Fenster |

## Zonen (kurz erklärt)

Zone-Daten stehen in [constants.ts](constants.ts):

- `ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW`
- `getZoneTemplatesForImage()`
- `getMaxZonesForImage()`

Eine Zone hat z. B. `x`, `y`, `w`, `h`, `rotation`, `assetId`.

## Verhalten und Speicher

- Kein LocalStorage für den normalen Ablauf
- Zustand bleibt in der laufenden Session im Speicher
- Draft wird erst beim Senden in sessionStorage gelegt

## So passt du Dinge an

### Zonen ändern

In [constants.ts](constants.ts) unter `ZONE_TEMPLATES_BY_PRODUCT_AND_VIEW`.

- `x` = links in Prozent
- `y` = oben in Prozent
- `w` = Breite in Prozent
- `h` = Höhe in Prozent

### Produktnamen in der Auswahl ändern

In [components/ProductSelectionSection.tsx](components/ProductSelectionSection.tsx) bei `productDisplayNames`.

### Farben der Auswahl ändern

In [constants.ts](constants.ts) bei `WORKWEAR_PREVIEW_COLORS`.

### Neue Produktansicht hinzufügen

In [constants.ts](constants.ts):

- Neues Produkt in `WORKWEAR_PRODUCTS`
- Bildpfade ergänzen
- Zonen-Templates ergänzen

### Rotationsschritte ändern

In [page.tsx](page.tsx) die Werte `-5` und `+5` anpassen.

## API-Routen

| Route | Zweck |
|-------|------|
| `POST /api/contact` | Kontaktformular senden |
| `POST /api/konfigurator/submit` | Konfiguration senden |

## Unterstützte Produkte

- Jacke
- Hose
- Latzhose
- Weste

Die Bildreihenfolge wird aus [WORKWEAR_PRODUCTS](constants.ts) und [WORKWEAR_VIEW_FILENAMES](constants.ts) gebaut.
