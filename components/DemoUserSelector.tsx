"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const scenarios = [
  {
    id: "eligible",
    title: "여행 사용자",
    description: "관광·검색·매장 탐색·구매 신호가 있어 알림이 표시되고 AI 추천을 실행합니다.",
  },
  {
    id: "ineligible",
    title: "비여행 사용자",
    description: "여행·배송 의도 신호가 없어 알림이 표시되지 않고 AI를 호출하지 않습니다.",
  },
] as const;

export function DemoUserSelector() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selectScenario = (scenario: typeof scenarios[number]["id"]) => {
    setOpen(false);
    router.push(`/a3?scenario=${scenario}&debug=1`);
  };

  return <div className="demo-user-control">
    {open && <section className="demo-user-panel" role="dialog" aria-label="데모 사용자 선택">
      <h2>데모 사용자 선택</h2>
      <p>선택하면 알림 화면에서 해당 사용자의 결과를 확인합니다.</p>
      {scenarios.map((scenario) => <button type="button" className="demo-user-option" key={scenario.id} onClick={() => selectScenario(scenario.id)}>
        <strong>{scenario.title}</strong>
        <span>{scenario.description}</span>
      </button>)}
    </section>}
    <button type="button" className="demo-user-entry" aria-expanded={open} onClick={() => setOpen((value) => !value)}>데모 사용자 선택</button>
  </div>;
}
