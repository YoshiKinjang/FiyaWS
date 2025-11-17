import AppLogoIcon from './app-logo-icon';
import {Boxes} from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="bg-lime-600 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <Boxes />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Fiya Warung Sayur</span>
            </div>
        </>
    );
}
