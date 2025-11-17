<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengeluaran_kulakan', function (Blueprint $table) {
            $table->increments('pengeluaran_kulakan_id');

            $table->unsignedBigInteger('user_id');
            $table->unsignedInteger('produk_id');

            $table->integer('qty')->default(0);
            $table->integer('harga_beli')->default(0);
            $table->integer('subtotal')->default(0);

            $table->text('note')->nullable();
            $table->timestamp('tgl_pengeluaran')->useCurrent();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('restrict');

            $table->foreign('produk_id')
                ->references('produk_id')->on('produk')
                ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluaran_kulakan');
    }
};
