// components/inventory/DeviceDetailsModal.tsx
// ─────────────────────────────────────────────
// Full device add/edit modal — uses ONLY reusable BMZ UI components.
// Checkbox, RangeSlider are in Input.tsx | Select, Input, Textarea also from Input.tsx
// ─────────────────────────────────────────────

import { useState, type JSX } from "react";
import { ImageIcon } from "lucide-react";
import { Modal }     from "../ui/Modal";
import { Button }    from "../ui/Button";
import { Input, Select, Textarea, Checkbox, RangeSlider } from "../ui";

// ── Types ─────────────────────────────────────
export type DeviceCondition   = "new" | "used" | "open-box" | "refurbished";
export type PTAStatus         = "approved" | "pending" | "blocked" | "unknown";
export type NetworkLockStatus = "unlocked" | "locked" | "unknown";
export type StockStatus       = "available" | "low" | "out-of-stock" | "reserved";

export interface ICreateDeviceRequest {
  imei1: string; imei2?: string; tacCode: string; serialNumber: string;
  brand: string; model: string; variant: string; color: string;
  countryVersion: string; ptaStatus: PTAStatus; networkLockStatus: NetworkLockStatus;
  condition: DeviceCondition;
  batteryHealth: number; screenCondition: string; cameraCondition: string;
  speakerCondition: string; chargingCondition: string; faceIdStatus: string;
  fingerprintStatus: string; waterpakStatus: string;
  purchasePrice: number; sellingPrice: number; supplierName: string;
  purchaseDate: string; invoiceNumber: string; warrantyDays: number;
  quantity: number; stockStatus: StockStatus; shelfLocation: string; notes: string;
  accessories: { box:boolean; charger:boolean; cable:boolean; earphones:boolean; cover:boolean; protector:boolean; };
  images: { front?: string; back?: string; invoice?: string; };
}

// ── Option lists ──────────────────────────────
const BRANDS = ["Apple","Samsung","Xiaomi","OnePlus","Huawei","Oppo","Vivo","Realme","Motorola","Nothing","Google","Other"].map(b=>({value:b,label:b}));
const CONDITION_OPTS = [{value:"new",label:"New ✨"},{value:"open-box",label:"Open Box 📦"},{value:"used",label:"Used 🔄"},{value:"refurbished",label:"Refurbished 🛠️"}];
const SCREEN_OPTS    = [{value:"perfect",label:"Perfect"},{value:"minor-scratches",label:"Minor Scratches"},{value:"major-damage",label:"Major Damage"},{value:"broken",label:"Broken"}];
const SPEAKER_OPTS   = [{value:"working",label:"Working"},{value:"partial",label:"Partial"},{value:"not-working",label:"Not Working"}];
const FACEID_OPTS    = [{value:"working",label:"Working"},{value:"not-available",label:"Not Available"},{value:"not-working",label:"Not Working"}];
const PTA_OPTS       = [{value:"approved",label:"Approved ✅"},{value:"pending",label:"Pending ⏳"},{value:"blocked",label:"Blocked 🚫"},{value:"unknown",label:"Unknown ❓"}];
const NETWORK_OPTS   = [{value:"unlocked",label:"Unlocked 🔓"},{value:"locked",label:"Locked 🔒"},{value:"unknown",label:"Unknown ❓"}];
const COUNTRY_OPTS   = [{value:"Pakistan",label:"🇵🇰 Pakistan"},{value:"Global",label:"🌍 Global"},{value:"USA",label:"🇺🇸 USA"},{value:"EU",label:"🇪🇺 EU"},{value:"China",label:"🇨🇳 China"},{value:"UAE",label:"🇦🇪 UAE"}];
const STOCK_OPTS     = [{value:"available",label:"Available ✅"},{value:"low",label:"Low Stock ⚠️"},{value:"out-of-stock",label:"Out of Stock ❌"},{value:"reserved",label:"Reserved 🔒"}];
const WATERPAK_OPTS  = [{value:"present",label:"Present ✅"},{value:"absent",label:"Absent ❌"},{value:"damaged",label:"Damaged 🔴"}];
const ACCESSORY_LABELS: Record<string,string> = {box:"📦 Original Box",charger:"🔌 Charger",cable:"🔗 Cable",earphones:"🎧 Earphones",cover:"🛡️ Cover/Case",protector:"📱 Screen Protector"};

// ── Image Uploader ────────────────────────────
function ImageUploader({ label, preview, onSelect }:{ label:string; preview?:string; onSelect:(b64:string)=>void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onSelect(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-300">{label}</label>
      <label className="block cursor-pointer">
        <div className={["relative w-full h-28 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200",preview?"border-purple-500/40":"border-white/15 hover:border-yellow-400/40 hover:bg-yellow-400/5"].join(" ")}>
          {preview ? <img src={preview} alt={label} className="w-full h-full object-cover" /> : (
            <div className="flex flex-col items-center gap-2 text-gray-500"><ImageIcon size={24}/><span className="text-xs">Click to upload</span></div>
          )}
        </div>
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>
    </div>
  );
}

// ── Default form ──────────────────────────────
const defaultForm = (imei="",tac="",brand=""): ICreateDeviceRequest => ({
  imei1:imei, imei2:"", tacCode:tac, serialNumber:imei.slice(8,14),
  brand, model:"", variant:"", color:"", countryVersion:"",
  ptaStatus:"unknown", networkLockStatus:"unknown", condition:"new",
  batteryHealth:100, screenCondition:"perfect", cameraCondition:"perfect",
  speakerCondition:"working", chargingCondition:"working", faceIdStatus:"working",
  fingerprintStatus:"working", waterpakStatus:"present",
  purchasePrice:0, sellingPrice:0, supplierName:"",
  purchaseDate:new Date().toISOString().slice(0,10), invoiceNumber:"", warrantyDays:0,
  quantity:1, stockStatus:"available", shelfLocation:"", notes:"",
  accessories:{box:true,charger:true,cable:true,earphones:false,cover:false,protector:false},
  images:{},
});

type TabId = "basic"|"condition"|"pricing"|"inventory"|"accessories"|"media";
const TABS: {id:TabId;label:string;icon:string}[] = [
  {id:"basic",label:"Basic",icon:"📱"},{id:"condition",label:"Condition",icon:"🔧"},
  {id:"pricing",label:"Pricing",icon:"💰"},{id:"inventory",label:"Inventory",icon:"📦"},
  {id:"accessories",label:"Accessories",icon:"✨"},{id:"media",label:"Media",icon:"📸"},
];

// ── Main modal ────────────────────────────────
interface Props { open:boolean; onClose:()=>void; onSave:(d:ICreateDeviceRequest)=>void; initialIMEI?:string; initialTAC?:string; initialBrand?:string; }

export function DeviceDetailsModal({ open, onClose, onSave, initialIMEI="", initialTAC="", initialBrand="" }: Props) {
  const [tab,    setTab]    = useState<TabId>("basic");
  const [form,   setForm]   = useState<ICreateDeviceRequest>(()=>defaultForm(initialIMEI,initialTAC,initialBrand));
  const [errors, setErrors] = useState<Record<string,string>>({});

  const set = <K extends keyof ICreateDeviceRequest>(key:K, val:ICreateDeviceRequest[K]) =>
    setForm(prev=>({...prev,[key]:val}));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.brand) e.brand="Brand is required";
    if (!form.model) e.model="Model is required";
    if (!form.imei1||form.imei1.length!==15) e.imei1="IMEI must be 15 digits";
    if (form.purchasePrice<=0) e.purchasePrice="Enter valid price";
    if (form.sellingPrice<=0)  e.sellingPrice="Enter valid price";
    setErrors(e);
    if (e.imei1||e.brand||e.model) setTab("basic");
    else if (e.purchasePrice||e.sellingPrice) setTab("pricing");
    return Object.keys(e).length===0;
  };

  const handleSubmit = (e:React.FormEvent) => { e.preventDefault(); if(validate()){onSave(form);handleClose();} };
  const handleClose  = () => { setForm(defaultForm(initialIMEI,initialTAC,initialBrand)); setErrors({}); setTab("basic"); onClose(); };

  const profit = form.sellingPrice - form.purchasePrice;
  const margin = form.purchasePrice>0 ? ((profit/form.purchasePrice)*100).toFixed(1) : "0";

  const tabErrors: Record<TabId,number> = {
    basic:(errors.imei1?1:0)+(errors.brand?1:0)+(errors.model?1:0),
    condition:0, pricing:(errors.purchasePrice?1:0)+(errors.sellingPrice?1:0),
    inventory:0, accessories:0, media:0,
  };

  const panels: Record<TabId, JSX.Element> = {
    basic: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="IMEI 1" required placeholder="357391089012345"
            value={form.imei1} error={errors.imei1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("imei1",e.target.value.replace(/\D/g,"").slice(0,15))}
            suffix={<span className={`text-[10px] font-mono ${form.imei1.length===15?"text-green-400":"text-gray-500"}`}>{form.imei1.length}/15</span>}
          />
          <Input label="IMEI 2 (Dual SIM)" placeholder="Optional"
            value={form.imei2||""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>set("imei2",e.target.value.replace(/\D/g,"").slice(0,15))}
            suffix={<span className={`text-[10px] font-mono ${(form.imei2?.length??0)===15?"text-green-400":"text-gray-500"}`}>{form.imei2?.length??0}/15</span>}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="TAC Code"    value={form.tacCode}               readOnly hint="Auto from IMEI" />
          <Input label="Serial No."  value={form.serialNumber}           readOnly hint="Auto from IMEI" />
          <Input label="Check Digit" value={form.imei1.slice(14)||"—"}  readOnly hint="Auto from IMEI" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Select label="Brand" required options={BRANDS} placeholder="Select brand"
            value={form.brand} error={errors.brand} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("brand",e.target.value)} />
          <Input label="Model" required placeholder="iPhone 15 Pro"
            value={form.model} error={errors.model} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("model",e.target.value)} />
          <Input label="Variant" placeholder="8GB / 256GB"
            value={form.variant} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("variant",e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Color" placeholder="Natural Titanium"
            value={form.color} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("color",e.target.value)} />
          <Select label="Country Version" options={COUNTRY_OPTS} placeholder="Select"
            value={form.countryVersion} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("countryVersion",e.target.value)} />
          <Select label="Network Lock" options={NETWORK_OPTS}
            value={form.networkLockStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("networkLockStatus",e.target.value as NetworkLockStatus)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="PTA Status" options={PTA_OPTS}
            value={form.ptaStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("ptaStatus",e.target.value as PTAStatus)} />
          <Select label="Condition" options={CONDITION_OPTS}
            value={form.condition} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>set("condition",e.target.value as DeviceCondition)} />
        </div>
      </div>
    ),

    condition: (
      <div className="space-y-5">
        <RangeSlider label="Battery Health" value={form.batteryHealth} onChange={(v: number)=>set("batteryHealth",v)} unit="%" />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Screen"        options={SCREEN_OPTS}  value={form.screenCondition}   onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("screenCondition",  e.target.value)} />
          <Select label="Camera"        options={SCREEN_OPTS}  value={form.cameraCondition}   onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("cameraCondition",  e.target.value)} />
          <Select label="Speaker"       options={SPEAKER_OPTS} value={form.speakerCondition}  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("speakerCondition", e.target.value)} />
          <Select label="Charging Port" options={SPEAKER_OPTS} value={form.chargingCondition} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("chargingCondition",e.target.value)} />
          <Select label="Face ID"       options={FACEID_OPTS}  value={form.faceIdStatus}      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("faceIdStatus",     e.target.value)} />
          <Select label="Fingerprint"   options={FACEID_OPTS}  value={form.fingerprintStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("fingerprintStatus",e.target.value)} />
        </div>
        <Select label="Waterproof / Waterpak" options={WATERPAK_OPTS}
          value={form.waterpakStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>set("waterpakStatus",e.target.value)} />
      </div>
    ),

    pricing: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input label="Purchase Price" required type="number" prefix="₨" placeholder="0"
            value={form.purchasePrice||""} error={errors.purchasePrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("purchasePrice",parseFloat(e.target.value)||0)} />
          <Input label="Selling Price" required type="number" prefix="₨" placeholder="0"
            value={form.sellingPrice||""} error={errors.sellingPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("sellingPrice",parseFloat(e.target.value)||0)} />
          <Input label="Warranty (Days)" type="number" placeholder="0"
            value={form.warrantyDays||""} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("warrantyDays",parseInt(e.target.value)||0)} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Supplier Name" placeholder="Ali Traders"
            value={form.supplierName} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("supplierName",e.target.value)} />
          <Input label="Purchase Date" type="date"
            value={form.purchaseDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("purchaseDate",e.target.value)} />
          <Input label="Invoice Number" placeholder="INV-001"
            value={form.invoiceNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("invoiceNumber",e.target.value)} />
        </div>
        {form.purchasePrice>0 && form.sellingPrice>0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-600/10 to-emerald-600/5 border border-green-500/20">
            <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-3">Profit Summary</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-gray-400 text-xs">Profit / Unit</p><p className={`font-black text-lg ${profit>=0?"text-green-400":"text-red-400"}`}>₨{profit.toLocaleString()}</p></div>
              <div><p className="text-gray-400 text-xs">Margin</p><p className={`font-black text-lg ${Number(margin)>=0?"text-green-400":"text-red-400"}`}>{margin}%</p></div>
              <div><p className="text-gray-400 text-xs">Stock Value</p><p className="text-white font-black text-lg">₨{(form.sellingPrice*form.quantity).toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>
    ),

    inventory: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Quantity" type="number"
            value={form.quantity} onChange={e=>set("quantity",Math.max(1,parseInt(e.target.value)||1))} />
          <Select label="Stock Status" options={STOCK_OPTS}
            value={form.stockStatus} onChange={e=>set("stockStatus",e.target.value as StockStatus)} />
        </div>
        <Input label="Shelf / Rack Location" placeholder="Rack A1, Shelf B3"
          value={form.shelfLocation} onChange={e=>set("shelfLocation",e.target.value)} />
        <Textarea label="Notes" placeholder="Any notes about this device..." rows={4}
          value={form.notes} onChange={e=>set("notes",e.target.value)} />
      </div>
    ),

    accessories: (
      <div className="space-y-2">
        <p className="text-gray-400 text-sm mb-3">Select all accessories included with the device.</p>
        {(Object.keys(form.accessories) as (keyof typeof form.accessories)[]).map(key=>(
          <Checkbox key={key} label={ACCESSORY_LABELS[key]??key} checked={form.accessories[key]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>set("accessories",{...form.accessories,[key]:e.target.checked})} />
        ))}
      </div>
    ),

    media: (
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">Upload device photos and invoice for records.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ImageUploader label="📱 Front"   preview={form.images.front}   onSelect={b64=>set("images",{...form.images,front:b64})} />
          <ImageUploader label="📱 Back"    preview={form.images.back}    onSelect={b64=>set("images",{...form.images,back:b64})} />
          <ImageUploader label="🧾 Invoice" preview={form.images.invoice} onSelect={b64=>set("images",{...form.images,invoice:b64})} />
        </div>
      </div>
    ),
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Device to Inventory"
      subtitle="Device data is pre-filled from IMEI scan. Complete remaining fields." size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-3 border-b border-white/8 -mx-1 px-1">
          {TABS.map(t=>(
            <button key={t.id} type="button" onClick={()=>setTab(t.id)}
              className={["relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all duration-200 flex-shrink-0",
                tab===t.id?"bg-yellow-400/15 text-yellow-400 border border-yellow-400/25":"text-gray-400 hover:text-white hover:bg-white/6 border border-transparent"].join(" ")}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {tabErrors[t.id]>0&&<span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">{tabErrors[t.id]}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[300px] max-h-[55vh] overflow-y-auto pr-0.5">
          {panels[tab]}
        </div>

        {/* Footer */}
        <Modal.Footer align="between">
          {/* Dot progress */}
          <div className="flex items-center gap-1.5">
            {TABS.map(t=>(
              <div key={t.id} onClick={()=>setTab(t.id)}
                className={["h-1 rounded-full transition-all duration-300 cursor-pointer",tab===t.id?"w-5 bg-yellow-400":"w-1.5 bg-white/15 hover:bg-white/30"].join(" ")} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={handleClose}>Cancel</Button>
            {TABS.findIndex(t=>t.id===tab)>0&&(
              <Button variant="dark" size="sm" type="button"
                onClick={()=>{const i=TABS.findIndex(t=>t.id===tab);if(i>0)setTab(TABS[i-1].id);}}>← Back</Button>
            )}
            {tab!=="media"?(
              <Button variant="secondary" size="sm" type="button"
                onClick={()=>{const i=TABS.findIndex(t=>t.id===tab);if(i<TABS.length-1)setTab(TABS[i+1].id);}}>Next →</Button>
            ):(
              <Button variant="primary" size="sm" type="submit">Save Device ✓</Button>
            )}
            {tab!=="media"&&<Button variant="primary" size="sm" type="submit">Save</Button>}
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default DeviceDetailsModal;