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
import { Head, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { DataTable } from '../../components/ui/data-table';
import { columns, KategoriProduk } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List kategori produk',
        href: '/settings/profile',
    },
];

interface Props {
    data: KategoriProduk[];
}

export default function KategoriDatalist({ data }: Props) {
    const [open, setOpen] = useState(false);
    const {
        data: formData,
        errors,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        kategori: '',
    });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('kategori.store'), {
            onSuccess: () => {
                reset();
                setOpen(false); // tutup modal otomatis
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List Kategori Produk" />
            {/* <Fragment> */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <div className="item s-center mx-6 mt-6 flex justify-between">
                        <Heading title={'Kategori'} description={'Master data kategori'}></Heading>
                        <DialogTrigger asChild>
                            <Button variant={'default'}>
                                <Plus /> Tambah baru
                            </Button>
                        </DialogTrigger>
                    </div>
                    <DialogContent>
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>Buat kategori produk</DialogTitle>
                                <DialogDescription>Buat kategori baru untuk produk warung sayur kamu. Klik save untuk menyimpan</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-3 py-6">
                                <Label htmlFor="kategori-1">Nama kategori</Label>
                                <Input
                                    id="kategori-1"
                                    name="kategori"
                                    placeholder="Sayuran..."
                                    value={formData.kategori}
                                    onChange={(e) => setData('kategori', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.kategori} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    Simpan kategori
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            {/* </Fragment> */}
            <Card className="mx-6 px-3">
                <DataTable columns={columns} data={data} />
            </Card>
        </AppLayout>
    );
}
