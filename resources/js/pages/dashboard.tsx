import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { formatRupiah } from '@/utility/format-rupiah';
import { Head } from '@inertiajs/react';
import { ArrowRight, ArrowRightLeft, Banknote, Box, CreditCard } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const data = {
    total_transaksi: 15000000,
    total_pengeluaran: 15000000,
    total_hutang: 150000,
    jumlah_produk: 55,
};

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg font-light">
                                <div className="flex flex-wrap items-center gap-4">
                                    <ArrowRightLeft className="" />
                                    <div>Total transaksi hari ini</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(data.total_transaksi)}</CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Banknote className="" />
                                    <div>Total pengeluaran</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(data.total_pengeluaran)}</CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <CreditCard className="" />
                                    <div>Total hutang</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{formatRupiah(data.total_hutang)}</CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Box className="" />
                                    <div>Total produk</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-black">{data.jumlah_produk} Jenis</CardContent>
                    </Card>
                </div>
                <div className="p-6 text-xl font-medium md:min-h-min">Quick actions</div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <div className='flex flex-row flex-wrap items-center justify-between'>
                                <CardTitle className='text-lg font-medium'>Mulai transaksi</CardTitle>
                                <Button variant={'outline'} size={'icon'}>
                                    <ArrowRight></ArrowRight>
                                </Button>

                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className='flex flex-row flex-wrap items-center justify-between'>
                                <CardTitle className='text-lg font-medium'>Input kulakan</CardTitle>
                                <Button variant={'outline'} size={'icon'}>
                                    <ArrowRight></ArrowRight>
                                </Button>

                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className='flex flex-row flex-wrap items-center justify-between'>
                                <CardTitle className='text-lg font-medium'>Tambah produk</CardTitle>
                                <Button variant={'outline'} size={'icon'}>
                                    <ArrowRight></ArrowRight>
                                </Button>

                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
