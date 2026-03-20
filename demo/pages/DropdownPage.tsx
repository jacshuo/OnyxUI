import { useState } from "react";
import { Inbox, Send, Archive, Star, Trash2 } from "lucide-react";
import { Dropdown, Form, FormItem, type DropdownOption } from "../../src";
import { Section, PageTitle, CodeExample } from "./helpers";

const basicCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  placeholder="Pick a fruit…"
/>`;

const iconsCode = `const withIcons: DropdownOption[] = [
  { value: "inbox", label: "Inbox", icon: <Inbox /> },
  { value: "sent", label: "Sent", icon: <Send /> },
];
<Dropdown options={withIcons} value={icon} onChange={setIcon} />`;

const editableCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  placeholder="Type or select…"
  editable
/>`;

const alignCode = `<Dropdown
  options={fruits}
  value={selected}
  onChange={setSelected}
  align="right"
/>`;

const defaultValueCode = `{/* Uncontrolled with default */}
<Dropdown options={fruits} defaultValue="cherry" placeholder="Pick a fruit…" />`;

const defaultSelectedCode = `{/* Uncontrolled multi-select with defaults */}
<Dropdown
  options={fruits}
  multiple
  defaultSelected={["banana", "elderberry"]}
  placeholder="Pick fruits…"
/>`;

const multiCode = `<Dropdown
  options={fruits}
  multiple
  selected={selectedFruits}
  onSelectionChange={setSelectedFruits}
  placeholder="Pick fruits…"
/>`;

const multiEditableCode = `<Dropdown
  options={colors}
  multiple
  editable
  selected={selectedColors}
  onSelectionChange={setSelectedColors}
  onAddItem={(value) => {
    const key = value.toLowerCase().replace(/\\s+/g, "-");
    setColors((prev) => [...prev, { value: key, label: value }]);
    setSelectedColors((prev) => [...prev, key]);
  }}
/>`;

const editableSingleCode = `<Dropdown
  options={items}
  value={selected}
  onChange={setSelected}
  editable
  onAddItem={(value) => {
    const key = value.toLowerCase().replace(/\\s+/g, "-");
    setItems((prev) => [...prev, { value: key, label: value }]);
    setSelected(key);
  }}
/>`;

const cascadedCode = `{/* Each dropdown is controlled by the previous */}
<Dropdown options={keysToOptions(geoData)} value={country} onChange={setCountry} placeholder="Select country…" />
<Dropdown options={stateOptions} value={state} onChange={setState} disabled={!country} />
<Dropdown options={countyOptions} value={county} onChange={setCounty} disabled={!state} />
<Dropdown options={cityOptions} value={city} onChange={setCity} disabled={!county} />`;

const sizesCode = `<Dropdown options={fruits} size="sm" />
<Dropdown options={fruits} size="md" />
<Dropdown options={fruits} size="lg" />
// Available sizes: "sm" | "md" | "lg"`;

const fruits: DropdownOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "dragonfruit", label: "Dragon Fruit" },
  { value: "elderberry", label: "Elderberry" },
];

const withIcons: DropdownOption[] = [
  { value: "inbox", label: "Inbox", icon: <Inbox /> },
  { value: "sent", label: "Sent", icon: <Send /> },
  { value: "archive", label: "Archive", icon: <Archive /> },
  { value: "starred", label: "Starred", icon: <Star /> },
  { value: "trash", label: "Trash", icon: <Trash2 /> },
];

const defaultColors: DropdownOption[] = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "purple", label: "Purple" },
];

/* ── Cascaded geo data ─────────────────────────────────── */

interface GeoNode {
  [name: string]: GeoNode | null;
}

const geoData: GeoNode = {
  "United States": {
    California: {
      "Los Angeles County": {
        "Los Angeles": null,
        "Long Beach": null,
        Pasadena: null,
      },
      "San Francisco County": {
        "San Francisco": null,
        "Daly City": null,
      },
      "San Diego County": {
        "San Diego": null,
        "Chula Vista": null,
        Oceanside: null,
      },
    },
    Texas: {
      "Harris County": {
        Houston: null,
        Pasadena: null,
        Baytown: null,
      },
      "Dallas County": {
        Dallas: null,
        Irving: null,
        Garland: null,
      },
    },
    "New York": {
      "New York County": {
        Manhattan: null,
      },
      "Kings County": {
        Brooklyn: null,
      },
      "Erie County": {
        Buffalo: null,
        Cheektowaga: null,
      },
    },
  },
  Canada: {
    Ontario: {
      "York Region": {
        Toronto: null,
        Markham: null,
        "Richmond Hill": null,
      },
      "Ottawa Region": {
        Ottawa: null,
        Gatineau: null,
      },
    },
    "British Columbia": {
      "Metro Vancouver": {
        Vancouver: null,
        Burnaby: null,
        Surrey: null,
      },
    },
  },
  Australia: {
    "New South Wales": {
      "Sydney Region": {
        Sydney: null,
        Parramatta: null,
      },
    },
    Victoria: {
      "Melbourne Region": {
        Melbourne: null,
        Geelong: null,
      },
    },
  },
};

function keysToOptions(obj: GeoNode | null): DropdownOption[] {
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ value: k, label: k }));
}

export default function DropdownPage() {
  const [basic, setBasic] = useState<string>();
  const [icon, setIcon] = useState("inbox");
  const [editable, setEditable] = useState<string>();
  const [right, setRight] = useState<string>();

  // Multi-select state
  const [selectedFruits, setSelectedFruits] = useState<string[]>(["apple", "cherry"]);

  // Editable multi-select with add
  const [colors, setColors] = useState<DropdownOption[]>(defaultColors);
  const [selectedColors, setSelectedColors] = useState<string[]>(["blue"]);

  // Editable single-select with add
  const [editableItems, setEditableItems] = useState<DropdownOption[]>(fruits);
  const [editableSingle, setEditableSingle] = useState<string>();

  // Cascaded selection state
  const [country, setCountry] = useState<string>();
  const [state, setState] = useState<string>();
  const [county, setCounty] = useState<string>();
  const [city, setCity] = useState<string>();

  const stateOptions = country ? keysToOptions(geoData[country] as GeoNode) : [];
  const countyOptions =
    country && state ? keysToOptions((geoData[country] as GeoNode)?.[state] as GeoNode) : [];
  const cityOptions =
    country && state && county
      ? keysToOptions(((geoData[country] as GeoNode)?.[state] as GeoNode)?.[county] as GeoNode)
      : [];

  return (
    <div className="space-y-8">
      <PageTitle>Dropdown</PageTitle>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Basic">
          <Dropdown
            options={fruits}
            value={basic}
            onChange={setBasic}
            placeholder="Pick a fruit…"
          />{" "}
          <CodeExample code={basicCode} />{" "}
        </Section>

        <Section title="With icons & pre-selected">
          <Dropdown options={withIcons} value={icon} onChange={setIcon} />
          <CodeExample code={iconsCode} />
        </Section>

        <Section title="Editable (type to filter)">
          <Dropdown
            options={fruits}
            value={editable}
            onChange={setEditable}
            placeholder="Type or select…"
            editable
          />
          <CodeExample code={editableCode} />
        </Section>

        <Section title="Right-aligned menu">
          <Dropdown
            options={fruits}
            value={right}
            onChange={setRight}
            placeholder="Right align…"
            align="right"
          />
          <CodeExample code={alignCode} />
        </Section>

        <Section title="Default value (uncontrolled)">
          <Dropdown options={fruits} defaultValue="cherry" placeholder="Pick a fruit…" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Pre-selects &ldquo;Cherry&rdquo; without controlled state.
          </p>
          <CodeExample code={defaultValueCode} />
        </Section>

        <Section title="Default selected (uncontrolled multi)">
          <Dropdown
            options={fruits}
            multiple
            defaultSelected={["banana", "elderberry"]}
            placeholder="Pick fruits…"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Pre-selects &ldquo;Banana&rdquo; and &ldquo;Elderberry&rdquo; without controlled state.
          </p>
          <CodeExample code={defaultSelectedCode} />
        </Section>

        <Section title="Multi-select with checkboxes">
          <Dropdown
            options={fruits}
            multiple
            selected={selectedFruits}
            onSelectionChange={setSelectedFruits}
            placeholder="Pick fruits…"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {selectedFruits.length ? selectedFruits.join(", ") : <em>none</em>}
          </p>
          <CodeExample code={multiCode} />
        </Section>

        <Section title="Multi-select + editable + add items">
          <Dropdown
            options={colors}
            multiple
            editable
            selected={selectedColors}
            onSelectionChange={setSelectedColors}
            placeholder="Type to filter or add…"
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, "-");
              setColors((prev) => [...prev, { value: key, label: value }]);
              setSelectedColors((prev) => [...prev, key]);
            }}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {selectedColors.length ? selectedColors.join(", ") : <em>none</em>}
          </p>
          <CodeExample code={multiEditableCode} />
        </Section>

        <Section title="Editable + add items (single)">
          <Dropdown
            options={editableItems}
            value={editableSingle}
            onChange={setEditableSingle}
            editable
            placeholder="Type to filter or add…"
            onAddItem={(value) => {
              const key = value.toLowerCase().replace(/\s+/g, "-");
              setEditableItems((prev) => [...prev, { value: key, label: value }]);
              setEditableSingle(key);
            }}
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Type a name not in the list and press Enter to add it.
          </p>
          <CodeExample code={editableSingleCode} />
        </Section>
      </div>

      {/* ── Cascaded selection ─────────────────────── */}
      <Section title="Cascaded selection (Country → State → County → City)">
        <div className="max-w-lg">
          <Form layout="inline">
            <FormItem label="Country" required>
              <Dropdown
                options={keysToOptions(geoData)}
                value={country}
                onChange={(v) => {
                  setCountry(v);
                  const states = keysToOptions(geoData[v] as GeoNode);
                  const firstState = states[0]?.value;
                  setState(firstState);
                  const counties = firstState
                    ? keysToOptions((geoData[v] as GeoNode)?.[firstState] as GeoNode)
                    : [];
                  const firstCounty = counties[0]?.value;
                  setCounty(firstCounty);
                  const cities = firstCounty
                    ? keysToOptions(
                        ((geoData[v] as GeoNode)?.[firstState!] as GeoNode)?.[
                          firstCounty
                        ] as GeoNode,
                      )
                    : [];
                  setCity(cities[0]?.value);
                }}
                placeholder="Select country…"
              />
            </FormItem>
            <FormItem label="State / Province">
              <Dropdown
                options={stateOptions}
                value={state}
                onChange={(v) => {
                  setState(v);
                  const counties = keysToOptions((geoData[country!] as GeoNode)?.[v] as GeoNode);
                  const firstCounty = counties[0]?.value;
                  setCounty(firstCounty);
                  const cities = firstCounty
                    ? keysToOptions(
                        ((geoData[country!] as GeoNode)?.[v] as GeoNode)?.[firstCounty] as GeoNode,
                      )
                    : [];
                  setCity(cities[0]?.value);
                }}
                placeholder="Select state…"
                disabled={!country}
              />
            </FormItem>
            <FormItem label="County / Region">
              <Dropdown
                options={countyOptions}
                value={county}
                onChange={(v) => {
                  setCounty(v);
                  const cities = keysToOptions(
                    ((geoData[country!] as GeoNode)?.[state!] as GeoNode)?.[v] as GeoNode,
                  );
                  setCity(cities[0]?.value);
                }}
                placeholder="Select county…"
                disabled={!state}
              />
            </FormItem>
            <FormItem label="City">
              <Dropdown
                options={cityOptions}
                value={city}
                onChange={setCity}
                placeholder="Select city…"
                disabled={!county}
              />
            </FormItem>
          </Form>
        </div>
        {city && (
          <p className="mt-3 text-sm text-primary-600 dark:text-primary-400">
            Selected: <strong>{city}</strong>, {county}, {state}, {country}
          </p>
        )}
        <CodeExample code={cascadedCode} />
      </Section>

      <Section title="Sizes">
        <div className="grid gap-6 sm:grid-cols-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                {size}
              </p>
              <Dropdown options={fruits} placeholder={`${size} dropdown…`} size={size} />
            </div>
          ))}
        </div>
        <CodeExample code={sizesCode} />
      </Section>
    </div>
  );
}
