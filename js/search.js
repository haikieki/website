// ==========================================
// Google Apps Script API URL
// ==========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwSV6AMYz9RZ0txQpcC-DFNdr4r5c2k3gOnD2Tfcsps53qAV_QhyqF7BYprN5Nl4vLd8A/exec';

// --- DOM ---
const form = document.getElementById('searchForm');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('searchResults');
const noResults = document.getElementById('noResults');
const errorMessage = document.getElementById('errorMessage');

// --- Enter キー対応 ---
document.getElementById('memberNo').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

document.getElementById('name').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

// ==========================================
// 検索実行
// ==========================================
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const memberNo = document.getElementById('memberNo').value.trim();
    const name = document.getElementById('name').value.trim();

    if (!memberNo && !name) {
        showError('会員番号または氏名を入力してください。');
        return;
    }

    showLoading(true);
    hideAll();

    try {
        const params = new URLSearchParams();
        if (memberNo) params.append('memberNo', memberNo);
        if (name) params.append('name', name);

        const response = await fetch(`${API_URL}?${params}`, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        showLoading(false);

        if (data.success && data.data && data.data.length > 0) {
            displayResults(data.data);
        } else {
            showNoResults();
        }
    } catch (error) {
        showLoading(false);
        showError('検索中にエラーが発生しました。時間をおいて再度お試しください。');
        console.error('Search error:', error);
    }
});

// ==========================================
// 表示制御
// ==========================================
function showLoading(show) {
    loading.style.display = show ? 'flex' : 'none';
}

function hideAll() {
    resultsContainer.innerHTML = '';
    noResults.style.display = 'none';
    hideError();
}

function showNoResults() {
    noResults.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// ==========================================
// 検索結果を描画
// ==========================================
function displayResults(results) {
    const count = results.length;
    let html = `<p class="search-count">${count}件の結果が見つかりました</p>`;

    html += '<div class="results-grid">';
    html += results.map(item => `
        <div class="result-card">
            <div class="result-badge">認定資格者</div>
            <div class="result-header">${escapeHtml(item.name || '')}</div>
            <div class="result-body">
                <div class="result-item">
                    <span class="result-label">会員番号</span>
                    <span class="result-value">${escapeHtml(item.memberNo || '')}</span>
                </div>
                ${item.company ? `
                <div class="result-item">
                    <span class="result-label">所属企業</span>
                    <span class="result-value">${escapeHtml(item.company)}</span>
                </div>` : ''}
                ${item.prefecture ? `
                <div class="result-item">
                    <span class="result-label">都道府県</span>
                    <span class="result-value">${escapeHtml(item.prefecture)}</span>
                </div>` : ''}
            </div>
        </div>
    `).join('');
    html += '</div>';

    resultsContainer.innerHTML = html;
}

// ==========================================
// XSS対策: HTMLエスケープ
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
