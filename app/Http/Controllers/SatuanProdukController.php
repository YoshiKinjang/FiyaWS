<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Controller;
use Illuminate\Http\Request;
use App\Models\KategoriProduk;
use App\Models\SatuanProduk;

class SatuanProdukController extends Controller
{
    public function index()
    {
        return Inertia::render('satuan/satuanDatalist', [
            'data' => SatuanProduk::orderBy('satuan_produk_id', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'satuan' => 'required|string|max:100|unique:satuan_produk,satuan',
        ], [
            'satuan.required' => 'Nama satuan wajib diisi.',
            'satuan.unique' => 'Satuan sudah ada, gunakan nama lain.',
            'satuan.max' => 'Nama satuan maksimal 100 karakter.',
        ]);

        SatuanProduk::create($validated);
        return redirect()->back()->with('success', 'Satuan berhasil dibuat.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'satuan' => 'required|string|max:100|unique:satuan_produk,satuan',
        ], [
            'satuan.required' => 'Nama satuan wajib diisi.',
            'satuan.unique' => 'Satuan sudah ada, gunakan nama lain.',
            'satuan.max' => 'Nama satuan maksimal 100 karakter.',
        ]);

        $satuan = SatuanProduk::findOrFail($id);
        $satuan->update($validated);

        return back()->with('success', 'Satuan berhasil diperbarui');
    }

    public function destroy($id)
    {
        $satuan = SatuanProduk::findOrFail($id);
        $satuan->delete();

        return back()->with('success', 'Satuan berhasil dihapus');
    }
}
