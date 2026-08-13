import { merchants } from "@/lib/merchants";
import { getReachableMerchants, type ReachabilityResult } from "@/lib/domain/reachability";

export type Ticket = { date:string; dayLabel:string; departureStation:string; arrivalStation:string; departureTime:string; arrivalTime:string; train:string; passenger:string; car:string; seat:string; ticketNumber:string };
export const demoTicket: Ticket = { date:"2026.08.27", dayLabel:"목", departureStation:"부산", arrivalStation:"서울", departureTime:"14:58", arrivalTime:"17:48", train:"KTX 041", passenger:"어른 1명", car:"10호차 일반실", seat:"13A 순방향", ticketNumber:"82125-0813-10107-58" };
export const secondaryTicket: Ticket = { date:"2026.09.03", dayLabel:"목", departureStation:"서울", arrivalStation:"부산", departureTime:"08:10", arrivalTime:"10:55", train:"KTX 017", passenger:"어른 1명", car:"7호차 일반실", seat:"8B 순방향", ticketNumber:"82125-0903-10107-21" };
const configuredDemoTime = new Date("2026-08-27T11:38:00+09:00");
export function getAppNow(): Date { return configuredDemoTime; }
export function getTimeUntilDeparture(ticket: Ticket, now = getAppNow()): string { const departure = new Date(`${ticket.date.replaceAll(".", "-")}T${ticket.departureTime}:00+09:00`); const remainingMinutes = Math.max(0, Math.round((departure.getTime() - now.getTime()) / 60000)); return `${Math.floor(remainingMinutes / 60)}시간 ${remainingMinutes % 60}분`; }
export function getDemoReachability(safetyBufferMinutes = 15): ReachabilityResult[] {
  const departure = new Date(`${demoTicket.date.replaceAll(".", "-")}T${demoTicket.departureTime}:00+09:00`);
  return getReachableMerchants({ currentTime: getAppNow(), ticketDepartureTime: departure, currentLocation: demoTicket.departureStation, originStation: demoTicket.departureStation, merchants, safetyBufferMinutes });
}
export function getReachableMerchantCount(): number { return getDemoReachability().filter((result) => result.reachable).length; }
