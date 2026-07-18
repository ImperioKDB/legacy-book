# Content To Replace Before Launch

Running list — append to this every day a placeholder goes in.
Day 7 buffer starts here, not with a blind search through the codebase.

## Day 2 — Landing Page (`app/page.tsx`)
- [ ] Hero photo — currently `/hero-placeholder.jpg`, needs real upload
      (either swap to Supabase Storage URL or replace the public file)
- [ ] Scripture verse — currently "Jeremiah 29:11" placeholder text
- [ ] Class motto — currently literal text "Class Motto Goes Here"

## Day 3 — Student Profiles
- [ ] Every student's `portrait_url` — currently manually pasted or null,
      no upload UI exists until Day 6
- [ ] Every student's `testimony` — schema allows null, but empty state
      looks worse than missing feature per PRD Day 7 checklist
- [ ] Every student's `favorite_scripture` — same as above
- [ ] "Lionel Messi" test student row — delete before launch, currently
      still in `students` table for testing other flows

## Day 4 — Gallery + Memory Wall
- [ ] `PhotoLightbox.tsx` still imports framer-motion — same RSC bundler
      bug that broke Day 5's letter page is a live risk here too, just
      hasn't surfaced yet. Swap to CSS animation before launch, don't wait
      for it to break under real traffic.

## Day 5 — Letters
- [x] Test letters (unlocked + locked) — created, verified, deleted.
      RLS unlock boundary confirmed working via direct anon-role query.

## Day 6 — Admin Dashboard
- [ ] (append when placeholders are added)

---

## Day 7 Checklist (don't skip this — do a fresh top-to-bottom pass)
- [ ] Every item above is checked off or explicitly deferred with a reason
- [ ] No literal placeholder strings remain (search repo for "placeholder",
      "TODO", "Lorem", "Goes Here")
- [ ] Every student profile has a photo and testimony (PRD requirement,
      not optional at launch — empty states look worse than missing features)
- [ ] Test on an actual phone, not desktop preview
