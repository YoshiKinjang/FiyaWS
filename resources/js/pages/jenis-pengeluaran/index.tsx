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
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns, JenisPengeluaran } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Jenis Pengeluaran',
        href: route('jenis-pengeluaran.index'),
    },
];

interface Props extends PageProps {
    expenseTypes: JenisPengeluaran[];
}

export default function JenisPengeluaranPage({ expenseTypes }: Props) {
    const [isAddOpen, setAddOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<JenisPengeluaran | null>(null);

    const {
        data: addData,
        setData: setAddData,
        post,
        processing: addProcessing,
        errors: addErrors,
        reset: addReset,
    } = useForm({
        jenis: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        jenis: '',
    });

    const handleAddSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('jenis-pengeluaran.store'), {
            onSuccess: () => {
                addReset();
                setAddOpen(false);
            },
        });
    };

    const handleEditSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selected) return;
        put(route('jenis-pengeluaran.update', selected.id), {
            onSuccess: () => setEditOpen(false),
        });
    };

    function openEditDialog(item: JenisPengeluaran) {
        setSelected(item);
        setEditData('jenis', item.jenis);
        setEditOpen(true);
    }

    function openDeleteDialog(item: JenisPengeluaran) {
        if (confirm(`Yakin ingin menghapus jenis pengeluaran "${item.jenis}"?`)) {
            router.delete(route('jenis-pengeluaran.destroy', item.id));
        }
    }

    const buildColumns = columns({
        onEdit: openEditDialog,
        onDelete: openDeleteDialog,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Jenis Pengeluaran" />

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
                <div className="item s-center mx-6 mt-6 flex justify-between">
                    <Heading title={'Jenis Pengeluaran'} description={'Master data untuk jenis pengeluaran.'}></Heading>
                    <DialogTrigger asChild>
                        <Button variant={'default'}>
                            <Plus /> Tambah Baru
                        </Button>
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <form onSubmit={handleAddSubmit}>
                        <DialogHeader>
                            <DialogTitle>Tambah Jenis Pengeluaran</DialogTitle>
                            <DialogDescription>Buat jenis pengeluaran baru. Klik simpan untuk menyimpan.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-6">
                            <Label htmlFor="jenis">Nama Jenis Pengeluaran</Label>
                            <Input
                                id="jenis"
                                name="jenis"
                                placeholder="Contoh: Listrik, Air, etc."
                                value={addData.jenis}
                                onChange={(e) => setAddData('jenis', e.target.value)}
                            />
                            <InputError className="mt-2" message={addErrors.jenis} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={addProcessing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Jenis Pengeluaran</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3 py-6">
                            <Label htmlFor="edit-jenis">Nama Jenis Pengeluaran</Label>
                            <Input 
                                id="edit-jenis"
                                value={editData.jenis} 
                                onChange={(e) => setEditData('jenis', e.target.value)} 
                            />
                            <InputError message={editErrors.jenis} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button type="submit" disabled={editProcessing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="mx-6 px-3">
                <DataTable columns={buildColumns} data={expenseTypes} />
            </Card>
        </AppLayout>
    );
}
