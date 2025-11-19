"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

export interface JenisPengeluaran {
    id: string
    jenis: string
}

interface ColumnsProps {
    onEdit: (item: JenisPengeluaran) => void
    onDelete: (item: JenisPengeluaran) => void
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<JenisPengeluaran>[] => [
    {
        accessorKey: "jenis",
        header: "Jenis Pengeluaran",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-500">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
