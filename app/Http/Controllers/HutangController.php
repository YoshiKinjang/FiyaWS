<?php

namespace App\Http\Controllers;

use App\Models\Hutang;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HutangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $debts = Hutang::with('transaksi')
            ->orderBy('is_dibayar', 'asc')
            ->orderBy('tgl_hutang', 'desc')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->hutang_id,
                'nama' => $item->transaksi->pembeli ?? 'N/A',
                'nominal' => $item->hutang_total,
                'tanggal' => Carbon::parse($item->tgl_hutang)->toDateString(),
                'status' => $item->is_dibayar ? 'Lunas' : 'Belum Lunas',
            ]);

        return Inertia::render('hutang/index', [
            'debts' => $debts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $hutang = Hutang::findOrFail($id);
        $hutang->is_dibayar = true;
        $hutang->save();

        // Optionally, create a payment record as well
        // For now, just updating the status as requested

        return redirect()->route('hutang.index')->with('success', 'Hutang berhasil dilunasi.');
    }
}