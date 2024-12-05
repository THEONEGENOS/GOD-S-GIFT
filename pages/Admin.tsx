import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Data {
    id: number;
    water_type: string;
    gallon_count: number;
    total_price: number;
    address: string;
    email: string;
    created_at: string;
    payment_status: string;
    payment_type: string;
}

  
const Admin: React.FC = () => {
    const [activePage, setActivePage] = useState<'dashboard' | 'orders' | 'history'| 'inventory'>('orders');
    const [inventoryData, setInventoryData] = useState<{ id: number; product_name: string; stock: number; isEditing?: boolean; editStock?: number }[]>([]);
    const [ordersData, setOrdersData] = useState<Data[]>([]);
    const [historyData, setHistoryData] = useState<Data[]>([]);
    const router = useRouter();

    

    const handleAdmin = () => { 
        try {
            localStorage.removeItem("user");
        } catch (error) {
            console.error("Failed removing admin", error)
        }
        router.push('/Login');
    };


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.email == "admin@gmail.com") {
          console.log("Admin logged in succesfully")
        } else {
          alert("You're not admin. Redirecting to information page...");
          router.push("/Information");
        }
      }, [router]);

      const fetchInventoryData = async () => {
        try {
            const res = await fetch(`/api/inventory`);
            if (res.ok) {
                const data = await res.json();
                const initializedData = data.map((item: { id: number; product_name: string; stock: number }) => ({
                    ...item,
                    isEditing: false,
                    editStock: item.stock,
                }));
                setInventoryData(initializedData);
            } else {
                console.error('Failed to fetch inventory data');
            }
        } catch (error) {
            console.error('Error fetching inventory data', error);
        }
    };

    const handleUpdateStatus = async (orderId: number) => {
        if (confirm('Are you sure you want to mark this order as Paid?')) {
            try {
                const res = await fetch(`/api/adminOrder`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId }),
                });
                if (res.ok) {
                    alert('Order status updated successfully.');
                    fetchOrdersData();
                } else {
                    alert('Failed to update order status.');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
            }
        }
    };
    
    const handleDeleteOrder = async (orderId: number) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                const res = await fetch(`/api/adminOrder`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId }),
                });
                if (res.ok) {
                    alert('Order deleted successfully.');
                    // Refresh data
                    fetchOrdersData();
                } else {
                    alert('Failed to delete order.');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const fetchOrdersData = async () => {
        try {
            const value = "orders"
            const res = await fetch(`/api/History?value=${value}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOrdersData(data);
                } else {
                    console.error('Orders data is not an array:', data);
                }
            } else {
                console.error('Failed to fetch orders data');
            }
        } catch (error) {
            console.error('Error fetching orders data', error);
        }
    };
    
    useEffect(() => {
    if (activePage === 'inventory') {
        fetchInventoryData();
        } else if (activePage === 'orders') {
            fetchOrdersData();
        } else if (activePage === 'history') {
            const fetchHistoryData = async () => {
                try {
                    const value = "history"
                    const res = await fetch(`/api/History?value=${value}`);
                    if (res.ok) {
                        const data = await res.json();
                        setHistoryData(data);
                    } else {
                        console.error('Failed to fetch history data');
                    }
                } catch (error) {
                    console.error('Error fetching history data', error);
                }
            };
            fetchHistoryData();
        }
    }, [activePage]);

    return (
        <div className="flex min-h-screen">
            <nav className="relative w-64 bg-blue-950 p-10 flex flex-col justify-between">
                <ul className="space-y-8">
                    {/* Sidebar buttons */}
                    <li>
                        <button
                            onClick={() => setActivePage('orders')}
                            className={`block text-center py-2 px-4 rounded transition w-full ${activePage === 'orders' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-950 hover:bg-blue-500 active:bg-blue-700 active:scale-95 active:text-white'}`}
                        >
                            Orders
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActivePage('history')}
                            className={`block text-center py-2 px-4 rounded transition w-full ${activePage === 'history' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-950 hover:bg-blue-500 active:bg-blue-700 active:scale-95 active:text-white'}`}
                        >
                            History
                        </button>
                    </li>
                    
                    <li>
                        <button
                            onClick={() => setActivePage('inventory')}
                            className={`block text-center py-2 px-4 rounded transition w-full ${activePage === 'inventory' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-950 hover:bg-blue-500 active:bg-blue-700 active:scale-95 active:text-white'}`}
                        >
                            Inventory
                        </button>
                    </li>
                </ul>
                <div className="absolute bottom-10 w-[180px]">
                    <button onClick={handleAdmin} 
                        className="block bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700 active:bg-red-800 active:scale-95 w-[180px] transition">
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="flex-1 p-10">
            {activePage === 'orders' && (
            <>
                <h1 className="text-4xl font-bold mb-8 text-blue-950">Orders</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">order_id</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">change_status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">delete_order</th>
                            </tr>
                        </thead>
                        <tbody>
                        {ordersData.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.address}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.water_type}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.gallon_count}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.total_price}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.payment_status}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{order.created_at}</td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleUpdateStatus(order.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                    >
                                        Mark as Paid
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </>
        )}

        



        {activePage === 'history' && (
            <>
                <h1 className="text-4xl font-bold mb-8 text-blue-950">History</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">order_id</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Status </th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((payments) => (
                                <tr key={payments.id}>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.address}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.water_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.gallon_count}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.total_price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.created_at}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{payments.payment_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}


        {activePage === 'inventory' && (
            <>
                <h1 className="text-4xl font-bold mb-8 text-blue-950">Inventory</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Product Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.map((inventory, index) => (
                                <tr key={inventory.id}>
                                    <td className="px-6 py-4 text-sm text-gray-800">{inventory.product_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                        {inventory.isEditing ? (
                                            <input
                                                type="number"
                                                value={inventory.editStock}
                                                onChange={(e) => {
                                                    const updatedInventory = [...inventoryData];
                                                    updatedInventory[index].editStock = parseInt(e.target.value) || 0;
                                                    setInventoryData(updatedInventory);
                                                }}
                                                className="border border-gray-300 px-2 py-1 w-16 text-center"
                                            />
                                        ) : (
                                            inventory.stock
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">
                                    {inventory.isEditing ? (
                                        <>
                                        <button
                                            onClick={async () => {
                                            try {
                                                const updatedInventory = [...inventoryData];
                                                const itemToSave = updatedInventory[index];
                                                const response = await fetch(`/api/inventory`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: inventory.id, stock: itemToSave.editStock }),
                                                });

                                                if (response.ok) {
                                                updatedInventory[index].stock = itemToSave.editStock ?? 0;
                                                updatedInventory[index].isEditing = false;
                                                setInventoryData(updatedInventory);
                                                } else {
                                                console.error('Failed to save updated inventory');
                                                }
                                            } catch (error) {
                                                console.error('Error updating inventory:', error);
                                            } finally {
                                                fetchInventoryData();
                                            }
                                            }}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                            const updatedInventory = [...inventoryData];
                                            updatedInventory[index].isEditing = false;
                                            setInventoryData(updatedInventory);
                                            }}
                                            className="ml-2 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                                        >
                                            Cancel
                                        </button>
                                        </>
                                    ) : (
                                        <button
                                        onClick={() => {
                                            const updatedInventory = [...inventoryData];
                                            updatedInventory[index].isEditing = true;
                                            updatedInventory[index].editStock = inventory.stock;
                                            setInventoryData(updatedInventory);
                                        }}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        >
                                        Edit
                                        </button>
                                    )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
            </div>
        </div>
    );
};

export default Admin;