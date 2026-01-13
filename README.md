# Truckment Dashboard

A modern, comprehensive vehicle tracking and fleet management dashboard built with Next.js 15, React 19, Material UI, and TypeScript.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Truckment+Dashboard)

## ✨ Features

### Core Features
- 🚛 **Vehicle Tracking**: Real-time GPS tracking with multiple map providers
- ⛽ **Fuel Management**: Track fuel consumption, refueling events, and costs
- 🔧 **Maintenance**: Schedule and track vehicle maintenance
- 📊 **Analytics**: Comprehensive dashboards with charts and statistics
- 🗺️ **Geofencing**: Create zones and receive alerts for entry/exit events
- 🌍 **Multi-language**: Support for English, Russian, and Armenian
- 🎨 **Theme Support**: Light and dark mode

### UI/UX Features
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile
- 🎯 **Modern Design**: Based on Modernize template aesthetics
- ⚡ **Fast Performance**: Optimized with Next.js 15 App Router
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🔄 **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **UI Components**: Material UI v6
- **Styling**: Emotion + styled-components
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl

### Map Providers
- Google Maps
- Yandex Maps
- Mapbox (fallback)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd truckment
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_yandex_maps_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
truckment/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Locale-based routing
│   │   ├── dashboard/         # Dashboard page
│   │   ├── vehicles/          # Vehicles page
│   │   ├── fuel/              # Fuel management
│   │   ├── maintenance/       # Maintenance tracking
│   │   └── settings/          # Settings page
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── layout/                # Layout components
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── app-shell.tsx
│   ├── charts/                # Chart components
│   ├── maps/                  # Map components
│   └── common/                # Shared components
├── lib/                       # Core libraries
│   ├── theme.ts              # MUI theme configuration
│   ├── stores/               # Zustand stores
│   └── map-providers/        # Map provider interfaces
├── i18n/                      # Internationalization
│   ├── messages/             # Translation files
│   │   ├── en.json
│   │   ├── ru.json
│   │   └── hy.json
│   ├── routing.ts
│   └── request.ts
├── types/                     # TypeScript types
├── public/                    # Static assets
└── package.json
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Internationalization

The app supports three languages out of the box:

- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)
- 🇦🇲 Armenian (hy)

To add a new language:

1. Create a new JSON file in `i18n/messages/`
2. Add the locale to `i18n/routing.ts`
3. Update the locale selector in TopBar component

## 🎨 Theming

The application uses Material UI's theming system with custom configurations:

- **Light Theme**: Clean, modern look with soft shadows
- **Dark Theme**: Eye-friendly dark mode
- **Custom Gradients**: Beautiful gradient backgrounds for cards
- **Typography**: Plus Jakarta Sans font family
- **Responsive**: Breakpoints for all screen sizes

### Customizing Theme

Edit `lib/theme.ts` to customize colors, typography, and component styles.

## 📱 Responsive Design

Breakpoints:
- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1280px (Small Desktop)
- **lg**: 1280px - 1920px (Desktop)
- **xl**: 1920px+ (Large Desktop)

## 🗺️ Map Integration

### Supported Providers

1. **Google Maps** (Primary)
   - Best global coverage
   - Rich features and POI data

2. **Yandex Maps** (For Russian market)
   - Excellent coverage in Russia and CIS
   - Detailed road information

3. **Mapbox** (Fallback)
   - Open-source alternative
   - Customizable styling

### Using Maps

```tsx
import { MapContainer } from '@/components/maps/map-container';

<MapContainer
  center={{ lat: 40.1872, lng: 44.5152 }}
  zoom={13}
  markers={vehicleMarkers}
  height={500}
/>
```

## 📊 Dashboard Features

### Overview Dashboard
- Fleet statistics
- Active trips count
- Fuel alerts
- Maintenance due
- Interactive charts

### Vehicles Page
- Live vehicle tracking
- Real-time location updates
- Vehicle status indicators
- Speed and fuel monitoring

### Fuel Management
- Fuel consumption tracking
- Refueling event logs
- Cost analysis
- Consumption charts

### Maintenance
- Service schedules
- Maintenance history
- Upcoming reminders
- Odometer tracking

## 🔐 Security (To be implemented)

- [ ] NextAuth.js for authentication
- [ ] Role-based access control (Admin, Dispatcher, Viewer)
- [ ] API route protection
- [ ] Environment variable validation

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core UI/UX
- ✅ Dashboard with charts
- ✅ Basic pages (Vehicles, Fuel, Maintenance)
- ✅ Theme system
- ✅ Internationalization
- ⏳ Map provider integration

### Phase 2
- [ ] Real-time vehicle tracking
- [ ] Geofencing implementation
- [ ] Alert system
- [ ] Notification center
- [ ] Insurance tracking

### Phase 3
- [ ] Backend API
- [ ] Database integration
- [ ] Authentication system
- [ ] WebSocket for real-time updates
- [ ] File upload (receipts, documents)

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Report generation
- [ ] Email notifications
- [ ] SMS alerts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Use functional components with hooks
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Product Designer**: Creating beautiful, user-friendly interfaces
- **Senior Engineer**: Building scalable, maintainable code

## 📞 Support

For support, email support@truckment.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Inspired by [Modernize](https://modernize-nextjs.adminmart.com/)
- Built with [Material UI](https://mui.com/)
- Powered by [Next.js](https://nextjs.org/)

---

Made with ❤️ for fleet management
# truckment
