import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatRupiah } from '@/utility/format-rupiah';
import { DataTable } from '@/components/ui/data-table';

// --- Type Definitions ---
interface Produk {
    produk_id: number;
    produk_nama: string;
    harga_beli: number;
    harga_jual: number;
}

interface KulakanItemForm {
    produk_id: number | null;
    nama: string;
    qty: number;
    hargaBeli: number;
    hargaJual: number;
    subtotal: number;
}

interface KulakanHistoryItem {
    id: number;
    nama: string;
    qty: number;
    hargaBeli: number;
    hargaJual: number;
    subtotal: number;
    waktu: string;
    catatan: string;
    historyId: string;
}

interface KulakanHistory {
    id: string;
    tanggal: string;
    waktu: string;
    items: Omit<KulakanHistoryItem, 'waktu' | 'catatan' | 'historyId'>[];
    total: number;
    catatan: string;
}

interface KulakanPageProps extends PageProps {
    kulakanHistory: KulakanHistory[];
    products: Produk[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kulakan', href: route('kulakan.index') }];

// --- Columns Definition for DataTable ---
export const columns: ColumnDef<KulakanHistoryItem>[] = [
    {
        accessorKey: 'waktu',
        header: 'Waktu',
    },
    {
        accessorKey: 'nama',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Produk
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'qty',
        header: () => <div className="text-right">Qty</div>,
        cell: ({ row }) => <div className="text-right">{row.getValue('qty')}</div>,
    },
    {
        accessorKey: 'hargaBeli',
        header: () => <div className="text-right">Harga Beli</div>,
        cell: ({ row }) => <div className="text-right">{formatRupiah(row.getValue('hargaBeli'))}</div>,
    },
    {
        accessorKey: 'hargaJual',
        header: () => <div className="text-right">Harga Jual</div>,
        cell: ({ row }) => <div className="text-right">{formatRupiah(row.getValue('hargaJual'))}</div>,
    },
    {
        accessorKey: 'subtotal',
        header: () => <div className="text-right">Subtotal</div>,
        cell: ({ row }) => <div className="text-right">{formatRupiah(row.getValue('subtotal'))}</div>,
    },
    {
        accessorKey: 'catatan',
        header: 'Catatan',
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];


export default function KulakanPage() {
    const { kulakanHistory, products } = usePage<KulakanPageProps>().props;

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [items, setItems] = useState<KulakanItemForm[]>([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        note: '',
        items: [] as KulakanItemForm[],
    });

    const [formItem, setFormItem] = useState({
        produk_id: '',
        qty: '1',
        hargaBeli: '0',
        hargaJual: '0',
    });

    // Flatten history for main table display
    const flattenedHistory = kulakanHistory.flatMap((history) =>
        history.items.map((item) => ({
            ...item,
            waktu: history.waktu,
            catatan: history.catatan,
            historyId: history.id,
        })),
    );

    const handleProductSelect = (produkId: string) => {
        const selectedProduct = products.find((p) => p.produk_id === parseInt(produkId));
        if (selectedProduct) {
            setFormItem({
                ...formItem,
                produk_id: produkId,
                hargaBeli: String(selectedProduct.harga_beli),
                hargaJual: String(selectedProduct.harga_jual),
            });
        }
    };

    const addItem = () => {
        const selectedProduct = products.find((p) => p.produk_id === parseInt(formItem.produk_id));
        if (!selectedProduct) {
            alert('Please select a product.');
            return;
        }

        const newItem: KulakanItemForm = {
            produk_id: selectedProduct.produk_id,
            nama: selectedProduct.produk_nama,
            qty: parseInt(formItem.qty),
            hargaBeli: parseInt(formItem.hargaBeli),
            hargaJual: parseInt(formItem.hargaJual),
            subtotal: parseInt(formItem.qty) * parseInt(formItem.hargaBeli),
        };

        setItems([...items, newItem]);
        // Reset form item fields
        setFormItem({ produk_id: '', qty: '1', hargaBeli: '0', hargaJual: '0' });
    };

    const removeItem = (id: number | null) => {
        setItems(items.filter((item) => item.produk_id !== id));
    };
    
    useEffect(() => {
        setData('items', items);
    }, [items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kulakan.store'), {
            onSuccess: () => {
                setItems([]);
                reset();
                setAddModalOpen(false);
            },
        });
    };

    const grandTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Kulakan" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-row flex-wrap items-center justify-between">
                            <div>
                                <CardTitle>Riwayat Kulakan</CardTitle>
                                <CardDescription>Catatan pembelian stok barang untuk toko Anda.</CardDescription>
                            </div>
                            <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2" />
                                        Tambah Kulakan
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-7xl">
                                    <form onSubmit={handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Kulakan</DialogTitle>
                                            <DialogDescription>Isi form untuk menambahkan item kulakan baru.</DialogDescription>
                                        </DialogHeader>

                                        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-12">
                                            <div className="grid gap-2 md:col-span-4">
                                                <Label>Produk</Label>
                                                <Select value={formItem.produk_id} onValueChange={handleProductSelect}>
                                                    <SelectTrigger><SelectValue placeholder="Pilih Produk" /></SelectTrigger>
                                                    <SelectContent>
                                                        {products.map((p) => (
                                                            <SelectItem key={p.produk_id} value={String(p.produk_id)}>
                                                                {p.produk_nama}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label htmlFor="qty">Qty</Label>
                                                <Input id="qty" type="number" value={formItem.qty} onChange={(e) => setFormItem({...formItem, qty: e.target.value})} />
                                            </div>
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label htmlFor="harga-beli">Harga Beli</Label>
                                                <Input id="harga-beli" type="number" value={formItem.hargaBeli} onChange={(e) => setFormItem({...formItem, hargaBeli: e.target.value})} />
                                            </div>
                                            <div className="grid gap-2 md:col-span-2">
                                                <Label htmlFor="harga-jual">Harga Jual</Label>
                                                <Input id="harga-jual" type="number" value={formItem.hargaJual} onChange={(e) => setFormItem({...formItem, hargaJual: e.target.value})} />
                                            </div>
                                            <div className="flex items-end md:col-span-2">
                                                <Button type="button" onClick={addItem} className="w-full">
                                                    <Plus className="mr-2" /> Tambah
                                                </Button>
                                            </div>
                                            <div className="md:col-span-12">
                                                <Label htmlFor="note">Catatan (opsional)</Label>
                                                <Textarea id="note" value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Tambahkan catatan..." />
                                                {errors.note && <p className="text-sm text-red-600 mt-2">{errors.note}</p>}
                                            </div>
                                        </div>

                                        <Card>
                                            <CardHeader><CardTitle>Daftar Item</CardTitle></CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Produk</TableHead>
                                                            <TableHead className="text-right">Qty</TableHead>
                                                            <TableHead className="text-right">Harga Beli</TableHead>
                                                            <TableHead className="text-right">Harga Jual</TableHead>
                                                            <TableHead className="text-right">Subtotal</TableHead>
                                                            <TableHead className="w-20 text-center">Aksi</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {items.length === 0 ? (
                                                            <TableRow><TableCell colSpan={6} className="h-24 text-center">Belum ada item.</TableCell></TableRow>
                                                        ) : (
                                                            items.map((item) => (
                                                                <TableRow key={item.produk_id}>
                                                                    <TableCell className="font-medium">{item.nama}</TableCell>
                                                                    <TableCell className="text-right">{item.qty}</TableCell>
                                                                    <TableCell className="text-right">{formatRupiah(item.hargaBeli)}</TableCell>
                                                                    <TableCell className="text-right">{formatRupiah(item.hargaJual)}</TableCell>
                                                                    <TableCell className="text-right">{formatRupiah(item.subtotal)}</TableCell>
                                                                    <TableCell className="text-center">
                                                                        <Button variant="ghost" size="icon" type="button" onClick={() => removeItem(item.produk_id)}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                    {items.length > 0 && (
                                                        <TableFooter>
                                                            <TableRow>
                                                                <TableCell colSpan={4} className="font-bold">Grand Total</TableCell>
                                                                <TableCell className="text-right font-bold">{formatRupiah(grandTotal)}</TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    )}
                                                </Table>
                                            </CardContent>
                                        </Card>

                                        <DialogFooter className="mt-6">
                                            <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                                            <Button type="submit" disabled={processing || items.length === 0}>
                                                {processing ? 'Menyimpan...' : 'Simpan Kulakan'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={flattenedHistory} filterKey="nama" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
