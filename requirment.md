Truckment Dashboard Application Requirements

- You are Principal Product UI/UX Designer and Senior Staff Software Engineer.

Stack and Frameworks
- Next.js 16 (app router) with React 19; TypeScript preferred.
- UI: Material UI with styled-components; support light and dark themes.
- Internationalization: next-intl for all user-facing text.
- Charts: chart.js for all visualizations.
- Target UX baseline: match the look-and-feel of https://modernize-nextjs.adminmart.com/ (cards, spacing, iconography, gradients, rounded corners, shadows, pill badges).

Navigation and Layout
- Default entry route `/dashboard`; intuitive navigation to vehicle detail, maintenance, fuel, and settings.
- Responsive layouts for desktop, tablet, and mobile.
- Global theme toggle (light/dark) and locale switcher.
- Left rail + top bar pattern similar to Modernize:
  - Collapsible left navigation with icons, section headers (e.g., Home, Apps), nested groups, and badges (e.g., “New”, counts).
  - Top bar: locale flag selector, cart/alerts icons with badges, theme toggle, notifications bell, app launcher grid, and user avatar.
- Dashboard cards styled like Modernize: soft shadows, rounded corners, subtle gradients, icon circles, and clear hierarchy for titles/metrics.
- Mobile: slide-in drawer navigation, sticky top bar, prominent FAB/settings button, touch-friendly hit areas.
- Provide quick-launch drawer/panel for common actions (e.g., open chats, calendar, email) similar to Modernize “Apps” dropdown.

Map and Location
- Map providers: Google Maps, Yandex Maps, plus at least one alternative; user-selectable with fallback handling.
- Vehicle live tracking with status (engine on/off, current speed).
- Trajectory view: distance/time to next stop and ETAs.
- Geofence points: allow users to mark points/areas and send automatic notifications upon arrival/exit.
- Trip history: kilometers driven between time X and Y with filterable date ranges.

Fuel Management
- Track fill and drain events (liters added/removed, timestamp, location).
- Calculate and display fuel consumption between coordinate X and Y based on tank level changes (excluding drains).
- Send automatic notifications for each fuel event and anomaly (e.g., sudden drop).
- Chart fuel level over time and per-trip consumption.

Maintenance and Parts
- Record wear-part replacements with current odometer and next replacement distance.
- Oil change tracking with brand, supplier, price; upcoming oil change reminders based on mileage/time thresholds.
- Spare parts: fields for part/oil brand, supplier, price, notes; attach receipts if available.
- Maintenance schedule view with upcoming items and overdue alerts.

Alerts and Notifications
- Configurable notifications (push/email/SMS placeholder) for geofence arrivals, fuel events, maintenance due, insurance/inspection expiry, and abnormal telemetry (e.g., speeding).
- Snooze/acknowledge workflow with audit trail.

Insurance and Compliance
- Store insurance details and inspection dates; notify when nearing expiration.
- Display countdown to expiration on dashboard.

Telemetry and Analytics
- Dashboard cards: engine status, current speed, live location, ETA to next stop, distance today/this week, fuel level, active alerts.
- Charts for speed history, fuel consumption, and distance traveled over selected ranges.
- Export basic reports (CSV) for trips, fuel, and maintenance.

Settings and Access
- User profile preferences: units (km/mi, liters/gallons), time zone, locale, default map provider.
- Role-based access (admin, dispatcher, viewer) with appropriate permissions.

Non-Functional
- Handle offline/poor network gracefully with cached recent data and clear status indicators.
- Log and surface API errors with user-friendly messages; include retry where safe.
- Follow accessibility best practices (keyboard nav, ARIA labels, contrast).
