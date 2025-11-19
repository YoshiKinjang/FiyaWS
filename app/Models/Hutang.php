<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hutang extends Model
{
    use HasFactory;

    protected $table = 'hutang';
    protected $primaryKey = 'hutang_id';

    public $timestamps = false;

    protected $fillable = [
        'transaksi_id',
        'hutang_total',
        'is_dibayar',
        'tgl_hutang',
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'transaksi_id', 'transaksi_id');
    }
}