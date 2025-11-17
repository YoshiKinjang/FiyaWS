import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Box, Tag, Ruler, ShoppingCart, ArrowRightLeft, Banknote, CreditCard, FileChartColumn} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Produk',
        url: '/produk',
        icon: Box,
    },
    {
        title: 'Kategori',
        url: '/kategori',
        icon: Tag,
    },
    {
        title: 'Satuan',
        url: '/satuan',
        icon: Ruler,
    },
    {
        title: 'Kulakan',
        url: '/kulakan',
        icon: ShoppingCart,
    },
    {
        title: 'Pengeluaran',
        url: '/pengeluaran',
        icon: Banknote,
    },
    {
        title: 'Transaksi',
        url: '/transaksi',
        icon: ArrowRightLeft,
    },
    {
        title: 'Hutang',
        url: '/hutang',
        icon: CreditCard,
    },
    {
        title: 'Laporan',
        url: '/laporan',
        icon: FileChartColumn,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
