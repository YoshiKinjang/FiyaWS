import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DataTable } from '../../components/ui/data-table';
import { Produk, produkColumns } from './produkColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List produk',
        href: '/produk',
    },
];

interface Props {
    data: Produk[];
    pilihanKategori: { kategori_produk_id: number; kategori: string }[];
    pilihanSatuan: { satuan_produk_id: number; satuan: string }[];
}

export default function ProdukDatalist({ data = [], pilihanKategori = [], pilihanSatuan = [] }: Props) {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState<Produk | null>(null);

    const {
        data: formData,
        errors,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        produk_nama: '',
        kategori_id: '',
        satuan_id: '',
        laba: '',
    });

    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
        put,
        processing: editProcessing,
    } = useForm({
        produk_nama: '',
        kategori_id: '',
        satuan_id: '',
        laba: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('produk.store'), {
            onSuccess: () => {
                reset();
                setOpen(false); // tutup modal otomatis
            },
        });
    };

    function handleEdit(item: Produk) {
        setSelected(item);
        setEditData({
            produk_nama: item.produk_nama ?? '',
            kategori_id: String(item.kategori_id ?? ''),
            satuan_id: String(item.satuan_id ?? ''),
            laba: String(item.laba ?? ''),
        });
        setOpenEdit(true);
    }

    function handleDelete(item: Produk) {
        if (confirm(`Yakin ingin menghapus produk "${item.produk_nama}"?`)) {
            router.delete(route('produk.destroy', item.produk_id));
        }
    }

    const buildColumns = produkColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Produk" />
            {/* <Fragment> */}
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="item s-center mx-6 mt-6 flex justify-between">
                    <Heading title={'Produk'} description={'Master data produk'}></Heading>
                    <DialogTrigger asChild>
                        <Button variant={'default'}>
                            <Plus /> Tambah baru
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Buat produk</DialogTitle>
                            <DialogDescription>Buat produk baru untuk warung sayur kamu. Klik simpan untuk menyimpan</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-6">
                            <Label htmlFor="nama-produk-1">Nama produk</Label>
                            <Input
                                id="nama-produk-1"
                                name="produk_nama"
                                placeholder="kg..."
                                value={formData.produk_nama}
                                onChange={(e) => setData('produk_nama', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.produk_nama} />

                            <Label>Kategori</Label>
                            <Select value={formData.kategori_id ?? ''} onValueChange={(v) => setData('kategori_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>

                                <SelectContent>
                                    {pilihanKategori.map((k) => (
                                        <SelectItem key={k.kategori_produk_id} value={String(k.kategori_produk_id)}>
                                            {k.kategori}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.kategori_id} />

                            <Label>Satuan</Label>
                            <Select value={formData.satuan_id ?? ''} onValueChange={(v) => setData('satuan_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih satuan" />
                                </SelectTrigger>

                                <SelectContent>
                                    {pilihanSatuan.map((k) => (
                                        <SelectItem key={k.satuan_produk_id} value={String(k.satuan_produk_id)}>
                                            {k.satuan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError className="mt-2" message={errors.satuan_id} />

                            <Label htmlFor="laba-1">Laba %</Label>
                            <Input id="laba-1" name="laba" placeholder="10" value={formData.laba} onChange={(e) => setData('laba', e.target.value)} />
                            <InputError className="mt-2" message={errors.laba} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                Simpan produk
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log(selected);
                            if (!selected) return;
                            put(route('produk.update', selected.produk_id), {
                                onSuccess: () => setOpenEdit(false),
                            });
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Edit produk</DialogTitle>
                            <DialogDescription>Ubah data produk untuk warung sayur kamu. Klik simpan untuk menyimpan</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-6">
                            <Label htmlFor="nama-produk-1">Nama produk</Label>
                            <Input
                                id="nama-produk-1"
                                name="produk_nama"
                                placeholder="kg..."
                                value={editData.produk_nama}
                                onChange={(e) => setEditData('produk_nama', e.target.value)}
                            />
                            <InputError className="mt-2" message={editErrors.produk_nama} />

                            <Label>Kategori</Label>
                            <Select value={editData.kategori_id ?? ''} onValueChange={(v) => setEditData('kategori_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>

                                <SelectContent>
                                    {pilihanKategori.map((k) => (
                                        <SelectItem key={k.kategori_produk_id} value={String(k.kategori_produk_id)}>
                                            {k.kategori}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={editErrors.kategori_id} />

                            <Label>Satuan</Label>
                            <Select value={editData.satuan_id ?? ''} onValueChange={(v) => setEditData('satuan_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih satuan" />
                                </SelectTrigger>

                                <SelectContent>
                                    {pilihanSatuan.map((k) => (
                                        <SelectItem key={k.satuan_produk_id} value={String(k.satuan_produk_id)}>
                                            {k.satuan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError className="mt-2" message={editErrors.satuan_id} />

                            <Label htmlFor="laba-1">Laba %</Label>
                            <Input
                                id="laba-1"
                                name="laba"
                                placeholder="10"
                                value={editData.laba}
                                onChange={(e) => setEditData('laba', e.target.value)}
                            />
                            <InputError className="mt-2" message={editErrors.laba} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={editProcessing}>
                                Simpan produk
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="mx-6 px-3">
                <DataTable columns={buildColumns} data={data} filterKey="produk_nama" />
            </Card>
        </AppLayout>
    );
}
