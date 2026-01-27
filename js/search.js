(function () {
    'use strict';

    // ==========================================
    // Google Apps Script API URL（デプロイ後に差替え）
    // ==========================================
    const API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

    // --- DOM ---
    const form = document.getElementById('searchForm');
    const loading = document.getElementById('loading');
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');

    if (!form) return;

    // ==========================================
    // 検索実行
    // ==========================================
    form.addEventListener('submit', async (e) => {
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
                headers: { 'Accept': 'application/json' }
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
    }

    function showNoResults() {
        noResults.style.display = 'block';
    }

    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="search-error">
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    // ==========================================
    // 検索結果を描画
    // ==========================================
    function displayResults(results) {
        const count = results.length;
        let html = `<p class="search-results__count">${count}件の結果が見つかりました</p>`;

        html += results.map(item => `
            <div class="result-card">
                <div class="result-card__row">
                    <span class="result-card__label">氏名</span>
                    <span class="result-card__value">${escapeHtml(item.name || '')}</span>
                </div>
                <div class="result-card__row">
                    <span class="result-card__label">会員番号</span>
                    <span class="result-card__value">${escapeHtml(item.memberNo || '')}</span>
                </div>
                ${item.company ? `
                <div class="result-card__row">
                    <span class="result-card__label">所属企業</span>
                    <span class="result-card__value">${escapeHtml(item.company)}</span>
                </div>` : ''}
                ${item.prefecture ? `
                <div class="result-card__row">
                    <span class="result-card__label">都道府県</span>
                    <span class="result-card__value">${escapeHtml(item.prefecture)}</span>
                </div>` : ''}
            </div>
        `).join('');

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
})();
