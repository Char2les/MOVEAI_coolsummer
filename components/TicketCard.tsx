import { Ticket } from "@/lib/demo-context";

export function TicketCard({ ticket, compact = false }: { ticket: Ticket; compact?: boolean }) {
  return (
    <section className={compact ? "ticket-card compact" : "ticket-card"} aria-label="기차 승차권">
      <div className="ticket-blue-head">
        <span>{ticket.date} ({ticket.dayLabel})</span>
        <span>{compact ? "14일 전" : "기차 승차권 1매"}</span>
      </div>
      <div className="ticket-main">
        {compact && <div className="ticket-kind"><strong>기차 승차권</strong><span>1매</span></div>}
        <div className="route-row">
          <div><strong>{ticket.departureStation}</strong><b>{ticket.departureTime}</b></div>
          <span className="route-arrow">→</span>
          <div><strong>{ticket.arrivalStation}</strong><b>{ticket.arrivalTime}</b></div>
        </div>
        {!compact && <TicketDetails ticket={ticket} />}
      </div>
    </section>
  );
}

function TicketDetails({ ticket }: { ticket: Ticket }) {
  return <>
    <div className="train-line"><strong>{ticket.train}</strong><span>15분 전 안내</span></div>
    <div className="ticket-actions"><button>차내시설</button><button>열차 위치</button><button className="board">타는곳 ↻</button></div>
    <div className="passenger-box"><span>{ticket.passenger}</span><div><p>호차</p><strong>{ticket.car}</strong></div><div><p>좌석</p><strong>{ticket.seat}</strong></div></div>
    <div className="ticket-action-row"><button>승차권변경</button><button>전달하기</button><button>환불받기</button></div>
    <div className="ticket-number"><div><span>승차권 번호 ⧉</span><strong>{ticket.ticketNumber}</strong><small>영수증 보기　›</small></div><div className="qr" aria-label="승차권 QR 코드">▦</div></div>
  </>;
}
