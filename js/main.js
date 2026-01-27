(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // --- DOM Elements ---
        const header = document.getElementById('header');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const scrollTopBtn = document.getElementById('scrollTop');

        // ======================
        // 1. ハンバーガーメニュー
        // ======================
        function openMenu() {
            navMenu.classList.add('is-open');
            hamburger.classList.add('is-active');
            hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            navMenu.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger && navMenu) {
            // トグル
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = navMenu.classList.contains('is-open');
                isOpen ? closeMenu() : openMenu();
            });

            // メニュー内リンククリックで閉じる
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // メニュー外クリックで閉じる
            document.addEventListener('click', (e) => {
                if (!navMenu.classList.contains('is-open')) return;
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMenu();
                }
            });

            // Escapeキーで閉じる
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                    closeMenu();
                    hamburger.focus();
                }
            });
        }

        // ======================
        // 2. スクロール時ヘッダー背景変更
        // ======================
        // 3. ページトップボタン表示/非表示
        // ======================
        // scroll イベントを1つにまとめてパフォーマンス最適化
        let ticking = false;

        function onScroll() {
            const scrollY = window.scrollY;

            // ヘッダー: 50px以上で .scrolled 追加
            if (header) {
                header.classList.toggle('scrolled', scrollY > 50);
            }

            // ページトップボタン: 300px以上で表示
            if (scrollTopBtn) {
                scrollTopBtn.classList.toggle('is-visible', scrollY > 300);
            }

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        // ======================
        // ページトップボタン クリック
        // ======================
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ======================
        // 4. スムーススクロール（アンカーリンク）
        // ======================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                // ヘッダー高さ分オフセット
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });

                // フォーカス移動（アクセシビリティ）
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            });
        });
        // ======================
        // 5. 協力企業モーダル
        // ======================
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        // 企業データ
        const partners = {
            nikka: {
                name: 'ニッカホーム',
                description: '創業以来、お客様の信頼に応える高品質なリフォームサービスを提供しています。全国に拠点を持ち、住まいのあらゆるリフォームに対応。',
                details: '年間施工実績は数万件を誇り、キッチン・浴室・トイレなどの水回りから、外壁・屋根・内装まで幅広く対応しています。資格を持ったスタッフが丁寧にご提案いたします。',
                video: 'SAMPLE'
            },
            coburn: {
                name: 'コバーン',
                description: '専門性の高いリフォームサービスを提供しています。デザイン性と機能性を両立した提案力が強みです。',
                details: '一級建築士をはじめとする専門スタッフが在籍し、お客様のライフスタイルに合わせた最適なリフォームプランをご提案。アフターサポートも充実しています。'
            },
            companyc: {
                name: '会社C',
                description: '地域密着型のリフォームを展開しています。地元のお客様との信頼関係を大切にしています。',
                details: '小規模な修繕から大規模リノベーションまで、地域に根ざしたきめ細かなサービスを提供。迅速な対応と適正価格で、多くのお客様にご支持いただいています。'
            }
        };

        function openModal(partnerId) {
            const partner = partners[partnerId];
            if (!partner || !modal || !modalBody) return;

            let html = `<h2>${partner.name}</h2>`;
            html += `<p>${partner.description}</p>`;
            html += `<p>${partner.details}</p>`;
            if (partner.video) {
                html += `<div class="modal__video"><iframe src="https://www.youtube.com/embed/${partner.video}" title="${partner.name} 紹介動画" allowfullscreen></iframe></div>`;
            }

            modalBody.innerHTML = html;
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // 開いたボタンにフォーカスを戻す
            if (lastFocusedBtn) {
                lastFocusedBtn.focus();
                lastFocusedBtn = null;
            }
        }

        // パートナーボタンのイベント委譲
        let lastFocusedBtn = null;

        document.querySelectorAll('[data-partner]').forEach(btn => {
            btn.addEventListener('click', () => {
                lastFocusedBtn = btn;
                openModal(btn.dataset.partner);
            });
        });

        // 閉じるボタン・オーバーレイクリック
        document.querySelectorAll('[data-modal-close]').forEach(el => {
            el.addEventListener('click', closeModal);
        });

        // Escapeで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    });
})();
