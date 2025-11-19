<?php

namespace App\Http\Controllers;

use App\Models\JenisPengeluaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisPengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('jenis-pengeluaran/index', [
            'expenseTypes' => JenisPengeluaran::all()->map(fn ($type) => [
                'id' => $type->jenis_pengeluaran_id,
                'jenis' => $type->jenis,
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis' => ['required', 'string', 'max:150', 'unique:jenis_pengeluaran,jenis'],
        ]);

        JenisPengeluaran::create($request->all());

        return redirect()->route('jenis-pengeluaran.index')->with('success', 'Jenis pengeluaran berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'jenis' => ['required', 'string', 'max:150', 'unique:jenis_pengeluaran,jenis,'.$id.',jenis_pengeluaran_id'],
        ]);

        $jenisPengeluaran = JenisPengeluaran::findOrFail($id);
        $jenisPengeluaran->update($request->all());

        return redirect()->route('jenis-pengeluaran.index')->with('success', 'Jenis pengeluaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jenisPengeluaran = JenisPengeluaran::findOrFail($id);
        $jenisPengeluaran->delete();

        return redirect()->route('jenis-pengeluaran.index')->with('success', 'Jenis pengeluaran berhasil dihapus.');
    }
}