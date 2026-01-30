import { create } from 'zustand';
import { Event } from '@prisma/client';

export interface RouteStop {
    event: Event & { organizer: any }; // efficient enough for now
    order: number;
}

interface RouteStore {
    stops: RouteStop[];
    addStop: (event: Event & { organizer: any }) => void;
    removeStop: (eventId: string) => void;
    clearRoute: () => void;
    reorderStops: (startIndex: number, endIndex: number) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    tripStats: { distance: number; duration: number } | null;
    routeGeometry: any | null;
    setRouteData: (stats: { distance: number; duration: number } | null, geometry: any | null) => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
    stops: [],
    isOpen: false,
    tripStats: null,
    routeGeometry: null,
    addStop: (event) => set((state: RouteStore) => {
        if (state.stops.some(s => s.event.id === event.id)) return state;
        return {
            stops: [...state.stops, { event, order: state.stops.length }],
            isOpen: true,
            // Reset route data on change, forcing recalculation
            tripStats: null,
            routeGeometry: null
        };
    }),
    removeStop: (eventId) => set((state: RouteStore) => ({
        stops: state.stops.filter(s => s.event.id !== eventId),
        tripStats: null,
        routeGeometry: null
    })),
    clearRoute: () => set({ stops: [], tripStats: null, routeGeometry: null }),
    reorderStops: (startIndex, endIndex) => set((state: RouteStore) => {
        const result = Array.from(state.stops);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return {
            stops: result.map((s, i) => ({ ...s, order: i })),
            tripStats: null,
            routeGeometry: null
        };
    }),
    setIsOpen: (isOpen) => set({ isOpen }),
    setRouteData: (stats, geometry) => set({ tripStats: stats, routeGeometry: geometry })
}));
