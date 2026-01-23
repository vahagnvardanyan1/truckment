import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AlertType = 'geofence' | 'fuel' | 'maintenance' | 'insurance' | 'speeding';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  vehicleId: string;
  vehicleName?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  acknowledged: boolean;
  snoozedUntil?: string;
}

interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
}

interface AlertsActions {
  addAlert: (alert: Omit<Alert, 'id' | 'read' | 'acknowledged'>) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  acknowledge: (alertId: string) => void;
  snooze: (alertId: string, until: Date) => void;
  dismiss: (alertId: string) => void;
  dismissAll: () => void;
  clearAll: () => void;
}

type AlertsStore = AlertsState & AlertsActions;

// Generate mock alerts for demo
const generateMockAlerts = (): Alert[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'fuel',
      priority: 'critical',
      vehicleId: 'v1',
      vehicleName: 'Truck ABC-123',
      title: 'Low Fuel Alert',
      message: 'Fuel level at 15%. Nearest station: 2.3 km away.',
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
      read: false,
      acknowledged: false,
    },
    {
      id: '2',
      type: 'maintenance',
      priority: 'high',
      vehicleId: 'v2',
      vehicleName: 'Van XYZ-789',
      title: 'Maintenance Due',
      message: 'Oil change due in 500 km or 2 weeks.',
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
      read: false,
      acknowledged: false,
    },
    {
      id: '3',
      type: 'geofence',
      priority: 'medium',
      vehicleId: 'v1',
      vehicleName: 'Truck ABC-123',
      title: 'Geofence Entry',
      message: 'Vehicle entered geofence: Warehouse A',
      timestamp: new Date(now.getTime() - 24 * 3600000).toISOString(),
      read: true,
      acknowledged: false,
    },
    {
      id: '4',
      type: 'speeding',
      priority: 'high',
      vehicleId: 'v3',
      vehicleName: 'Truck DEF-456',
      title: 'Speed Violation',
      message: 'Vehicle exceeded speed limit: 95 km/h in 60 km/h zone.',
      timestamp: new Date(now.getTime() - 4 * 3600000).toISOString(),
      read: false,
      acknowledged: false,
    },
    {
      id: '5',
      type: 'insurance',
      priority: 'medium',
      vehicleId: 'v2',
      vehicleName: 'Van XYZ-789',
      title: 'Insurance Expiring',
      message: 'Vehicle insurance expires in 30 days. Renew soon.',
      timestamp: new Date(now.getTime() - 48 * 3600000).toISOString(),
      read: true,
      acknowledged: true,
    },
  ];
};

export const useAlertsStore = create<AlertsStore>()(
  persist(
    (set, get) => ({
      alerts: generateMockAlerts(),
      unreadCount: generateMockAlerts().filter((a) => !a.read).length,

      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          acknowledged: false,
        };
        set((state) => ({
          alerts: [newAlert, ...state.alerts],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (alertId) => {
        set((state) => {
          const alert = state.alerts.find((a) => a.id === alertId);
          if (alert && !alert.read) {
            return {
              alerts: state.alerts.map((a) =>
                a.id === alertId ? { ...a, read: true } : a
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          }
          return state;
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          alerts: state.alerts.map((a) => ({ ...a, read: true })),
          unreadCount: 0,
        }));
      },

      acknowledge: (alertId) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true, read: true } : a
          ),
          unreadCount: state.alerts.find((a) => a.id === alertId && !a.read)
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }));
      },

      snooze: (alertId, until) => {
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === alertId ? { ...a, snoozedUntil: until.toISOString(), read: true } : a
          ),
          unreadCount: state.alerts.find((a) => a.id === alertId && !a.read)
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }));
      },

      dismiss: (alertId) => {
        set((state) => {
          const alert = state.alerts.find((a) => a.id === alertId);
          return {
            alerts: state.alerts.filter((a) => a.id !== alertId),
            unreadCount:
              alert && !alert.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        });
      },

      dismissAll: () => {
        set({ alerts: [], unreadCount: 0 });
      },

      clearAll: () => {
        set({ alerts: [], unreadCount: 0 });
      },
    }),
    {
      name: 'alerts-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        alerts: state.alerts,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// Selector hooks
export const useUnreadAlerts = () =>
  useAlertsStore((state) => state.alerts.filter((a) => !a.read));

export const useCriticalAlerts = () =>
  useAlertsStore((state) =>
    state.alerts.filter((a) => a.priority === 'critical' && !a.acknowledged)
  );

export const useAlertsByType = (type: AlertType) =>
  useAlertsStore((state) => state.alerts.filter((a) => a.type === type));
