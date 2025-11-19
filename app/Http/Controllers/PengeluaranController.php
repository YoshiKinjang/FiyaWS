<?php

namespace App\Http\Controllers;

use App\Models\JenisPengeluaran;
use App\Models\PengeluaranLainnya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PengeluaranController extends Controller
{
    public function index()
    {
        return Inertia::render('pengeluaran', [
            'expenses' => PengeluaranLainnya::with('jenisPengeluaran')
                ->orderBy('tgl_pengeluaran', 'desc')
                ->get()
                ->map(fn ($expense) => [
                    'id' => $expense->pengeluaran_lainnya_id,
                    'jenis' => $expense->jenisPengeluaran ? $expense->jenisPengeluaran->jenis : 'Lainnya',
                    'subtotal' => $expense->subtotal,
                    'tanggal' => date('Y-m-d', strtotime($expense->tgl_pengeluaran)),
                    'catatan' => $expense->note,
                ]),
            'expenseTypes' => JenisPengeluaran::all(['jenis_pengeluaran_id', 'jenis']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis_pengeluaran_id' => ['required', 'exists:jenis_pengeluaran,jenis_pengeluaran_id'],
            'subtotal' => ['required', 'integer', 'min:0'],
            'note' => ['nullable', 'string'],
        ]);

        PengeluaranLainnya::create([
            'user_id' => Auth::id(),
            'jenis_pengeluaran_id' => $request->jenis_pengeluaran_id,
            'subtotal' => $request->subtotal,
            'note' => $request->note,
            'tgl_pengeluaran' => now(),
        ]);

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil disimpan.');
    }
}
