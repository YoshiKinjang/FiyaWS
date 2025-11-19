<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengeluaranKulakan extends Model
{
    use HasFactory;

    protected $table = 'pengeluaran_kulakan';
    protected $primaryKey = 'pengeluaran_kulakan_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'produk_id',
        'qty',
        'harga_beli',
        'subtotal',
        'note',
        'tgl_pengeluaran',
    ];

    public function produk()
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'produk_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
