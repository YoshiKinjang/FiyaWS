import { useMemo, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utility/format-rupiah';

// --- Type Definitions ---
interface ReportData {
    penjualan: any[];
    pengeluaran: any[];
    hutang: any[];
    kulakan: any[];
}

interface LaporanPageProps extends PageProps {
    reports: ReportData;
    filters: {
        startDate: string;
        endDate: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Laporan', href: route('laporan.index') }];

// --- Main Page Component ---
export default function LaporanPage() {
    const { reports, filters } = usePage<LaporanPageProps>().props;
    const [startDate, setStartDate] = useState(filters.startDate);
    const [endDate, setEndDate] = useState(filters.endDate);

    const totals = useMemo(() => {
        return {
            penjualan: reports.penjualan.reduce((sum, item) => sum + item.total, 0),
            pengeluaran: reports.pengeluaran.reduce((sum, item) => sum + item.subtotal, 0),
            hutang: reports.hutang.filter(item => item.status === 'Belum Lunas').reduce((sum, item) => sum + item.nominal, 0),
            kulakan: reports.kulakan.reduce((sum, item) => sum + item.total, 0),
        };
    }, [reports]);

    const handleFilter = () => {
        router.get(route('laporan.index'), { startDate, endDate }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="p-4 lg:p-6 flex flex-col gap-6">
                {/* Filter Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Laporan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="startDate">Tanggal Mulai</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="endDate">Tanggal Akhir</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleFilter}>Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports Tabs */}
                <Tabs defaultValue="penjualan" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="penjualan">Penjualan</TabsTrigger>
                        <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                        <TabsTrigger value="hutang">Hutang</TabsTrigger>
                        <TabsTrigger value="kulakan">Kulakan</TabsTrigger>
                    </TabsList>

                    {/* Penjualan Tab */}
                    <TabsContent value="penjualan">
                        <Card>
                            <CardHeader><CardTitle>Laporan Penjualan</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Metode</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.penjualan.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.tanggal}</TableCell>
                                                <TableCell>{item.customer}</TableCell>
                                                <TableCell>{item.metode}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(item.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3} className="font-semibold">Total Penjualan</TableCell>
                                            <TableCell className="text-right font-semibold">{formatRupiah(totals.penjualan)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pengeluaran Tab */}
                    <TabsContent value="pengeluaran">
                        <Card>
                            <CardHeader><CardTitle>Laporan Pengeluaran</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Jenis</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.pengeluaran.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.tanggal}</TableCell>
                                                <TableCell>{item.jenis}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(item.subtotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={2} className="font-semibold">Total Pengeluaran</TableCell>
                                            <TableCell className="text-right font-semibold">{formatRupiah(totals.pengeluaran)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Hutang Tab */}
                    <TabsContent value="hutang">
                        <Card>
                            <CardHeader><CardTitle>Laporan Hutang</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Nominal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.hutang.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.tanggal}</TableCell>
                                                <TableCell>{item.nama}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === 'Lunas' ? 'secondary' : 'destructive'}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{formatRupiah(item.nominal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3} className="font-semibold">Total Hutang (Belum Lunas)</TableCell>
                                            <TableCell className="text-right font-semibold">{formatRupiah(totals.hutang)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Kulakan Tab */}
                    <TabsContent value="kulakan">
                        <Card>
                            <CardHeader><CardTitle>Laporan Kulakan</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Qty</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.kulakan.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.tanggal}</TableCell>
                                                <TableCell>{item.produk}</TableCell>
                                                <TableCell>{item.qty}</TableCell>
                                                <TableCell className="text-right">{formatRupiah(item.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3} className="font-semibold">Total Kulakan</TableCell>
                                            <TableCell className="text-right font-semibold">{formatRupiah(totals.kulakan)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
