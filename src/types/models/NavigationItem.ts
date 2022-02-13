export interface NavigationItem {
    icon: string;
    label: string;
    routeName: string;
    clickHandler: (...args: unknown[]) => void;
}
