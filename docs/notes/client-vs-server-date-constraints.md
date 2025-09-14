Client vs. Server Date Constraints (Create Trip)

- Client UI enforces a minimum date of today for both Start Date and End Date via input `min` attributes. End Date is also constrained to be on/after the selected Start Date.
- Server validation currently allows past dates. This is intentional for MVP and aligns with the story (historical trips are acceptable). No server-side min date is imposed beyond ensuring `endDate >= startDate` and valid ISO date formats.
- Implication: Users cannot pick past dates directly in the UI, but API clients could submit them and they will be accepted. If product requirements change to disallow past trips system-wide, add a server-side min-date check and update tests accordingly.
