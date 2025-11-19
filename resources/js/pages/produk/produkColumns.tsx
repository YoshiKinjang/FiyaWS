'use client';

import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type Produk = {
    produk_id: number;
    produk_nama: string;
    kategori_id: number;
    kategori_nama: string;
    satuan_id: number;
    satuan_nama:string;
    harga_beli: number;
    harga_jual: number;
    stok: number;
    laba: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

interface BuildColumnsProps {
    onEdit: (row: Produk) => void;
    onDelete: (row: Produk) => void;
}

export function produkColumns({
    onEdit,
    onDelete,
}: BuildColumnsProps): ColumnDef<Produk>[] {
    return [
        {
            id: "no",
            header: "No",
            cell: ({ row, table }) => {
                const page = table.getState().pagination.pageIndex;
                const size = table.getState().pagination.pageSize;
                return page * size + row.index + 1;
            },
        },
        {
            accessorKey: "produk_nama",
            header: "Nama Produk",
        },
        {
            accessorKey: "kategori_nama",
            header: "Kategori",
        },
        {
            accessorKey: "satuan_nama",
            header: "Satuan",
        },
        {
            accessorKey: "harga_jual",
            header: "Harga Jual",
            cell: ({ row }) => {
                const value = row.original.harga_jual;
                return `Rp ${value.toLocaleString("id-ID")}`;
            }
        },
        {
            accessorKey: "stok",
            header: "Stok",
        },
        {
            accessorKey: "laba",
            header: "Laba %",
        },  
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete(item)}
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
}