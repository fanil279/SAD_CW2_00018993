import { ArrowRight, CalendarClock, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { BackLink } from '../components/Shared';
import { useStore } from '../context/StoreContext';
import { addresses, branches, timeSlots } from '../data';
import type { Address, FulfilmentType } from '../types';
import { addDaysISO, formatDate, todayISO } from '../utils/pricing';

type Mode = 'asap' | 'preorder';
// Shared by: 6A Delivery Details (/delivery), 6B Pickup Details (/pickup), 7A Schedule Pre-order (/schedule?type=…)
export default function FulfilmentDetails({
    type: fixed,
    mode,
}: {
    type?: FulfilmentType;
    mode: Mode;
}) {
    const { lines, draft, setFulfilment } = useStore();
    const nav = useNavigate();
    const [sp] = useSearchParams();
    const type: FulfilmentType =
        fixed ?? (sp.get('type') === 'pickup' ? 'pickup' : 'delivery');
    const prev =
        draft.fulfilment?.type === type &&
        draft.fulfilment.preorder === (mode === 'preorder')
            ? draft.fulfilment
            : undefined;
    const today = todayISO();
    const minDate = mode === 'preorder' ? addDaysISO(today, 1) : today;
    const maxDate = addDaysISO(today, mode === 'preorder' ? 30 : 6);
    const [date, setDate] = useState(prev?.date ?? minDate);
    const [slotId, setSlotId] = useState(prev?.slotId ?? '');
    const [addrId, setAddrId] = useState(
        prev?.address?.id ?? (type === 'delivery' ? addresses[0].id : '')
    );
    const [custom, setCustom] = useState(
        prev?.address?.id === 'custom' ? prev.address : (null as Address | null)
    );
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ line: '', district: '' });
    const [branchId, setBranchId] = useState(prev?.branch?.id ?? '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [done, setDone] = useState(false);
    if (!lines.length) return <Navigate to="/cart" replace />;

    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const pastSlot = (label: string) =>
        date === today && parseInt(label.slice(0, 2), 10) * 60 <= nowMin;
    const addrList = custom ? [...addresses, custom] : addresses;

    const saveCustom = () => {
        const e: Record<string, string> = {};
        if (form.line.trim().length < 6)
            e.line =
                'Enter street and house/apartment (at least 6 characters).';
        if (form.district.trim().length < 3) e.district = 'Enter a district.';
        setErrors(e);
        if (Object.keys(e).length) return;
        const a: Address = {
            id: 'custom',
            label: 'New address',
            line: form.line.trim(),
            district: form.district.trim(),
            city: 'Tashkent',
        };
        setCustom(a);
        setAddrId('custom');
        setAdding(false);
    };
    const submit = () => {
        const e: Record<string, string> = {};
        if (type === 'delivery' && !addrList.some((a) => a.id === addrId))
            e.place = 'Please select or add a delivery address.';
        if (type === 'pickup' && !branchId)
            e.place = 'Please select a pickup branch.';
        if (!date || date < minDate)
            e.date =
                mode === 'preorder'
                    ? 'Pre-orders must be for a future date.'
                    : 'Dates in the past are not available.';
        else if (date > maxDate)
            e.date = `Please choose a date on or before ${formatDate(maxDate)}.`;
        const slot = timeSlots.find((s) => s.id === slotId);
        if (!slot) e.slot = 'Please choose a time slot.';
        else if (pastSlot(slot.label))
            e.slot = 'That time slot has already passed.';
        setErrors(e);
        if (Object.keys(e).length || !slot) return;
        setFulfilment({
            type,
            date,
            slotId,
            slotLabel: slot.label,
            preorder: mode === 'preorder',
            address:
                type === 'delivery'
                    ? addrList.find((a) => a.id === addrId)
                    : undefined,
            branch:
                type === 'pickup'
                    ? branches.find((b) => b.id === branchId)
                    : undefined,
        });
        if (mode === 'preorder' && !done) {
            setDone(true);
            return;
        }
        nav('/review');
    };
    const title =
        mode === 'preorder'
            ? 'Schedule a pre-order'
            : type === 'delivery'
              ? 'Delivery details'
              : 'Pickup details';
    return (
        <div className="page">
            <div className="narrow stack">
                <BackLink to="/fulfilment">Back to fulfilment</BackLink>
                <span className="eyebrow">
                    {mode === 'preorder'
                        ? 'Pre-order'
                        : type === 'delivery'
                          ? 'Home delivery'
                          : 'Self-pickup'}
                </span>
                <h1>{title}</h1>
                <p className="muted">
                    {mode === 'preorder'
                        ? 'Pick a future date and time. Dates up to 30 days ahead are available in this prototype.'
                        : 'All addresses, branches and time slots are sample data.'}
                </p>

                <section
                    className="card stack"
                    aria-label={type === 'delivery' ? 'Address' : 'Branch'}
                >
                    <h3>
                        <MapPin size={18} style={{ verticalAlign: -2 }} />{' '}
                        {type === 'delivery'
                            ? 'Delivery address'
                            : 'Pickup branch'}
                    </h3>
                    <div className="stack" role="radiogroup">
                        {type === 'delivery'
                            ? addrList.map((a) => (
                                  <button
                                      key={a.id}
                                      role="radio"
                                      aria-checked={addrId === a.id}
                                      className={`pay ${addrId === a.id ? 'on' : ''}`}
                                      onClick={() => {
                                          setAddrId(a.id);
                                          setErrors({ ...errors, place: '' });
                                      }}
                                  >
                                      <span>
                                          <b>{a.label}</b>
                                          <br />
                                          <span className="muted">
                                              {a.line}, {a.district}, {a.city}
                                          </span>
                                      </span>
                                  </button>
                              ))
                            : branches.map((b) => (
                                  <button
                                      key={b.id}
                                      role="radio"
                                      aria-checked={branchId === b.id}
                                      className={`pay ${branchId === b.id ? 'on' : ''}`}
                                      onClick={() => {
                                          setBranchId(b.id);
                                          setErrors({ ...errors, place: '' });
                                      }}
                                  >
                                      <span>
                                          <b>{b.name}</b>
                                          <br />
                                          <span className="muted">
                                              {b.address} · {b.hours}
                                          </span>
                                      </span>
                                  </button>
                              ))}
                    </div>
                    {type === 'delivery' &&
                        (adding ? (
                            <div className="stack">
                                <label className="field">
                                    <span>Street and house</span>
                                    <input
                                        className="input"
                                        value={form.line}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                line: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. 8 Navoi Street, Apt 12"
                                    />
                                    {errors.line && (
                                        <p className="err">{errors.line}</p>
                                    )}
                                </label>
                                <label className="field">
                                    <span>District</span>
                                    <input
                                        className="input"
                                        value={form.district}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                district: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. Chilanzar"
                                    />
                                    {errors.district && (
                                        <p className="err">{errors.district}</p>
                                    )}
                                </label>
                                <div className="row">
                                    <button
                                        className="btn small"
                                        onClick={saveCustom}
                                    >
                                        Save address
                                    </button>
                                    <button
                                        className="btn outline small"
                                        onClick={() => {
                                            setAdding(false);
                                            setErrors({});
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            !custom && (
                                <button
                                    className="btn outline small"
                                    onClick={() => setAdding(true)}
                                >
                                    <Plus size={16} />
                                    Add a new address
                                </button>
                            )
                        ))}
                    {errors.place && (
                        <p className="err" role="alert">
                            {errors.place}
                        </p>
                    )}
                </section>

                <section className="card stack" aria-label="Date and time">
                    <h3>
                        <CalendarClock
                            size={18}
                            style={{ verticalAlign: -2 }}
                        />{' '}
                        {type === 'delivery' ? 'Delivery' : 'Pickup'} date and
                        time
                    </h3>
                    <label className="field">
                        <span>Date</span>
                        <input
                            className="input"
                            type="date"
                            min={minDate}
                            max={maxDate}
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setDone(false);
                                setErrors({ ...errors, date: '' });
                                const s = timeSlots.find(
                                    (t) => t.id === slotId
                                );
                                if (
                                    s &&
                                    e.target.value === today &&
                                    parseInt(s.label.slice(0, 2), 10) * 60 <=
                                        nowMin
                                )
                                    setSlotId('');
                            }}
                        />
                    </label>
                    {errors.date && (
                        <p className="err" role="alert">
                            {errors.date}
                        </p>
                    )}
                    <div
                        className="slots"
                        role="radiogroup"
                        aria-label="Time slots"
                    >
                        {timeSlots.map((s) => (
                            <button
                                key={s.id}
                                role="radio"
                                aria-checked={slotId === s.id}
                                className={`slot ${slotId === s.id ? 'on' : ''}`}
                                disabled={pastSlot(s.label)}
                                onClick={() => {
                                    setSlotId(s.id);
                                    setDone(false);
                                    setErrors({ ...errors, slot: '' });
                                }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    {errors.slot && (
                        <p className="err" role="alert">
                            {errors.slot}
                        </p>
                    )}
                    {mode === 'asap' && (
                        <Link
                            className="link"
                            style={{ width: 'fit-content' }}
                            to={`/schedule?type=${type}`}
                        >
                            Need it later? Schedule a pre-order
                        </Link>
                    )}
                </section>

                {done && (
                    <div
                        className="card"
                        role="status"
                        style={{ borderColor: 'var(--ok)' }}
                    >
                        <b>Pre-order scheduled</b>
                        <p className="muted">
                            {type === 'delivery' ? 'Delivery' : 'Pickup'} on{' '}
                            {formatDate(date)},{' '}
                            {timeSlots.find((s) => s.id === slotId)?.label}.
                            Continue to review your order.
                        </p>
                    </div>
                )}
                <button className="btn block" onClick={submit}>
                    {mode === 'preorder' && !done
                        ? 'Confirm schedule'
                        : 'Continue to review'}{' '}
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
