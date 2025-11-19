import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatRupiah } from '@/utility/format-rupiah';

// --- Type Definitions ---
interface Debt {
    id: number;
    nama: string;
    nominal: number;
    tanggal: string;
    status: 'Lunas' | 'Belum Lunas';
}

interface HutangPageProps extends PageProps {
    debts: Debt[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Daftar Hutang', href: route('hutang.index') }];

// --- Main Page Component ---
export default function HutangPage() {
    const { debts } = usePage<HutangPageProps>().props;
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

    const handlePayClick = (debt: Debt) => {
        setSelectedDebt(debt);
        setModalOpen(true);
    };

    const confirmPayment = () => {
        if (!selectedDebt) return;
        
        router.put(route('hutang.update', selectedDebt.id), {}, {
            onSuccess: () => {
                setModalOpen(false);
                setSelectedDebt(null);
                // Optional: show success toast
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Hutang" />
            <div className="p-4 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Hutang</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Nominal</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debts.map((debt) => (
                                    <TableRow key={debt.id}>
                                        <TableCell className="font-medium">{debt.nama}</TableCell>
                                        <TableCell>{debt.tanggal}</TableCell>
                                        <TableCell>
                                            <Badge variant={debt.status === 'Lunas' ? 'secondary' : 'destructive'}>
                                                {debt.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatRupiah(debt.nominal)}</TableCell>
                                        <TableCell className="text-center">
                                            {debt.status === 'Belum Lunas' && (
                                                <Button onClick={() => handlePayClick(debt)} size="sm">
                                                    Bayar
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Modal */}
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pelunasan Hutang</DialogTitle>
                    </DialogHeader>
                    {selectedDebt && (
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Nama:</span>
                                <span className="font-medium">{selectedDebt.nama}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Nominal Hutang:</span>
                                <span className="font-medium">{formatRupiah(selectedDebt.nominal)}</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label>Metode Pembayaran</label>
                                <Select defaultValue="tunai">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih metode..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tunai">Tunai</SelectItem>
                                        <SelectItem value="transfer">Transfer</SelectItem>
                                        <SelectItem value="qris">QRIS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button onClick={confirmPayment}>
                            Konfirmasi Pembayaran
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
