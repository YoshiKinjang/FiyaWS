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
        Schema::create('produk', function (Blueprint $table) {
            $table->increments('produk_id');
            $table->string('produk_nama', 255)->unique();

            $table->unsignedInteger('kategori_id')->nullable();
            $table->unsignedInteger('satuan_id')->nullable();

            $table->integer('harga_beli')->default(0);
            $table->integer('harga_jual')->default(0);
            $table->integer('stok')->default(0);
            $table->integer('laba');
            $table->boolean('is_deleted')->default(false);

            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('kategori_id')
                ->references('kategori_produk_id')->on('kategori_produk')
                ->onUpdate('cascade')->onDelete('set null');

            $table->foreign('satuan_id')
                ->references('satuan_produk_id')->on('satuan_produk')
                ->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
