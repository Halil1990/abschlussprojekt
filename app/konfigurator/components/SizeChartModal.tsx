"use client";

import { useEffect, useMemo } from "react";

type SizeChartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FULL_SIZE_CHART_DATA = `ALLE GRÖSSEN UND PASSFORMEN AUF EINEN BLICK.

NORMALGRÖSSEN HERREN
Bestellgrößen	38	40	42	44	46	48	50	52	54	56	58	60	62	64	66
Inch waist	27	28	29	30	32	33	34	36	38	40	42	44	46	48	50
Inch inseam length	29	29	30	30	30	31	32	33	33	34	34	35	35	35	35
Körperhöhe	172-176	173-177	174-178	175-179	176-180	177-181	178-182	179-183	180-184	181-185	182-186	183-187	184-188	185-189	186-190
Brustumfang	74-77	78-81	82-85	86-89	90-93	94-97	98-102	103-106	107-110	111-114	115-118	119-122	123-126	127-130	131-134
Bundumfang	65-68	69-72	73-76	77-80	81-84	85-88	89-92	93-96	97-101	102-106	107-111	112-116	117-121	122-126	127-131
Hüftumfang	82-84	85-87	88-91	92-94	95-97	98-101	102-104	105-107	108-110	111-113	114-116	117-119	120-123	124-126	127-130
Schrittlänge Hosen	71	73	75	76	78	80	82	84	84	85	85	86	86	87	87
Schrittlänge Shorts		28	28	28	29	30	30	30	31	31	32	32	33	33	34
Schrittl. Shorts kurz			10	10	10	10	10	11	11	12			
Ärmellänge	58-60	60-62	60-62	61-63	61-63	62-64	63-65	64-66	65-67	66-68	66-68	67-69	67-69	67-69	67-69

SCHLANKE GRÖSSEN HERREN
Bestellgrößen	84	88	90	94	98	102	106	110	114	118
Inch waist	29	30	31	32	34	36	38	39	40	42
Inch inseam length	32	33	33	34	34	35	36	36	37	37
Körperhöhe	182-186	182-186	182-186	182-186	184-188	187-191	190-194	190-194	193-197	193-197
Brustumfang	82-85	86-89	90-93	94-97	98-102	103-106	105-110	111-114	115-118	119-122
Bundumfang	69-72	73-76	77-80	81-84	85-88	89-92	93-97	98-101	102-106	107-112
Hüftumfang	88-91	92-94	95-97	98-101	102-104	105-107	108-110	111-113	114-116	117-119
Schrittlänge	81	82	84	86	88	90	90	91	91	92
Ärmellänge	63-65	64-66	64-66	65-67	66-68	67-69	68-70	69-71	69-71	70-72

UNTERSETZTE GRÖSSEN HERREN
Bestellgrößen	19	20	21	22	23	24	25	26	27	28	29	30	31	32	33
Inch waist	28	30	31	32	33	34	36	38	40	42	44	46	47	48	50
Inch inseam length	27	28	28	29	32	30	31	31	32	32	32	33	33	34	34
Körperhöhe	166-171	166-171	166-171	166-171	166-171	166-171	168-173	172-174	174-176	175-177	176-178	177-179	178-180	179-181	180-182
Brustumfang	74-77	78-81	82-85	86-89	90-93	94-97	98-102	103-106	105-110	111-114	115-118	119-122	123-126	127-130	131-134
Bundumfang	68-71	72-76	77-80	81-84	85-88	89-92	93-96	97-101	102-106	107-111	112-116	117-121	122-126	127-131	132-136
Hüftumfang	82-84	85-87	88-91	92-94	95-97	98-101	102-104	105-107	108-110	111-113	114-116	117-119	120-123	124-126	127-130
Schrittlänge	68	70	72	73	75	77	79	81	81	82	82	83	83	84	84
Ärmellänge	56-58	58-60	58-60	59-61	59-61	60-62	61-63	62-64	63-65	64-66	64-66	65-67	65-67	65-67	65-67

KURZE UNTERSETZTE GRÖSSEN HERREN
Bestellgrößen	19K	20K	21K	22K	23K	24K	25K	26K	27K	28K	29K	30K	31K	32K	33K
Inch waist	28	30	31	32	33	34	36	38	40	42	44	46	47	48	50
Inch inseam length	25	26	26	27	27	28	29	29	30	30	30	31	31	32	32
Körperhöhe	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	157-167	168-173	168-173
Brustumfang	74-77	78-81	82-85	86-89	90-93	94-97	98-102	103-106	105-110	111-114	115-118	119-122	123-126	127-130	131-134
Bundumfang	68-71	72-76	77-80	81-84	85-88	89-92	93-96	97-101	102-106	107-111	112-116	117-121	122-126	127-131	132-136
Hüftumfang	82-84	85-87	88-91	92-94	95-97	98-101	102-104	105-107	108-110	111-113	114-116	117-119	120-123	124-126	127-130
Schrittlänge	63	65	67	68	70	72	74	76	76	77	77	78	78	79	79
Ärmellänge	56-58	58-60	58-60	59-61	59-61	60-62	61-63	62-64	63-65	64-66	64-66	65-67	65-67	65-67	65-67

NORMALGRÖSSEN DAMEN
Bestellgrößen	34	36	38	40	42	44	46	48	50	52	54
Inch waist	26	28	30	32	34	35	38	40	43	46	48
Inch inseam length	32	32	32	32	32	32	32	32	32	32	32
Körperhöhe	165-174	165-174	165-174	165-174	165-174	165-174	165-174	165-174	165-174	165-174	165-174
Brustumfang	82-85	86-89	90-93	94-97	98-102	103-107	108-113	114-119	120-125	126-131	132-137
Bundumfang	66-69	70-73	74-77	78-81	82-85	86-89	90-95	96-101	102-107	108-113	114-119
Hüftumfang	93-95	96-98	99-101	102-105	105-107	108-112	113-116	117-121	122-126	127-131	132-136
Schrittlänge	78	78	78	78	78	78	78	78	78	78	78
Ärmellänge	60-62	60-62	60-62	60-62	61-63	61-63	61-63	61-63	62-64	62-64	62-64

UNISEX GRÖSSENZUORDNUNG DAMEN UND HERREN
Bestellgröße Damen	XS	S	M	L	XL	XXL	3XL	4XL
Normale Größen	30/32	34/36	38/40	42/44	46/48	50/52	54/56	58/60
Bestellgröße Herren	XS	S	M	L	XL	XXL	3XL	4XL
Normale Größen	40/42	44/46	48/50	52/54	56/58	60/62	64/66	68/70
Schlanke Größen		88/90	94/98	102/106	110/114	118		
Untersetzte Größen		24	25/26	27/28	29			
Kragenweite		37/38	39/40	41/42	43/44	45/46	47/48	49/50

Umrechnungstabelle Damen / Herren
Damen	38	40	42	44	46	48	50	52	54
Herren	46	48	50	52	54	56	58	60	62

Umrechnungstabellen KÜBLER FOREST

Unisex regular
1 Körperhöhe	176-182	176-182	176-182	176-182	176-182	176-182	176-182	176-182
2 Brustumfang	78-84	86-93	94-102	103-110	111-118	119-126	127-134	135-142
3 Bundumfang	69-76	77-84	85-92	93-101	102-111	112-121	122-131	132-141
4 Hüftumfang	84-91	92-99	100-105	106-113	114-121	122-129	130-137	138-145
5 Schrittlänge	82	82	82	82	82	82	82	82
Bestellgröße Hose	XS-82	S-82	M-82	L-82	XL-82	2XL-82	3XL-82	4XL-82
Bestellgröße Jacke	XS	S	M	L	XL	2XL	3XL	4XL
Normale Größen	40/42	44/46	48/50	52/54	56/58	60/62	64/66	68/70

Unisex long
1 Körperhöhe	182-188	182-188	182-188	182-188	182-188	182-188	182-188	182-188
2 Brustumfang	78-84	86-93	94-102	103-110	111-118	119-126	127-134	135-142
3 Bundumfang	69-76	77-84	85-92	93-101	102-111	112-121	122-131	132-141
4 Hüftumfang	84-91	92-99	100-105	106-113	114-121	122-129	130-137	138-145
5 Schrittlänge	89	89	89	89	89	89	89	89
Bestellgröße Hose	XS-89	S-89	M-89	L-89	XL-89	2XL-89	3XL-89	4XL-89
Bestellgröße Jacke	XS	S	M	L	XL	2XL	3XL	4XL
Schlanke Größen	80/84	88/90	94/98	102/106	110/114	118/122	126/130	134/138

Unisex short
1 Körperhöhe	170-176	170-176	170-176	170-176	170-176	170-176	170-176	170-176
2 Brustumfang	78-84	86-93	94-102	103-110	111-118	119-126	127-134	135-142
3 Bundumfang	69-76	77-84	85-92	93-101	102-111	112-121	122-131	132-141
4 Hüftumfang	84-91	92-99	100-105	106-113	114-121	122-129	130-137	138-145
5 Schrittlänge	78	78	78	78	78	78	78	78
Bestellgröße Hose	XS-78	S-78	M-78	L-78	XL-78	2XL-78	3XL-78	4XL-78
Bestellgröße Jacke	XS	S	M	L	XL	2XL	3XL	4XL
Untersetzte Größen	20/21	22/23	24/25	26/27	28/29	30/31	32/33	34/35`;

type ParsedRow = {
  label: string;
  values: string[];
};

type ParsedSection = {
  title: string;
  rows: ParsedRow[];
};

function parseSizeChartData(rawData: string): {
  introLines: string[];
  sections: ParsedSection[];
} {
  const blocks = rawData
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const introLines: string[] = [];
  const sections: ParsedSection[] = [];

  blocks.forEach((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return;
    }

    const title = lines[0];
    const dataLines = lines.slice(1).filter((line) => line.includes("\t"));

    if (dataLines.length === 0) {
      introLines.push(title);
      return;
    }

    const rawRows = dataLines.map((line) => {
      const [label, ...values] = line.split("\t");
      return {
        label: label ?? "",
        values,
      };
    });

    const maxColumns = rawRows.reduce(
      (max, row) => Math.max(max, row.values.length),
      0,
    );

    const rows: ParsedRow[] = rawRows.map((row) => ({
      label: row.label,
      values: [...row.values, ...Array.from({ length: maxColumns - row.values.length }, () => "")],
    }));

    sections.push({ title, rows });
  });

  return { introLines, sections };
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const { introLines, sections } = useMemo(
    () => parseSizeChartData(FULL_SIZE_CHART_DATA),
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Größentabelle schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
      />

      <div className="relative z-10 max-h-[94vh] w-[98vw] max-w-425 overflow-y-auto rounded-3xl border border-slate-200/80 bg-[linear-gradient(160deg,#fafaf9,#f8fafc)] p-4 text-slate-800 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nordwerk x Partnergrößen
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
              Größentabelle für den Konfigurator
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Vollständige Übersicht mit allen gelieferten Größen und Passformen.
            </p>
            {introLines.length > 0 ? (
              <div className="mt-2 space-y-1">
                {introLines.map((line) => (
                  <p key={line} className="text-[11px] uppercase tracking-widest text-slate-500">
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 transition hover:bg-slate-100"
          >
            Schließen
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {sections.map((section) => {
            const [headerRow, ...bodyRows] = section.rows;

            return (
              <section key={section.title} className="rounded-xl border border-slate-200 bg-white/85 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  {section.title}
                </p>

                <div className="mt-2 rounded-lg border border-slate-200 bg-white">
                  <table className="w-full table-fixed text-left text-[10px] leading-4 text-slate-700 sm:text-[11px] sm:leading-5">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 text-slate-700">
                        <th className="sticky left-0 w-32 bg-slate-100 px-2 py-2 font-semibold sm:w-40 sm:px-3">
                          {headerRow?.label ?? "Merkmal"}
                        </th>
                        {(headerRow?.values ?? []).map((value, index) => (
                          <th key={section.title + "-head-" + index} className="px-1 py-2 font-semibold wrap-break-word sm:px-2">
                            {value || "-"}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bodyRows.map((row, rowIndex) => (
                        <tr key={section.title + "-row-" + rowIndex} className="border-b border-slate-100 even:bg-slate-50/50 last:border-b-0">
                          <td className="sticky left-0 w-32 bg-white px-2 py-2 font-semibold text-slate-800 wrap-break-word sm:w-40 sm:px-3">
                            {row.label}
                          </td>
                          {row.values.map((value, valueIndex) => (
                            <td key={section.title + "-cell-" + rowIndex + "-" + valueIndex} className="px-1 py-2 wrap-break-word sm:px-2">
                              {value || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Hinweis: Angaben ohne Gewähr. Bei Unsicherheit empfehlen wir vor Bestellung eine Anprobe.
        </p>
      </div>
    </div>
  );
}
