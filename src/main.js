// ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (РАБОТАЕТ НА ВСЕХ СТРАНИЦАХ)
function initTheme() {
    const KEY = 'theme';
    const btn = document.querySelector('.theme-toggle');

    if (!btn) return; // Если кнопки нет на странице - выходим

    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;

    // Автовыбор темы при загрузке страницы
    if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
        document.body.classList.add('theme-dark');
        btn.setAttribute('aria-pressed', 'true');
    }

    // Переключение темы по клику
    btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        btn.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    });
}

function initModal() {
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');

    // Если элементов модалки нет на странице - выходим
    if (!dlg || !openBtn) return;

    let lastActive = null;

    openBtn.addEventListener('click', () => {
        lastActive = document.activeElement;
        dlg.showModal(); // модальный режим + затемнение
        dlg.querySelector('input,select,textarea,button')?.focus();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => dlg.close('cancel'));
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            // валидация см. 1.4.2; при успехе закрываем окно
            // 1) Сброс кастомных сообщений
            [...form.elements].forEach(el => el.setCustomValidity?.(''));
            // 2) Проверка встроенных ограничений
            if (!form.checkValidity()) {
                e.preventDefault();
                // Пример: таргетированное сообщение
                const email = form.elements.email;
                if (email?.validity.typeMismatch) {
                    email.setCustomValidity('Введите корректный e-mail, например name@example.com');
                }
                form.reportValidity(); // показать браузерные подсказки
                // A11y: подсветка проблемных полей
                [...form.elements].forEach(el => {
                    if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
                });
                return;
            }
            // 3) Успешная «отправка» (без сервера)
            e.preventDefault();
            // Если форма внутри <dialog>, закрываем окно:
            document.getElementById('contactDialog')?.close('success');
            form.reset();

            dlg.addEventListener('close', () => { lastActive?.focus(); });
            // Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>

        });
    }
}

function initPhoneMask() {
    const phone = document.getElementById('phone');
    if (!phone) return;

    phone?.addEventListener('input', () => {
        const digits = phone.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр
        const d = digits.replace(/^8/, '7'); // нормализуем 8 → 7
        const parts = [];
        if (d.length > 0) parts.push('+7');
        if (d.length > 1) parts.push(' (' + d.slice(1, 4));
        if (d.length >= 4) parts[parts.length - 1] += ')';
        if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
        if (d.length >= 8) parts.push('-' + d.slice(7, 9));
        if (d.length >= 10) parts.push('-' + d.slice(9, 11));
        phone.value = parts.join('');
    });
    // Строгая проверка (если задаёте pattern из JS):
    phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');
}

function initSmoothScroll() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', () => {
    initTheme();        // Работает на всех страницах
    initModal();        // Только где есть модалка
    initSmoothScroll(); // Работает на всех страницах
    initPhoneMask();    // Только где есть поле телефона
});