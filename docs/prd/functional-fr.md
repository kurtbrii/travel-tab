# Functional (FR)
1. FR1: Users can register and login.
2. FR2: Users can create and edit a trip with destination country (ISO list), purpose, start date, end date; list, view, and delete their trips.
3. FR3: Users can enable exactly one BorderBuddy instance per trip; creation is idempotent.
4. FR4: Users can fill and edit a BorderBuddy context form per trip (interests, regions/cities, budget, travel style, constraints) to enrich prompts.
5. FR5: BorderBuddy provides a chat interface per trip (OpenAI-backed); messages persist with roles (User/Assistant) and use trip + form context.
6. FR6: Users can generate and view a simple list of places to visit in the destination country (name + short description); no maps integration.
7. FR7: Access control ensures users can access only their own trips and trip-scoped data.
