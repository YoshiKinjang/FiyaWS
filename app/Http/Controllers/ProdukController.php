<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Produk;
use Inertia\Controller;
use App\Models\SatuanProduk;
use Illuminate\Http\Request;
use App\Models\KategoriProduk;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Produk::select(
            'produk.*',
            'kategori_produk.kategori as kategori_nama',
            'satuan_produk.satuan as satuan_nama'
        )
            ->leftJoin('kategori_produk', 'produk.kategori_id', '=', 'kategori_produk.kategori_produk_id')
            ->leftJoin('satuan_produk', 'produk.satuan_id', '=', 'satuan_produk.satuan_produk_id')
            ->where('produk.is_deleted', 0)
            ->orderBy('produk.produk_id', 'desc')
            ->get();

        $kategori = KategoriProduk::all();
        $satuan = SatuanProduk::all();
        return Inertia::render('produk/produkDatalist', [
            'data' => $data,
            'pilihanKategori' => $kategori,
            'pilihanSatuan' => $satuan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'produk_nama' => 'required|string|max:255',
            'kategori_id' => 'required|nullable|exists:kategori_produk,kategori_produk_id',
            'satuan_id' => 'required|nullable|exists:satuan_produk,satuan_produk_id',
            'laba' => 'required|integer|min:0',
        ], [
            'produk_nama.required' => 'Nama produk wajib diisi.',
            'kategori_id.required' => 'Kategori produk wajib diisi.',
            'satuan_id.required' => 'Satuan produk wajib diisi.',
            'laba.min' => 'Laba tidak boleh negatif.',
        ]);

        Produk::create($validated);
        return redirect()->back()->with('success', 'Produk berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'produk_nama' => 'required|string|max:255',
            'kategori_id' => 'required|nullable|exists:kategori_produk,kategori_produk_id',
            'satuan_id' => 'required|nullable|exists:satuan_produk,satuan_produk_id',
            'laba' => 'required|integer|min:0',
        ]);

        $produk = Produk::findOrFail($id);
        $produk->update($validated);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $produk = Produk::findOrFail($id);
        $produk->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }
}
