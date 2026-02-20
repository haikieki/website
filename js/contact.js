/**
 * お問い合わせフォーム送信処理
 */

// APIエンドポイント
const CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbyfXOoX_tbpbcAae2rXEDSygepOqs1_cExR677A9oIOLwFw5TKJL7-jAQMdvL4jP4RsXA/exec';

// フォーム送信イベント
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // バリデーション
    if (!validateForm()) {
        return;
    }

    // フォームデータ取得
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        category: document.getElementById('category').value,
        message: document.getElementById('message').value.trim()
    };

    // 送信処理
    await submitForm(formData);
});

/**
 * フォームバリデーション
 */
function validateForm() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('email').value.trim();
    const category = document.getElementById('category').value;
    const message = document.getElementById('message').value.trim();
    const privacy = document.getElementById('privacy').checked;

    // 必須項目チェック
    if (!name) {
        alert('お名前を入力してください');
        return false;
    }

    if (!email) {
        alert('メールアドレスを入力してください');
        return false;
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('メールアドレスの形式が正しくありません');
        return false;
    }

    if (!category) {
        alert('お問い合わせ種別を選択してください');
        return false;
    }

    if (!message) {
        alert('お問い合わせ内容を入力してください');
        return false;
    }

    if (!privacy) {
        alert('入力内容に間違いがないかご確認の上、チェックを入れてください');
        return false;
    }

    return true;
}

/**
 * フォーム送信
 */
async function submitForm(formData) {
    // UI更新
    showSending();

    try {
        // GASはCORSプリフライト非対応のため、no-corsモードで送信
        // Content-Type: text/plain はシンプルリクエストなのでプリフライト不要
        await fetch(CONTACT_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(formData)
        });

        // no-corsモードではレスポンス内容を読めないため、
        // エラーが発生しなければ成功とみなす
        showSuccess();

    } catch (error) {
        console.error('Submit error:', error);
        showError('通信エラーが発生しました。時間をおいて再度お試しください。');
    }
}

/**
 * 送信中表示
 */
function showSending() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('sendingMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('contactError').style.display = 'none';
}

/**
 * 成功メッセージ表示
 */
function showSuccess() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('sendingMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('contactError').style.display = 'none';

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * エラーメッセージ表示
 */
function showError(message) {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('sendingMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('contactError').style.display = 'block';
    document.getElementById('errorText').textContent = message;

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * エラーを閉じてフォームに戻る
 */
function hideError() {
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('contactError').style.display = 'none';
}
