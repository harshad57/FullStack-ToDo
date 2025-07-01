import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Home() {
    const [auth, setAuth] = useState(false);
    const [msg, setMsg] = useState('');
    const [name, setName] = useState('');
    const [notes, setNotes] = useState([]);
    const [noteInput, setNoteInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [noteMsg, setNoteMsg] = useState('');
    const [noteMsg1, setNoteMsg1] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000')
        .then(res => {
            if (res.data.Status === "OK") {
                setAuth(true);
                setName(res.data.name);

                axios.get('http://localhost:3000/notes')
                    .then(noteRes => {
                        if (noteRes.data.notes) {
                            setNotes(noteRes.data.notes);
                        }
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                        setMsg("Failed to load notes.");
                        setTimeout(() => setMsg(''), 1500);
                    });

            } else {
                setAuth(false);
                setMsg(res.data.error);
                setLoading(false);
            }
        })
        .catch(err => {
            setMsg('Server error');
            setLoading(false);
        });
}, []);


    const logout = () => {
        axios.get('http://localhost:3000/logout')
            .then(() => {
                window.location.reload(true);
            }).catch(() => setMsg('Logout failed'));
    };

    const handleAddNote = () => {
    if (!noteInput.trim()) {
        setNoteMsg('Note cannot be empty.');
        setTimeout(() => setNoteMsg(''), 1500);
        return;
    }

    axios.post('http://localhost:3000/notes', { notes: noteInput })
        .then(res => {
            if (res.data.error) {
                setNoteMsg(res.data.error);
            } else {
                setNotes(prev => [...prev, noteInput]);
                setNoteInput('');
                setNoteMsg1('Note added !');
                setTimeout(() => setNoteMsg1(''), 1500);
            }
        })
        .catch(() => {
            setNoteMsg('Failed to add note.');
            setTimeout(() => setNoteMsg(''), 1500);
        });
};

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
                <div className="text-blue-700 text-xl font-semibold animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-2">
            {auth ? (
                <>
                    <div className="bg-white p-8 rounded-2xl shadow-xl mt-16 w-full max-w-lg">
                        <button
                            className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow absolute top-4 right-4"
                            onClick={logout}
                        >
                            Logout
                        </button>
                        <h1 className="text-3xl font-extrabold mb-4 text-center text-blue-700 drop-shadow">
                            Welcome Home, {name}
                        </h1>
                        <p className="text-gray-700 text-center mb-6">
                            You have successfully registered. This is your home page.
                        </p>
                        <div className="flex flex-col items-center w-full">
                            <div className="flex w-full max-w-md mb-2">
                                <input
                                    type="text"
                                    value={noteInput}
                                    onChange={e => setNoteInput(e.target.value)}
                                    placeholder="Add notes..."
                                    className="flex-1 px-4 py-2 rounded-l-lg bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                />
                                <button
                                    className="px-5 py-2 bg-blue-600 text-white rounded-r-lg font-semibold hover:bg-blue-700 transition duration-200"
                                    onClick={handleAddNote}
                                >
                                    Add
                                </button>
                            </div>
                            {noteMsg && (
                                <div className="text-red-600 text-base m-2 font-bold">{noteMsg}</div>
                            )}
                            {noteMsg1 && (
                                <div className="text-green-600 text-base m-2 font-bold">{noteMsg1}</div>
                            )}
                            <ul className="w-full max-w-md mt-4 space-y-2">
                                {notes.length === 0 ? (
                                    <li className="text-gray-400 text-center">No notes yet.</li>
                                ) : (
                                    notes.map((note, idx) => (
                                        <li key={idx} className="bg-blue-50 px-4 py-2 rounded shadow text-gray-700">
                                            {note}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center mt-20">
                    <div className="text-red-600 font-semibold mb-2 text-center">{msg}</div>
                    <div className="text-gray-700 mb-8 text-center text-xl">
                        First you have to create your account!
                    </div>
                    <a
                        href="/register"
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition duration-200"
                    >
                        Create Account
                    </a>
                </div>
            )}
        </div>
    );
}

export default Home;
// ...existing code...