insert into public.merchants (id, name, region, station_id, category, opening_time, closing_time, is_partner, rail_shipping_enabled, packaging_available, app_order_available) values
  ('samjin-busan', '삼진어묵 부산역점', '부산', 'BUSAN', '어묵', '06:30', '20:00', true, true, true, true),
  ('leeheung', '이흥용과자점', '부산', 'BUSAN', '베이커리', '08:00', '21:00', true, true, true, true),
  ('giftshop', '부산기념품 편집샵', '부산', 'BUSAN', '기념품', '10:00', '20:00', false, true, true, false),
  ('haeundae', '해운대 어묵공방', '부산', 'BUSAN', '식품', '09:00', '20:00', true, true, true, true),
  ('busanbrew', '부산브루어리', '부산', 'BUSAN', '식품', '11:00', '21:00', true, true, true, true),
  ('market', '부산역 로컬마켓', '부산', 'BUSAN', '기념품', '10:00', '20:00', false, true, true, false),
  ('seaside', '바다소리 상점', '부산', 'BUSAN', '기념품', '10:00', '19:00', false, true, true, false),
  ('stationery', '초량 문구상회', '부산', 'BUSAN', '기념품', '11:00', '20:00', false, true, true, false),
  ('sungsimdang-daejeon', '성심당 대전역점', '대전', 'DAEJEON', '베이커리', '08:00', '22:00', true, true, true, true),
  ('gangneung-coffee', '강릉 커피거리', '강릉', 'GANGNEUNG', '식품', '09:00', '20:00', true, true, true, true)
on conflict (id) do update set name = excluded.name;

insert into public.merchant_package_types (id, merchant_id, name, length_cm, width_cm, height_cm, max_weight_kg) values
  ('STORE_BOX_S', 'samjin-busan', '택배 박스 S', 20, 15, 10, 2),
  ('STORE_BOX_M', 'samjin-busan', '택배 박스 M', 30, 22, 18, 5),
  ('STORE_BOX_L', 'samjin-busan', '택배 박스 L', 40, 30, 25, 10)
on conflict (id) do update set merchant_id = excluded.merchant_id;

insert into public.products (id, merchant_id, name, category, base_price, rail_shipping_enabled, station_pickup_available, quick_delivery_available, shipping_cutoff_at) values
  ('P001', 'samjin-busan', '부산어묵 종합선물세트', '식품', 20000, true, true, false, '2026-08-13T19:00:00+09:00'),
  ('samjin-sunmul', 'samjin-busan', '삼진어묵 선물세트', '먹거리', 18000, true, true, false, '2026-08-13T19:00:00+09:00'),
  ('samjin-premium', 'samjin-busan', '프리미엄 어묵세트', '선물', 28000, true, true, true, '2026-08-13T19:00:00+09:00'),
  ('samjin-jonghap', 'samjin-busan', '종합 선물세트', '선물', 35000, true, false, true, '2026-08-13T19:00:00+09:00'),
  ('sungsimdang-twigim', 'sungsimdang-daejeon', '튀김소보로 선물세트', '베이커리', 18000, true, true, false, '2026-08-13T19:00:00+09:00'),
  ('sungsimdang-cookie', 'sungsimdang-daejeon', '성심당 쿠키 세트', '베이커리', 15300, true, false, false, '2026-08-13T19:00:00+09:00'),
  ('sungsimdang-pie', 'sungsimdang-daejeon', '보문산 파이 세트', '먹거리', 21000, true, false, true, '2026-08-13T19:00:00+09:00'),
  ('gangneung-drip', 'gangneung-coffee', '강릉 드립백 커피', '먹거리', 13000, true, true, false, '2026-08-13T19:00:00+09:00')
on conflict (id) do update set merchant_id = excluded.merchant_id, name = excluded.name;

insert into public.railway_package_types (id, name, length_cm, width_cm, height_cm, max_weight_kg) values
  ('RAIL_MINI', '철도 배송 MINI', 28, 20, 15, 4),
  ('RAIL_STANDARD', '철도 배송 STANDARD', 45, 35, 30, 15),
  ('RAIL_LARGE', '철도 배송 LARGE', 65, 45, 40, 25)
on conflict (id) do update set name = excluded.name;

insert into public.orders (id, source, merchant_id, status, created_at) values
  ('ORDER-001', 'OFFLINE_QR', 'samjin-busan', 'PAID', '2026-08-13T14:20:00+09:00')
on conflict (id) do nothing;

insert into public.order_items (id, order_id, product_id, product_name, quantity, unit_price) values
  ('ORDER-001-ITEM-1', 'ORDER-001', 'P001', '부산어묵 종합선물세트', 2, 20000)
on conflict (id) do nothing;

insert into public.shipping_orders (id, order_id, recipient_name, recipient_phone, delivery_mode, destination_station, destination_address, selected_service, shipping_fee, status, created_at) values
  ('SHIPPING-ORDER-001', 'ORDER-001', '데모 고객', '010-0000-0000', 'PICKUP', '서울역', null, 'KTX_EXPRESS', 12000, 'IN_TRANSIT', '2026-08-13T14:20:00+09:00')
on conflict (id) do nothing;

insert into public.shipments (id, shipping_order_id, receipt_number, train_no, origin_station, destination_station, departure_at, arrival_at, tracking_status, current_station, created_at) values
  ('SHP-20260814-005', 'SHIPPING-ORDER-001', '20260813-0004821', 'KTX 005', '부산역', '서울역', '2026-08-14T09:00:00+09:00', '2026-08-14T11:42:00+09:00', 'IN_TRANSIT', '대전역', '2026-08-13T14:20:00+09:00')
on conflict (id) do nothing;

-- Demo-only AI personalization context. These rows do not represent production user data.
insert into public.trip_context_events (session_id, event_type, occurred_at, region, entity_id, metadata) values
  ('demo-traveler-001', 'VISITED_POI', '2026-08-27T09:30:00+09:00', '부산', null, '{"poiName":"해운대","category":"tourism"}'),
  ('demo-traveler-001', 'VISITED_POI', '2026-08-27T10:20:00+09:00', '부산', null, '{"poiName":"감천문화마을","category":"tourism"}'),
  ('demo-traveler-001', 'SEARCHED_PRODUCT', '2026-08-27T10:45:00+09:00', '부산', null, '{"query":"부산 부모님 선물"}'),
  ('demo-traveler-001', 'VIEWED_MERCHANT', '2026-08-27T11:00:00+09:00', '부산', 'samjin-busan', '{}'),
  ('demo-traveler-001', 'RETURN_TRIP_APPROACHING', '2026-08-27T11:38:00+09:00', '부산', null, '{"minutesUntilDeparture":120}')
on conflict do nothing;

-- Negative demo: no tourism, search, merchant-browsing, purchase, or shipping intent signals.
insert into public.trip_context_events (session_id, event_type, occurred_at, region, entity_id, metadata) values
  ('demo-nontraveler-001', 'SESSION_OPENED', '2026-08-27T11:38:00+09:00', null, null, '{"demo":true}')
on conflict do nothing;

insert into public.merchant_recommendation_profiles (merchant_id, summary, tags, signature_items, recommendation_contexts) values
  ('samjin-busan', '부산역 인근에서 부산 지역 먹거리와 선물 상품을 구매할 수 있는 제휴 매장', array['부산','먹거리','선물','부모님선물','지역상점'], array['부산 어묵 종합 선물세트','삼진 어묵 선물세트','프리미엄 어묵 세트'], array['귀가 전 선물','부산 기념품','가족 선물']),
  ('giftshop', '부산 지역 기념품과 로컬 굿즈를 둘러볼 수 있는 일반 등록 매장', array['부산','기념품','굿즈','지역상점'], array['부산 감성 굿즈 배송 가능','로컬 선물세트'], array['부산 기념품','여행 기념','가벼운 선물']),
  ('haeundae', '부산의 맛을 담은 선물 상품을 제공하는 제휴 매장', array['부산','식품','선물','지역상점'], array['벌꿀/수제청 선물세트'], array['가족 선물','부산 기념품','귀가 전 선물'])
on conflict (merchant_id) do update set
  summary = excluded.summary,
  tags = excluded.tags,
  signature_items = excluded.signature_items,
  recommendation_contexts = excluded.recommendation_contexts;
