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

export type KategoriProduk = {
    id: number;
    kategori: string;
    created_at: string;
};

export const columns: ColumnDef<KategoriProduk>[] = [
    {
        id: 'no',
        header: 'No',
        cell: ({ row, table }) => {
            const page = table.getState().pagination.pageIndex;
            const size = table.getState().pagination.pageSize;
            return page * size + row.index + 1;
        },
    },
    {
        accessorKey: 'kategori',
        header: 'Kategori',
    },
    {
        accessorKey: 'created_at',
        header: 'Dibuat',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const kategori_produk = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
