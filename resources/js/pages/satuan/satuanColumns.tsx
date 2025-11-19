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

export type SatuanProduk = {
    satuan_produk_id: number;
    satuan: string;
    created_at: string;
}

interface BuildColumnsProps {
    onEdit: (row: SatuanProduk) => void;
    onDelete: (row: SatuanProduk) => void;
}

export function satuanColumns({
    onEdit,
    onDelete,
}: BuildColumnsProps): ColumnDef<SatuanProduk>[] {
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
            accessorKey: "satuan",
            header: "satuan",
        },
        {
            accessorKey: "created_at",
            header: "Dibuat",
        },
        {
            id: "actions",
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