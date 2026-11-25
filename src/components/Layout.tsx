import { Home, Package, Search, ShoppingBag, User, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Layout() {
    const { cartCount, query, setQuery, toast } = useStore();
    const nav = useNavigate();
    const { pathname } = useLocation();
    const onSearch = (v: string) => {
        setQuery(v);
        if (pathname !== '/catalogue') nav('/catalogue');
    };
    return (
        <>
            <header className="header">
                <div className="header-in">
                    <button
                        className="logo"
                        aria-label="Safia – go to catalogue"
                        onClick={() => {
                            setQuery('');
                            nav('/catalogue');
                        }}
                    >
                        S
                    </button>
                    <nav className="topnav" aria-label="Main">
                        <NavLink
                            to="/catalogue"
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                        >
                            Shop
                        </NavLink>
                        <NavLink
                            to="/orders"
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                        >
                            Orders
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                        >
                            Profile
                        </NavLink>
                    </nav>
                    <label className="search">
                        <Search size={18} color="#7C6F65" />
                        <input
                            type="search"
                            placeholder="Search bakery…"
                            aria-label="Search products"
                            value={query}
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={() => setQuery('')}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </label>
                    <button
                        className="cartbtn"
                        aria-label={`Cart, ${cartCount} items`}
                        onClick={() => nav('/cart')}
                    >
                        <ShoppingBag size={20} />
                        <b>{cartCount}</b>
                    </button>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="footer-in">
                    <span>Safia — Online Ordering</span>
                    <span className="pill">Prototype using sample data</span>
                    <span>
                        Coursework concept only. Not an official Safia product.
                    </span>
                </div>
            </footer>
            <nav className="tabbar" aria-label="Primary">
                <NavLink
                    to="/catalogue"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    <Home size={20} />
                    Shop
                </NavLink>
                <NavLink
                    to="/orders"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    <Package size={20} />
                    Orders
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    <User size={20} />
                    Profile
                </NavLink>
            </nav>
            {toast && (
                <div className="toast" role="status">
                    {toast}
                </div>
            )}
        </>
    );
}
