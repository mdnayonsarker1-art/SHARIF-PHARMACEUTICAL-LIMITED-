import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAzwqWUuMyW8piPhkFRhcpnmcpbu_0-lvk",
    authDomain: "sharif-pharma.firebaseapp.com",
    projectId: "sharif-pharma",
    storageBucket: "sharif-pharma.firebasestorage.app",
    messagingSenderId: "867521349666",
    appId: "1:867521349666:web:a8d139d5c41690e910227b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let currentGrp = '';

// --- Navigation Functions (Global mapping) ---
window.showPage = function(id) {
    const pages = ['page-dashboard', 'page-groups', 'page-entry-form'];
    pages.forEach(p => {
        const el = document.getElementById(p);
        if(el) el.classList.add('hidden');
    });
    
    const target = document.getElementById(id);
    if(target) {
        target.classList.remove('hidden');
    }
};

window.openEntry = function(groupName) {
    currentGrp = groupName;
    const titleEl = document.getElementById('entry-title');
    if(titleEl) titleEl.innerText = groupName + " Collection";
    window.showPage('page-entry-form');
};

// --- Saving Logic ---
document.addEventListener('click', async (e) => {
    if (e.target.id === 'saveBtn') {
        const name = document.getElementById('input-name').value;
        const amount = document.getElementById('input-amount').value;
        
        if(!name || !amount) {
            alert("নাম এবং টাকা দুটোই দিন!");
            return;
        }

        try {
            await addDoc(collection(db, "sharif_collection"), {
                group: currentGrp,
                type: "collection",
                name: name,
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date()
            });
            alert("Data Saved Successfully!");
            window.location.href = "history.html?mode=collection";
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    }

    if (e.target.id === 'payoutBtn') {
        const name = document.getElementById('pay-name').value || "Expense";
        const group = document.getElementById('pay-group').value;
        const amount = document.getElementById('pay-amount').value;
        
        if(!amount) return alert("Amount দিন!");

        try {
            await addDoc(collection(db, "sharif_collection"), {
                group: group,
                type: "paid",
                name: name,
                amount: -parseFloat(amount),
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date()
            });
            alert("Paid!");
            window.location.href = "history.html?mode=paid";
        } catch (err) {
            alert(err.message);
        }
    }
});

// --- History Logic ---
window.renderHistory = async function() {
    const historyBody = document.getElementById('history-body');
    if(!historyBody) return;

    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'all';

    const q = query(collection(db, "sharif_collection"), orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    
    let html = '';
    let total = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (mode === 'all' || data.type === mode) {
            total += data.amount;
            html += `
                <tr class="border-b">
                    <td class="p-4">${data.date}</td>
                    <td class="p-4 font-bold text-blue-600">${data.group}</td>
                    <td class="p-4">${data.name}</td>
                    <td class="p-4 text-right font-black ${data.amount < 0 ? 'text-red-500' : 'text-blue-700'}">${Math.abs(data.amount).toLocaleString()}</td>
                    <td class="p-4 text-center"><button onclick="deleteRecord('${doc.id}')" class="text-red-300">🗑️</button></td>
                </tr>
            `;
        }
    });

    historyBody.innerHTML = html || '<tr><td colspan="5" class="p-10 text-center">No Data</td></tr>';
    const displayTotal = document.getElementById('total-amount-display');
    if(displayTotal) displayTotal.innerText = Math.abs(total).toLocaleString();
};

window.deleteRecord = async function(id) {
    if(confirm("Are you sure?")) {
        await deleteDoc(doc(db, "sharif_collection", id));
        window.renderHistory();
    }
};

// Initial Load
window.onload = () => {
    if (window.location.pathname.includes('history.html')) {
        window.renderHistory();
    }
    const clock = document.getElementById('live-clock');
    if(clock) setInterval(() => clock.innerText = new Date().toLocaleString(), 1000);
};