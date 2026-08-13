"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoOrder, merchantPackageTypes, ShippingPackagePayload } from "@/lib/shipping-package";

type FormState = { quantities: Record<string, number>; productCategory: string; iceBoxPackaging: boolean };
const initialState: FormState = { quantities: { STORE_BOX_S: 0, STORE_BOX_M: 0, STORE_BOX_L: 0 }, productCategory: "", iceBoxPackaging: false };
const normalizeQuantity = (value: string) => Math.max(0, Number.isFinite(Number(value)) ? Math.floor(Number(value)) : 0);

export default function SellerPackagePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { const saved = sessionStorage.getItem("seller-package-form"); if (saved) setForm(JSON.parse(saved) as FormState); setReady(true); }, []);
  useEffect(() => { if (ready) sessionStorage.setItem("seller-package-form", JSON.stringify(form)); }, [form, ready]);
  const setQuantity = (id: string, value: number) => setForm((current) => ({ ...current, quantities: { ...current.quantities, [id]: Math.max(0, Math.floor(value)) } }));
  const confirm = () => {
    if (!Object.values(form.quantities).some((quantity) => quantity > 0)) { setError("포장 박스를 1개 이상 선택해주세요."); return; }
    const payload: ShippingPackagePayload = { ...demoOrder, packages: merchantPackageTypes.filter((item) => form.quantities[item.id] > 0).map((item) => ({ merchantPackageTypeId: item.id, quantity: form.quantities[item.id] })), productCategory: form.productCategory, iceBoxPackaging: form.iceBoxPackaging };
    sessionStorage.setItem("shipping-package-payload", JSON.stringify(payload));
    router.push("/seller/qr");
  };
  return <main className="seller-shell seller-package-page">
    <header className="seller-header"><button aria-label="홈으로" onClick={() => router.push("/")}>⌂</button><h1>상품 정보 입력</h1><span /></header>
    <section className="seller-content"><h2>박스 크기 선택</h2><div className="package-grid">{merchantPackageTypes.map((item) => <article className="package-card" key={item.id}><div className={`box-illustration box-${item.label.toLowerCase()}`} aria-hidden="true"><i /><b /></div><strong>택배 박스<br />{item.label}</strong><div className="quantity-stepper"><button aria-label={`${item.label} 수량 감소`} onClick={() => setQuantity(item.id, form.quantities[item.id] - 1)}>−</button><input aria-label={`택배 박스 ${item.label} 수량`} inputMode="numeric" value={form.quantities[item.id]} onChange={(event) => setQuantity(item.id, normalizeQuantity(event.target.value))} /><button aria-label={`${item.label} 수량 증가`} onClick={() => setQuantity(item.id, form.quantities[item.id] + 1)}>+</button></div></article>)}</div><label className="category-select"><select aria-label="상품 카테고리" value={form.productCategory} onChange={(event) => setForm({ ...form, productCategory: event.target.value })}><option value="">상품 카테고리 선택</option><option>빵류</option><option>과자류</option><option>과일류</option></select></label><label className="icebox-check"><input type="checkbox" checked={form.iceBoxPackaging} onChange={(event) => setForm({ ...form, iceBoxPackaging: event.target.checked })} /><span>아이스박스 포장</span></label>{error && <p className="seller-validation" role="alert">{error}</p>}</section>
    <footer className="seller-actions"><button onClick={() => router.push("/")}>취소</button><button className="confirm" onClick={confirm}>확인 <span>›</span></button></footer>
  </main>;
}
