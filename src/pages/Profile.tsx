import { LogOut, Mail, Package, Phone, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { SUPPORT } from '../data';

export default function Profile() {
    const { customer, updateCustomer, logout, showToast } = useStore();
    const nav = useNavigate();
    const [name, setName] = useState(customer?.name ?? '');
    const [email, setEmail] = useState(customer?.email ?? '');
    const [err, setErr] = useState<Record<string, string>>({});
    if (!customer) return null;
    const save = () => {
        const e: Record<string, string> = {};
        if (name.trim().length < 2) e.name = 'Please enter your name.';
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
            e.email = 'Enter a valid email address.';
        setErr(e);
        if (Object.keys(e).length) return;
        updateCustomer({ ...customer, name: name.trim(), email: email.trim() });
        showToast('Profile saved.');
    };
    return (
        <div className="page">
            <div className="narrow stack">
                <span className="eyebrow">Your account</span>
                <h1>Profile</h1>
                <section className="card stack">
                    <h3>Customer information</h3>
                    <label className="field">
                        <span>Name</span>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {err.name && <p className="err">{err.name}</p>}
                    </label>
                    <label className="field">
                        <span>Phone (verified)</span>
                        <input
                            className="input"
                            value={customer.phone}
                            readOnly
                            aria-readonly
                        />
                    </label>
                    <label className="field">
                        <span>Email (optional)</span>
                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {err.email && <p className="err">{err.email}</p>}
                    </label>
                    <button className="btn block" onClick={save}>
                        Save changes
                    </button>
                </section>
                <Link className="card row" to="/orders">
                    <span>
                        <Package size={18} style={{ verticalAlign: -3 }} />{' '}
                        <b>Order history</b>
                    </span>
                    <span className="muted">View</span>
                </Link>
                <section className="card stack">
                    <h3>Support</h3>
                    <p className="muted">
                        Sample contact details for this prototype.
                    </p>
                    <p>
                        <Phone size={16} style={{ verticalAlign: -3 }} />{' '}
                        {SUPPORT.phone}
                    </p>
                    <p>
                        <Mail size={16} style={{ verticalAlign: -3 }} />{' '}
                        {SUPPORT.email}
                    </p>
                    <p className="muted">{SUPPORT.hours}</p>
                </section>
                <button
                    className="btn outline block"
                    onClick={() => {
                        logout();
                        nav('/');
                    }}
                >
                    <LogOut size={18} />
                    Log out
                </button>
                <button
                    className="link"
                    onClick={() => {
                        ['customer', 'cart', 'draft', 'orders'].forEach((k) =>
                            localStorage.removeItem(`safia.${k}`)
                        );
                        window.location.reload();
                    }}
                >
                    <RotateCcw size={14} />
                    Reset prototype data
                </button>
            </div>
        </div>
    );
}
