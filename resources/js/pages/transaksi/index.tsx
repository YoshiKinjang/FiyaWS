import { useState, useEffect } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Search, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatRupiah } from '@/utility/format-rupiah';

// --- Type Definitions ---
interface Product {
    id: number;
    nama: string;
    harga_jual: number;
    stok: number;
}

interface CartItem extends Product {
    qty: number;
    subtotal: number;
}

interface TransaksiPageProps extends PageProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Transaksi', href: route('transaksi.index') }];

// --- Main Page Component ---
export default function TransaksiPage() {
    const { products } = usePage<TransaksiPageProps>().props;
    const [view, setView] = useState('kasir'); // 'kasir' | 'pembayaran' | 'detailhutang'
    const [paymentData, setPaymentData] = useState<any>(null);
    const [debtData, setDebtData] = useState<any>(null);

    const handleNavigate = (page: string) => {
        setView(page);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            {view === 'kasir' && (
                <Kasir
                    products={products}
                    onNavigate={handleNavigate}
                    setPaymentData={setPaymentData}
                    setDebtData={setDebtData}
                />
            )}
            {view === 'pembayaran' && (
                <Pembayaran paymentData={paymentData} onNavigate={handleNavigate} />
            )}
            {view === 'detailhutang' && (
                <DetailHutang debtData={debtData} onNavigate={handleNavigate} />
            )}
        </AppLayout>
    );
}

// --- DetailHutang Component ---
interface DetailHutangProps {
    debtData: any;
    onNavigate: (page: string) => void;
}

function DetailHutang({ debtData, onNavigate }: DetailHutangProps) {
    const { post, processing, errors } = useForm({
        ...debtData,
        isDebt: true,
    });

    if (!debtData) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Tidak ada data hutang untuk ditampilkan.</p>
            </div>
        );
    }

    const handleSaveDebt = () => {
        post(route('transaksi.store'), {
            onSuccess: () => {
                onNavigate('kasir');
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => onNavigate('kasir')} variant="outline" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                        <CardTitle>Detail Hutang</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {/* Generic Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
                            <p className="font-bold mb-2">Terjadi kesalahan:</p>
                            <ul>
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Nama Pembeli:</span>
                        <span className="font-medium">{debtData.customerName}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-muted-foreground">Item Pembelian:</span>
                        {debtData.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.nama} x{item.qty}</span>
                                <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center py-3 border-t text-lg">
                        <span className="font-semibold">Total Hutang:</span>
                        <span className="font-semibold">{formatRupiah(debtData.total)}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button onClick={handleSaveDebt} disabled={processing} className="w-full">
                        {processing ? 'Menyimpan...' : 'Simpan Hutang'}
                    </Button>
                    <Button onClick={() => onNavigate('kasir')} variant="outline" className="w-full">
                        Batal
                    </Button>
                    <Button variant="outline" className="w-full">
                        Cetak Nota
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// --- Pembayaran Component ---
interface PembayaranProps {
    paymentData: any;
    onNavigate: (page: string) => void;
}

function Pembayaran({ paymentData, onNavigate }: PembayaranProps) {
    const { data, setData, post, processing, errors } = useForm({
        customerName: '',
        total: 0,
        metodePembayaran: 'tunai',
        uangDibayar: '',
        items: [],
    });

    useEffect(() => {
        if (paymentData) {
            setData({
                ...data,
                customerName: paymentData.customerName,
                total: paymentData.total,
                items: paymentData.items,
            });
        }
    }, [paymentData]);

    if (!paymentData) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Tidak ada data pembayaran untuk ditampilkan.</p>
            </div>
        );
    }

    const total = paymentData.total;
    const dibayar = parseFloat(data.uangDibayar) || 0;
    const kembalian = dibayar - total;

    const handleComplete = () => {
        post(route('transaksi.store'), {
            onSuccess: () => {
                onNavigate('kasir');
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => onNavigate('kasir')} variant="outline" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                        <CardTitle>Detail Pembayaran</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {paymentData.customerName && (
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Nama Pembeli:</span>
                            <span className="font-medium">{paymentData.customerName}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <span className="text-muted-foreground">Item Pembelian:</span>
                        {paymentData.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.nama} x{item.qty}</span>
                                <span className="font-medium">{formatRupiah(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center py-3 border-t text-lg">
                        <span className="font-semibold">Total Belanja:</span>
                        <span className="font-semibold">{formatRupiah(total)}</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="uangDibayar">Uang Dibayar</Label>
                        <Input
                            id="uangDibayar"
                            type="number"
                            value={data.uangDibayar}
                            onChange={(e) => setData('uangDibayar', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="metodePembayaran">Metode Pembayaran</Label>
                        <Select onValueChange={(value) => setData('metodePembayaran', value)} defaultValue={data.metodePembayaran}>
                            <SelectTrigger id="metodePembayaran">
                                <SelectValue placeholder="Pilih metode pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tunai">Tunai</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                                <SelectItem value="qris">QRIS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {dibayar >= total && dibayar > 0 && (
                        <div className="flex justify-between py-3 bg-muted px-4 rounded-md">
                            <span className="font-semibold">Kembalian:</span>
                            <span className="font-semibold">{formatRupiah(kembalian)}</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        onClick={handleComplete}
                        disabled={dibayar < total || processing}
                        className="w-full"
                    >
                        {processing ? 'Menyimpan...' : 'Selesaikan Pembayaran'}
                    </Button>
                    <Button variant="outline" className="w-full">
                        Cetak Struk
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// --- Kasir Component ---
interface KasirProps {
    products: Product[];
    onNavigate: (page: string) => void;
    setPaymentData: (data: any) => void;
    setDebtData: (data: any) => void;
}

function Kasir({ products, onNavigate, setPaymentData, setDebtData }: KasirProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [showNameError, setShowNameError] = useState(false);

    const filteredProducts = products.filter(p => 
        p.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.qty >= product.stok) {
                // Optional: show a toast notification or alert
                alert(`Stok untuk ${product.nama} tidak mencukupi.`);
                return;
            }
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.harga_jual }
                    : item
            ));
        } else {
            if (product.stok < 1) {
                alert(`Stok untuk ${product.nama} habis.`);
                return;
            }
            setCart([...cart, { ...product, qty: 1, subtotal: product.harga_jual }]);
        }
    };

    const updateQty = (id: number, delta: number) => {
        const itemToUpdate = cart.find(item => item.id === id);
        if (!itemToUpdate) return;

        const newQty = itemToUpdate.qty + delta;
        
        if (delta > 0 && newQty > itemToUpdate.stok) {
            alert(`Stok untuk ${itemToUpdate.nama} tidak mencukupi.`);
            return;
        }

        if (newQty <= 0) {
            removeFromCart(id);
        } else {
            setCart(cart.map(item =>
                item.id === id
                    ? { ...item, qty: newQty, subtotal: newQty * item.harga_jual }
                    : item
            ));
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const setQty = (id: number, qtyString: string) => {
        const itemToUpdate = cart.find(item => item.id === id);
        if (!itemToUpdate) return;

        if (qtyString === '') {
            setCart(cart.map(item =>
                item.id === id
                    ? { ...item, qty: 0, subtotal: 0 } // Temporarily allow 0 for typing
                    : item
            ));
            return;
        }

        const newQty = parseInt(qtyString, 10);
        if (isNaN(newQty) || newQty < 0) {
            return;
        }

        if (newQty === 0) {
            removeFromCart(id);
            return;
        }

        if (newQty > itemToUpdate.stok) {
            alert(`Stok untuk ${itemToUpdate.nama} hanya ${itemToUpdate.stok}.`);
            setCart(cart.map(item =>
                item.id === id
                    ? { ...item, qty: itemToUpdate.stok, subtotal: itemToUpdate.stok * item.harga_jual }
                    : item
            ));
            return;
        }

        setCart(cart.map(item =>
            item.id === id
                ? { ...item, qty: newQty, subtotal: newQty * item.harga_jual }
                : item
        ));
    };

    const totalBelanja = cart.reduce((sum, item) => sum + item.subtotal, 0);

    const handlePayment = () => {
        setPaymentData({
            items: cart,
            customerName,
            total: totalBelanja,
        });
        onNavigate('pembayaran');
    };

    const handleDebt = () => {
        if (!customerName.trim()) {
            setShowNameError(true);
            return;
        }
        setShowNameError(false);
        setDebtData({
            items: cart,
            customerName,
            total: totalBelanja,
        });
        onNavigate('detailhutang');
    };

    return (
        <div className="flex-1 p-4 lg:p-6 flex gap-6 h-[calc(100vh-6rem)]">
            {/* Left: Product List */}
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="cursor-pointer hover:border-primary transition-colors"
                            >
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <span className="font-semibold text-card-foreground">{product.nama}</span>
                                    <span className="text-primary">{formatRupiah(product.harga_jual)}</span>
                                    <span className="text-muted-foreground text-sm">Stok: {product.stok}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Right: Cart */}
            <Card className="w-full max-w-md flex flex-col">
                <CardHeader>
                    <CardTitle>Keranjang</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3 overflow-y-auto">
                    {cart.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Keranjang kosong
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="border rounded-lg p-3 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold">{item.nama}</span>
                                    <Button
                                        onClick={() => removeFromCart(item.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => updateQty(item.id, -1)}
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                        >
                                            <Minus size={14} />
                                        </Button>
                                        <Input
                                            type="number"
                                            value={item.qty === 0 ? '' : item.qty}
                                            onChange={(e) => setQty(item.id, e.target.value)}
                                            onBlur={(e) => {
                                                if (e.target.value === '') {
                                                    removeFromCart(item.id);
                                                }
                                            }}
                                            className="w-14 h-8 text-center"
                                        />
                                        <Button
                                            onClick={() => updateQty(item.id, 1)}
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                    <span className="font-semibold w-24 text-right">{formatRupiah(item.subtotal)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4 !p-4 border-t">
                    <div className="w-full flex flex-col gap-1.5">
                        <Label htmlFor="customerName">Nama Pembeli {showNameError && <span className="text-destructive">*wajib untuk hutang</span>}</Label>
                        <Input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => {
                                setCustomerName(e.target.value);
                                if (showNameError && e.target.value.trim()) {
                                    setShowNameError(false);
                                }
                            }}
                            className={showNameError ? 'border-destructive' : ''}
                            placeholder="Nama pembeli (opsional)"
                        />
                        {showNameError && (
                            <p className="text-sm text-destructive">Nama pembeli harus diisi untuk mencatat hutang.</p>
                        )}
                    </div>

                    <div className="w-full flex justify-between items-center font-semibold text-lg">
                        <span>Total Belanja:</span>
                        <span>{formatRupiah(totalBelanja)}</span>
                    </div>

                    <div className="w-full flex gap-3">
                        <Button
                            onClick={handleDebt}
                            disabled={cart.length === 0}
                            variant="outline"
                            className="flex-1"
                        >
                            Hutang
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={cart.length === 0}
                            className="flex-1"
                        >
                            Bayar
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
