import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { formatRupiah } from '@/utility/format-rupiah';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowRightLeft, Banknote, Box, CreditCard, ShoppingCart, PackagePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

interface Stats {
    totalPenjualanHariIni: number;
    totalHutangAktif: number;
    totalPengeluaranBulanIni: number;
}

interface LowStockProduct {
    produk_nama: string;
    stok: number;
}

interface RecentTransaction {
    pembeli: string;
    total: number;
    status: 'lunas' | 'utang';
}

interface DashboardPageProps extends PageProps {
    stats: Stats;
    lowStockProducts: LowStockProduct[];
    recentTransactions: RecentTransaction[];
}

export default function Dashboard() {
    const { stats, lowStockProducts, recentTransactions } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <ArrowRightLeft />
                                    <div>Total Penjualan Hari Ini</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(stats.totalPenjualanHariIni)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Banknote />
                                    <div>Total Pengeluaran Bulan Ini</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(stats.totalPengeluaranBulanIni)}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <CreditCard />
                                    <div>Total Hutang Aktif</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(stats.totalHutangAktif)}</CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="p-6 text-xl font-medium">Quick Actions</div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href={route('transaksi.index')}>
                        <Card className="hover:border-primary transition-colors">
                            <CardHeader>
                                <div className='flex flex-row flex-wrap items-center justify-between'>
                                    <CardTitle className='text-lg font-medium'>Mulai Transaksi</CardTitle>
                                    <Button variant={'outline'} size={'icon'}>
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href={route('kulakan.index')}>
                        <Card className="hover:border-primary transition-colors">
                            <CardHeader>
                                <div className='flex flex-row flex-wrap items-center justify-between'>
                                    <CardTitle className='text-lg font-medium'>Input Kulakan</CardTitle>
                                    <Button variant={'outline'} size={'icon'}>
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href={route('produk.index')}>
                        <Card className="hover:border-primary transition-colors">
                            <CardHeader>
                                <div className='flex flex-row flex-wrap items-center justify-between'>
                                    <CardTitle className='text-lg font-medium'>Tambah Produk</CardTitle>
                                    <Button variant={'outline'} size={'icon'}>
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* Recent Data Lists */}
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaksi Terakhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                {recentTransactions.map((trx, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{trx.pembeli}</p>
                                            <Badge variant={trx.status === 'lunas' ? 'secondary' : 'destructive'}>{trx.status}</Badge>
                                        </div>
                                        <p className="font-semibold">{formatRupiah(trx.total)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Stok Menipis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                {lowStockProducts.map((prod, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <p className="font-medium">{prod.produk_nama}</p>
                                        <p className="font-semibold text-destructive">{prod.stok} item</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </AppLayout>
    );
}
