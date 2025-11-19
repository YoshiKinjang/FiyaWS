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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DataTable } from '../../components/ui/data-table';
import { satuanColumns, SatuanProduk } from './satuanColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List satuan produk',
        href: '/satuan',
    },
];

interface Props {
    data: SatuanProduk[];
}

export default function SatuanDatalist({ data }: Props) {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState<SatuanProduk | null>(null);

    const {
        data: formData,
        errors,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        satuan: '',
    });

    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
        put,
        processing: editProcessing,
    } = useForm({
        satuan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('satuan.store'), {
            onSuccess: () => {
                reset();
                setOpen(false); // tutup modal otomatis
            },
        });
    };

    function handleEdit(item: SatuanProduk) {
        setSelected(item);
        setEditData('satuan', item.satuan);
        setOpenEdit(true);
    }

    function handleDelete(item: SatuanProduk) {
        if (confirm(`Yakin ingin menghapus satuan "${item.satuan}"?`)) {
            router.delete(route('satuan.destroy', item.satuan_produk_id));
        }
    }

    const buildColumns = satuanColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Satuan Produk" />
            {/* <Fragment> */}
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="item s-center mx-6 mt-6 flex justify-between">
                    <Heading title={'Satuan'} description={'Master data satuan'}></Heading>
                    <DialogTrigger asChild>
                        <Button variant={'default'}>
                            <Plus /> Tambah baru
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Buat Satuan produk</DialogTitle>
                            <DialogDescription>Buat satuan baru untuk produk warung sayur kamu. Klik simpan untuk menyimpan</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-6">
                            <Label htmlFor="satuan-1">Nama satuan</Label>
                            <Input
                                id="satuan-1"
                                name="satuan"
                                placeholder="kg..."
                                value={formData.satuan}
                                onChange={(e) => setData('satuan', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.satuan} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                Simpan satuan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* </Fragment> */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log(selected);
                            if (!selected) return;
                            put(route('satuan.update', selected.satuan_produk_id), {
                                onSuccess: () => setOpenEdit(false),
                            });
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Edit satuan</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-3 py-6">
                            <Label>Nama satuan</Label>
                            <Input value={editData.satuan} onChange={(e) => setEditData('satuan', e.target.value)} />
                            <InputError message={editErrors.satuan} />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={editProcessing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Card className="mx-6 px-3">
                <DataTable columns={buildColumns} data={data} />
            </Card>
        </AppLayout>
    );
}