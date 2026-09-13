-- =============================================================================
-- Seed: 8-Person, 1-Hour Meeting — "Q3 Product Strategy"
-- Run AFTER migrations 001-003 and after creating a test user in Supabase Auth.
-- Replace 'YOUR_USER_UUID_HERE' with your actual auth user UUID.
-- =============================================================================

-- Adjust this to your test user's UUID from Supabase Auth
DO $$
DECLARE
  v_user_id uuid := 'YOUR_USER_UUID_HERE';
  v_meeting_id uuid := gen_random_uuid();
  v_summary_id uuid := gen_random_uuid();
BEGIN

-- Insert meeting
INSERT INTO meetings (
  id, user_id, title, source, status,
  started_at, ended_at, duration_seconds,
  participant_count, participants, created_at, updated_at
) VALUES (
  v_meeting_id,
  v_user_id,
  'Q3 Product Strategy',
  'google_meet',
  'complete',
  now() - interval '2 days' + interval '14 hours',
  now() - interval '2 days' + interval '15 hours' + interval '2 minutes',
  3720,
  8,
  '[
    {"name": "Muhammad Ali", "email": "muhammad@company.com"},
    {"name": "Sarah Chen", "email": "sarah@company.com"},
    {"name": "James Okafor", "email": "james@company.com"},
    {"name": "Priya Sharma", "email": "priya@company.com"},
    {"name": "David Park", "email": "david@company.com"},
    {"name": "Aisha Malik", "email": "aisha@company.com"},
    {"name": "Tom Brennan", "email": "tom@company.com"},
    {"name": "Lena Fischer", "email": "lena@company.com"}
  ]'::jsonb,
  now() - interval '2 days',
  now() - interval '2 days'
);

-- Insert transcript segments (realistic 58-minute meeting)
INSERT INTO transcript_segments (meeting_id, user_id, speaker, text, start_time_ms, end_time_ms, sequence_num) VALUES
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Good morning everyone. Thanks for joining. We have a lot to cover today — Q3 planning, the API launch, and some concerns I want to address from last week.', 0, 9000, 0),
(v_meeting_id, v_user_id, 'Sarah Chen', 'Morning. Just to flag, we''re missing Lena — she said she might be a few minutes late.', 9500, 15000, 1),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'That''s fine, let''s get started. James, can you kick us off with the current pipeline state?', 15500, 21000, 2),
(v_meeting_id, v_user_id, 'James Okafor', 'Sure. So as of Friday, we have 34 enterprise prospects in the funnel. 12 in evaluation, 8 in negotiation, and we closed 3 last week — Centrix, BrightPath, and Novata. That''s 2.1 million ARR added in July alone.', 21500, 38000, 3),
(v_meeting_id, v_user_id, 'Tom Brennan', 'Nice. What were the key objections from the ones we didn''t close?', 38500, 43000, 4),
(v_meeting_id, v_user_id, 'James Okafor', 'Mostly pricing for SMBs, and a few enterprise prospects are waiting on our SOC 2 Type II certification. That''s blocking at least 4 deals.', 43500, 53000, 5),
(v_meeting_id, v_user_id, 'Aisha Malik', 'SOC 2 is on track — we''re targeting end of September. I''ll send the updated timeline after this.', 53500, 60000, 6),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Perfect. Priya, where are we on the API launch?', 60500, 65000, 7),
(v_meeting_id, v_user_id, 'Priya Sharma', 'We''re in good shape. Core endpoints are done — meetings, participants, transcripts, webhooks. Rate limiting and auth are finalized. Documentation is about 70% complete. We''re targeting August 15th for a soft launch to beta partners.', 65500, 82000, 8),
(v_meeting_id, v_user_id, 'David Park', 'What''s the partner count at this point?', 82500, 86000, 9),
(v_meeting_id, v_user_id, 'Priya Sharma', '23 beta partners signed up. We have good representation — CRM tools, project management, HR platforms.', 86500, 94000, 10),
(v_meeting_id, v_user_id, 'Lena Fischer', 'Sorry I''m late — connection issues. Did I miss anything critical?', 95000, 100000, 11),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Just getting started on API timeline. We''re targeting August 15th soft launch.', 100500, 106000, 12),
(v_meeting_id, v_user_id, 'Lena Fischer', 'Got it. I wanted to flag one thing on the API side — we have a breaking change in the transcript schema that affects v1 partners. We should communicate that early.', 107000, 118000, 13),
(v_meeting_id, v_user_id, 'Priya Sharma', 'Yes, that''s on my list. I''ll send a migration guide to the beta partners this week.', 118500, 125000, 14),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Good. Let''s move to Q3 OKRs. Sarah, can you walk us through what we''re committing to?', 125500, 132000, 15),
(v_meeting_id, v_user_id, 'Sarah Chen', 'Sure. Our Q3 objectives are three: One — reach 5 million ARR by September 30th. We''re at 3.8 now, so we need 1.2 million more. Two — launch the public API and hit 50 integrated partners by end of quarter. Three — reduce churn from the current 3.2% to under 2%.', 132500, 160000, 16),
(v_meeting_id, v_user_id, 'Tom Brennan', 'The churn target feels aggressive. What''s driving churn right now?', 160500, 166000, 17),
(v_meeting_id, v_user_id, 'Sarah Chen', 'Two main buckets. First, onboarding — users who don''t get to their first successful meeting recording in week one tend to churn. Second, feature gaps — specifically, real-time transcription during the meeting, not just post-meeting.', 166500, 182000, 18),
(v_meeting_id, v_user_id, 'David Park', 'Real-time transcription is on the roadmap, but it''s a significant infrastructure lift. We''re looking at Q4 earliest.', 182500, 191000, 19),
(v_meeting_id, v_user_id, 'Sarah Chen', 'I know. But for churn, the onboarding issue is more immediate. I think we can cut 0.8% churn just by fixing the first-week experience.', 191500, 200000, 20),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Let''s make that a priority. Tom, can you own a proposal for improving first-week activation by next Friday?', 200500, 208000, 21),
(v_meeting_id, v_user_id, 'Tom Brennan', 'I''ll have something by Thursday.', 208500, 211000, 22),
(v_meeting_id, v_user_id, 'Aisha Malik', 'I want to raise something on the compliance side. We''ve had three enterprise customers ask about GDPR data residency — specifically, can we host their data in EU regions? Right now, everything''s US-East.', 211500, 226000, 23),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'This has come up before. David, what''s the engineering effort to support EU region?', 226500, 233000, 24),
(v_meeting_id, v_user_id, 'David Park', 'Multi-region is significant. We''re talking about 3-4 months minimum — data replication, storage separation, potentially different CDN providers. It''s not trivial.', 233500, 247000, 25),
(v_meeting_id, v_user_id, 'James Okafor', 'We''re losing deals over this. I had a Berlin-based company — 200 seats — who walked because of it.', 247500, 255000, 26),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'I hear you. Let''s get a proper scoping document. David and Lena, can you put together an EU region proposal by end of month? I''m not committing to it yet, but I want to understand the full picture.', 255500, 270000, 27),
(v_meeting_id, v_user_id, 'Lena Fischer', 'Will do. I''d also suggest we look at a temporary workaround — a data processing agreement with a GDPR-compliant third party while we build the native solution.', 270500, 281000, 28),
(v_meeting_id, v_user_id, 'Aisha Malik', 'That''s actually a good idea. I can research GDPR DPA options this week.', 281500, 287000, 29),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Great. Moving to pricing. Sarah, you had some data to share.', 287500, 293000, 30),
(v_meeting_id, v_user_id, 'Sarah Chen', 'Yes. We''ve been running an A/B test on pricing for two months. The 15% price increase on our Business plan actually improved conversion by 4%. Customers in the higher bracket have 40% lower churn as well. The data is pretty clear — we''re underpriced.', 293500, 315000, 31),
(v_meeting_id, v_user_id, 'Tom Brennan', 'That''s consistent with what I hear in sales conversations. Nobody''s walking over price at the Business tier. Enterprise is where it gets hairy.', 315500, 323000, 32),
(v_meeting_id, v_user_id, 'Priya Sharma', 'If we increase pricing, we need to make sure the product feels premium. The UI polish on the meeting page has been a complaint.', 323500, 332000, 33),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Agreed. I want design to prioritize the meeting workspace UI for Q3. Lena, can that be the focus for your team this quarter?', 332500, 340000, 34),
(v_meeting_id, v_user_id, 'Lena Fischer', 'Yes. I''ve actually had a design sprint planned. We can start the week of August 5th.', 340500, 348000, 35),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Perfect. On pricing — let''s make a decision. Are we increasing Business plan pricing this quarter?', 348500, 356000, 36),
(v_meeting_id, v_user_id, 'Sarah Chen', 'I recommend yes. Move from 29 to 35 per user per month, effective September 1st. We grandfather existing annual plans.', 356500, 366000, 37),
(v_meeting_id, v_user_id, 'James Okafor', 'Agreed. Sales is comfortable with that.', 366500, 370000, 38),
(v_meeting_id, v_user_id, 'Tom Brennan', 'Agreed.', 370500, 372000, 39),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Okay — decided. Business plan moves to $35/user/month on September 1st. Existing annual plans are grandfathered. Sarah, you''ll own the customer communication.', 372500, 384000, 40),
(v_meeting_id, v_user_id, 'Sarah Chen', 'I''ll have a communication plan ready by August 1st.', 384500, 389000, 41),
(v_meeting_id, v_user_id, 'David Park', 'I want to raise the infrastructure side. We had two outages in July — 4 hours total. Both were related to the transcript processing queue backing up under high load.', 389500, 403000, 42),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'That''s not acceptable. What''s the fix?', 403500, 407000, 43),
(v_meeting_id, v_user_id, 'David Park', 'Two things: autoscaling the processing workers, and moving from our current queue implementation to a proper job queue system. I''m looking at BullMQ or Temporal.', 407500, 419000, 44),
(v_meeting_id, v_user_id, 'Lena Fischer', 'We had a similar situation at my last company. Temporal is excellent but has a learning curve. BullMQ is faster to implement if you''re already on Redis.', 419500, 429000, 45),
(v_meeting_id, v_user_id, 'David Park', 'We are on Redis already. Okay, BullMQ it is. I''ll have the autoscaling done by next week, BullMQ migration by end of July.', 429500, 439000, 46),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Make reliability a hard priority. No more outages in Q3. What do you need from me?', 439500, 446000, 47),
(v_meeting_id, v_user_id, 'David Park', 'Two additional engineers for the infrastructure work. I''d like to pull James K and Fatima from the feature team for four weeks.', 446500, 455000, 48),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Done. I''ll confirm with you offline. Priya, any blockers on the API launch I should know about?', 455500, 463000, 49),
(v_meeting_id, v_user_id, 'Priya Sharma', 'One — we need legal to review the API terms of service before launch. I don''t have a contact there.', 463500, 471000, 50),
(v_meeting_id, v_user_id, 'Aisha Malik', 'I''ll connect you with Marcus from legal. He''s fast — usually 48 hours turnaround.', 471500, 478000, 51),
(v_meeting_id, v_user_id, 'Priya Sharma', 'Great, thank you.', 478500, 480000, 52),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Let''s talk about the mobile app for a moment. Tom, you''ve been collecting feedback — what''s the most requested feature?', 480500, 488000, 53),
(v_meeting_id, v_user_id, 'Tom Brennan', 'By far, it''s the ability to join a recording session from mobile and have the recording sync to the desktop automatically. Second is push notifications for meeting reminders. Third is a better share clip experience — people want to share 30-second clips on Slack directly.', 488500, 510000, 54),
(v_meeting_id, v_user_id, 'Lena Fischer', 'The Slack integration for clips would be a great differentiator. We could lean into that.', 510500, 517000, 55),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'I agree. Let''s target the Slack clip sharing as a Q3 feature. Lena, can you scope that?', 517500, 525000, 56),
(v_meeting_id, v_user_id, 'Lena Fischer', 'Sure. I''ll have a spec by August 12th.', 525500, 529000, 57),
(v_meeting_id, v_user_id, 'James Okafor', 'One more thing from the sales side — we need a proper case study. Our top three customers have agreed to participate. Can someone own that?', 529500, 540000, 58),
(v_meeting_id, v_user_id, 'Sarah Chen', 'Marketing can own that. I''ll assign it to Rina this week.', 540500, 546000, 59),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Good. Let me summarize decisions before we wrap. One — API soft launch August 15th. Two — Business plan price increase to $35 September 1st, Sarah owns customer communication by August 1st. Three — EU region scoping document from David and Lena by end of month. Four — Lena''s team owns meeting workspace UI refresh for Q3. Five — Tom owns first-week activation proposal by Thursday. Six — David adds BullMQ and autoscaling by end of July, gets James K and Fatima for four weeks. Seven — Slack clip sharing scoped by Lena by August 12th.', 546500, 590000, 60),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Any blockers or concerns I haven''t addressed?', 590500, 594000, 61),
(v_meeting_id, v_user_id, 'Aisha Malik', 'Just one — I want to make sure the SOC 2 timing is communicated to sales. Some prospects are asking weekly.', 594500, 602000, 62),
(v_meeting_id, v_user_id, 'James Okafor', 'Yes please. Even a confident "end of September" message helps close deals.', 602500, 609000, 63),
(v_meeting_id, v_user_id, 'Aisha Malik', 'I''ll send an update to the sales team today.', 609500, 613000, 64),
(v_meeting_id, v_user_id, 'Muhammad Ali', 'Perfect. Okay everyone — great session. Let''s execute. Talk next week.', 613500, 619000, 65);

-- Insert meeting summary
INSERT INTO meeting_summaries (
  id, meeting_id, user_id, template,
  summary, key_takeaways, decisions, action_items, topics, important_moments, generated_at
) VALUES (
  v_summary_id,
  v_meeting_id,
  v_user_id,
  'general',
  'A comprehensive Q3 strategy session with eight participants covering sales pipeline performance, API launch planning, OKR commitments, pricing strategy, infrastructure reliability, and product roadmap priorities. Key decisions included a Business plan price increase, API launch date, EU region scoping, and several cross-functional action items.',
  '["Closed 2.1M ARR in July — Centrix, BrightPath, and Novata","API soft launch scheduled for August 15th with 23 beta partners","Business plan pricing increasing from $29 to $35/user/month on September 1st","SOC 2 Type II certification targeted for end of September","Infrastructure team had two outages in July — moving to BullMQ + autoscaling","EU region support required to close large enterprise deals","First-week onboarding experience identified as primary churn driver"]'::jsonb,
  '["Business plan price increases to $35/user/month effective September 1st — existing annual plans grandfathered","API soft launch proceeds August 15th","David gets James K and Fatima for 4 weeks to work on infrastructure","Slack clip sharing feature added to Q3 roadmap"]'::jsonb,
  '[{"task":"Send customer communication plan for pricing change","owner":"Sarah Chen","deadline":"2026-08-01"},{"task":"Deliver first-week activation improvement proposal","owner":"Tom Brennan","deadline":"2026-08-07"},{"task":"Complete EU region scoping document","owner":"David Park and Lena Fischer","deadline":"2026-07-31"},{"task":"Send migration guide to API beta partners","owner":"Priya Sharma","deadline":"2026-07-20"},{"task":"Research GDPR DPA options for temporary EU compliance","owner":"Aisha Malik","deadline":"2026-07-25"},{"task":"Implement BullMQ and autoscaling","owner":"David Park","deadline":"2026-07-31"},{"task":"Spec Slack clip sharing feature","owner":"Lena Fischer","deadline":"2026-08-12"},{"task":"Connect Priya with legal contact for API ToS review","owner":"Aisha Malik","deadline":"2026-07-15"},{"task":"Assign case study project to Rina","owner":"Sarah Chen","deadline":"2026-07-18"},{"task":"Send SOC 2 timeline update to sales team","owner":"Aisha Malik","deadline":"2026-07-14"}]'::jsonb,
  '["Sales Pipeline","API Launch","Q3 OKRs","Pricing Strategy","Infrastructure Reliability","EU Data Residency","Mobile Features","Churn Reduction"]'::jsonb,
  '[{"timestamp_ms":372500,"description":"Decision: Business plan price increase to $35 approved"},{"timestamp_ms":247500,"description":"EU data residency blocking major enterprise deal (200 seats)"},{"timestamp_ms":389500,"description":"Two infrastructure outages flagged — reliability escalated to P0"}]'::jsonb,
  now() - interval '2 days'
);

-- Insert action items
INSERT INTO action_items (meeting_id, user_id, task, owner, deadline, completed) VALUES
(v_meeting_id, v_user_id, 'Send customer communication plan for pricing change', 'Sarah Chen', '2026-08-01', false),
(v_meeting_id, v_user_id, 'Deliver first-week activation improvement proposal', 'Tom Brennan', '2026-08-07', false),
(v_meeting_id, v_user_id, 'Complete EU region scoping document', 'David Park & Lena Fischer', '2026-07-31', false),
(v_meeting_id, v_user_id, 'Send migration guide to API beta partners', 'Priya Sharma', '2026-07-20', false),
(v_meeting_id, v_user_id, 'Research GDPR DPA options', 'Aisha Malik', '2026-07-25', false),
(v_meeting_id, v_user_id, 'Implement BullMQ and autoscaling', 'David Park', '2026-07-31', false),
(v_meeting_id, v_user_id, 'Spec Slack clip sharing feature', 'Lena Fischer', '2026-08-12', false),
(v_meeting_id, v_user_id, 'Connect Priya with legal contact for API ToS', 'Aisha Malik', '2026-07-15', true),
(v_meeting_id, v_user_id, 'Assign case study to Rina in Marketing', 'Sarah Chen', '2026-07-18', false),
(v_meeting_id, v_user_id, 'Send SOC 2 timeline update to sales team', 'Aisha Malik', '2026-07-14', true);

-- Insert highlights
INSERT INTO highlights (meeting_id, user_id, timestamp_ms, label, note) VALUES
(v_meeting_id, v_user_id, 372500, 'Pricing decision', 'Business plan moving to $35 — September 1st'),
(v_meeting_id, v_user_id, 247500, 'EU deal lost', '200-seat Berlin company walked over data residency'),
(v_meeting_id, v_user_id, 389500, 'Infrastructure outages', '4 hours of downtime in July — escalated to P0');

RAISE NOTICE 'Seed data inserted successfully. Meeting ID: %', v_meeting_id;

END $$;
