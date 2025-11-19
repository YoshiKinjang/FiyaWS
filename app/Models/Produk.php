<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $table = 'produk';
    protected $primaryKey = 'produk_id';

    public $timestamps = true;

    protected $fillable = [
        'produk_nama',
        'kategori_id',
        'satuan_id',
        'harga_beli',
        'harga_jual',
        'stok',
        'laba',
        'is_deleted',
        'created_at'
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriProduk::class, 'kategori_id', 'kategori_produk_id');
    }

    public function satuan()
    {
        return $this->belongsTo(SatuanProduk::class, 'satuan_id', 'kategori_produk_id');
    }
}
