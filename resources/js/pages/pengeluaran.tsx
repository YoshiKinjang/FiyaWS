import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
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

// --- Type Definitions ---
interface Expense {
    id: number;
    jenis: string;
    subtotal: number;
    tanggal: string;
    catatan: string | null;
}

interface ExpenseType {
    jenis_pengeluaran_id: number;
    jenis: string;
}

interface PengeluaranPageProps extends PageProps {
    expenses: Expense[];
    expenseTypes: ExpenseType[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengeluaran', href: route('pengeluaran.index') }];

// --- Columns Definition for DataTable ---
export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: 'tanggal',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Tanggal
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'jenis',
        header: 'Jenis Pengeluaran',
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function PengeluaranPage() {
    const { expenses, expenseTypes } = usePage<PengeluaranPageProps>().props;
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        jenis_pengeluaran_id: '',
        subtotal: '',
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pengeluaran.store'), {
            onSuccess: () => {
                reset();
                setAddModalOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengeluaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-row flex-wrap items-center justify-between">
                            <div>
                                <CardTitle>Pengeluaran Lainnya</CardTitle>
                                <CardDescription>Catatan semua pengeluaran di luar stok barang.</CardDescription>
                            </div>
                            <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2" />
                                        Tambah Pengeluaran
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Pengeluaran</DialogTitle>
                                            <DialogDescription>
                                                Isi form untuk menambahkan pengeluaran baru.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="jenis_pengeluaran_id" className="text-right">
                                                    Jenis
                                                </Label>
                                                <div className="relative col-span-3 z-10">
                                                    <Select onValueChange={(value) => setData('jenis_pengeluaran_id', value)} value={data.jenis_pengeluaran_id}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis pengeluaran" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {expenseTypes.map(type => (
                                                                <SelectItem key={type.jenis_pengeluaran_id} value={String(type.jenis_pengeluaran_id)}>
                                                                    {type.jenis}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.jenis_pengeluaran_id && <p className="text-sm text-red-600 mt-2">{errors.jenis_pengeluaran_id}</p>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="subtotal" className="text-right">
                                                    Subtotal
                                                </Label>
                                                <div className="col-span-3">
                                                    <Input
                                                        id="subtotal"
                                                        type="number"
                                                        value={data.subtotal}
                                                        onChange={(e) => setData('subtotal', e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                    {errors.subtotal && <p className="text-sm text-red-600 mt-2">{errors.subtotal}</p>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="note" className="text-right">
                                                    Catatan
                                                </Label>
                                                <div className="col-span-3">
                                                    <Textarea
                                                        id="note"
                                                        value={data.note}
                                                        onChange={(e) => setData('note', e.target.value)}
                                                        className="col-span-3"
                                                    />
                                                    {errors.note && <p className="text-sm text-red-600 mt-2">{errors.note}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="outline">Batal</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Menyimpan...' : 'Simpan'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={expenses} filterKey="jenis" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
