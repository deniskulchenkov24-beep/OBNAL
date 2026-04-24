const searchInput = document.getElementById('searchInput');
const searchIcon = document.querySelector('.search-icon');
const serviceSearchInput = document.getElementById('serviceSearchInput');
const serviceSearchBtn = document.getElementById('serviceSearchBtn');
const serviceCardTitle = document.getElementById('serviceCardTitle');
const serviceFeaturesList = document.getElementById('serviceFeatures');
const serviceItems = Array.from(document.querySelectorAll('.service-item'));
const isBuyPage = document.body.classList.contains('buy-page');
const isServicePage = document.body.classList.contains('service-page');

//ДАННЫЕ СЕРВИСОВ 
const serviceData = {
    autoshop: {
        title: 'Автосервис',
        features: [
            'Техническое обслуживание',
            'Шиномонтажные работы',
            'Замена жидкостей',
            'Автостекла и зеркала',
            'Работа с двигателем'
        ]
    },
    detailing: {
        title: 'Детейлинг',
        features: [
            'Полировка кузова',
            'Химчистка салона',
            'Защитное покрытие',
            'Обработка кожи',
            'Мойка двигателя'
        ]
    },
    diagnostics: {
        title: 'Диагностика',
        features: [
            'Компьютерная диагностика',
            'Проверка ходовой части',
            'Диагностика тормозной системы',
            'Проверка электрооборудования',
            'Проверка двигателя'
        ]
    },
    equipment: {
        title: 'Дополнительное оборудование',
        features: [
            'Установка видеорегистратора',
            'Установка парктроников',
            'Монтаж акустики',
            'Установка дополнительного освещения',
            'Тонировка стекол'
        ]
    }
};

const pageSearchMap = [
    { keywords: ['купить', 'автомобиль', 'авто', 'машину', 'машина', 'модель', 'цена', 'кредит', 'finance', 'платеж', 'mercedes', 'bmw', 'porsche', 'audi'], url: 'buy.html' },
    { keywords: ['продать', 'продажа', 'выкуп', 'госномер', 'пробег', 'адрес', 'номер', 'заявка', 'связи'], url: 'sell.html' },
    { keywords: ['сервис', 'услуги', 'автосервис', 'детейлинг', 'диагностика', 'оборудование', 'замена жидкостей', 'шиномонтаж', 'автостекла', 'зеркала', 'двигатель', 'техническое обслуживание', 'дополнительное оборудование', 'монтаж', 'акустика', 'парктроники', 'тонировка', 'видеорегистратор'], url: 'service.html' },
    { keywords: ['о нас', 'компания', 'информация', 'about', 'контакты'], url: 'about.html' },
    { keywords: ['поддержка', 'help', 'связь', 'чат'], url: 'support' },
    { keywords: ['пользовательское соглашение', 'terms', 'соглашение', 'политика'], url: 'terms.html' },
    { keywords: ['кабинет', 'личный кабинет', 'профиль', 'аккаунт'], url: 'account.html' }
];

function findSearchTarget(text) {
    return pageSearchMap.find(page => page.keywords.some(keyword => text.includes(keyword)));
}

function filterServiceContent(query) {
    const items = Array.from(document.querySelectorAll('.service-item'));
    if (!items.length) return false;

    const lowerQuery = query.toLowerCase();
    let matched = false;

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const visible = text.includes(lowerQuery);
        item.style.display = visible ? '' : 'none';
        if (visible) {
            item.classList.add('active');
            matched = true;
        } else {
            item.classList.remove('active');
        }
    });

    return matched;
}

function renderServiceContent(key) {
    const content = serviceData[key];
    if (!content || !serviceCardTitle || !serviceFeaturesList) return;

    serviceCardTitle.textContent = content.title;
    serviceFeaturesList.innerHTML = content.features.map(feature => `<li>${feature}</li>`).join('');
}

function setActiveServiceItem(button) {
    if (!button) return;
    serviceItems.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const key = button.dataset.service || 'autoshop';
    renderServiceContent(key);
}

function searchServicePage(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return false;

    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    if (!queryWords.length) return false;

    const matchedKeys = Object.keys(serviceData).filter(key => {
        const content = serviceData[key];
        if (!content) return false;

        const searchableText = [content.title, ...content.features].join(' ').toLowerCase();
        return queryWords.every(word => searchableText.includes(word));
    });

    const labelMatches = serviceItems.filter(item => {
        const text = item.textContent.toLowerCase();
        return queryWords.some(word => text.includes(word));
    });

    const anyMatches = matchedKeys.length ? matchedKeys : Object.keys(serviceData).filter(key => {
        const content = serviceData[key];
        const searchableText = [content.title, ...content.features].join(' ').toLowerCase();
        return queryWords.some(word => searchableText.includes(word));
    });

    if (!matchedKeys.length && !anyMatches.length && !labelMatches.length) {
        return false;
    }

    const visibleKeys = matchedKeys.length ? matchedKeys : anyMatches;
    serviceItems.forEach(item => {
        const key = item.dataset.service;
        item.style.display = visibleKeys.includes(key) || labelMatches.includes(item) ? '' : 'none';
    });

    const activeButton = labelMatches[0] || serviceItems.find(item => visibleKeys.includes(item.dataset.service));
    if (activeButton) setActiveServiceItem(activeButton);
    return true;
}

function searchServiceMenu() {
    if (!serviceSearchInput) return;
    const query = serviceSearchInput.value.trim();
    if (!query) {
        serviceItems.forEach(item => item.style.display = '');
        const activeButton = serviceItems.find(item => item.classList.contains('active')) || serviceItems[0];
        if (activeButton) setActiveServiceItem(activeButton);
        return;
    }

    const matched = searchServicePage(query);
    if (!matched) {
        alert(`Сервис по запросу «${query}» не найден.`);
    }
}

function setupServicePage() {
    if (!isServicePage || !serviceItems.length) return;

    serviceItems.forEach(item => {
        item.addEventListener('click', () => setActiveServiceItem(item));
    });

    if (serviceSearchBtn) {
        serviceSearchBtn.addEventListener('click', searchServiceMenu);
    }

    if (serviceSearchInput) {
        serviceSearchInput.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                searchServiceMenu();
            }
        });
    }

    const activeButton = serviceItems.find(item => item.classList.contains('active')) || serviceItems[0];
    if (activeButton) {
        setActiveServiceItem(activeButton);
    }
}

function navigateSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    const text = query.toLowerCase();
    const target = findSearchTarget(text);

    if (isServicePage) {
        const matched = searchServicePage(query);
        if (matched) return;
    }

    if (target) {
        if (target.url === 'support') {
            const supportLink = document.querySelector('.support');
            supportLink?.click();
            return;
        }
        window.location.href = target.url;
        return;
    }

    if (isServicePage) {
        const matched = filterServiceContent(text);
        if (matched) return;
    }

    if (isBuyPage) {
        filterCars();
        return;
    }

    alert('По запросу «' + query + '» результатов не найдено.');
    searchInput.value = '';
}

function parsePrice(value) {
    const digits = String(value).replace(/\D/g, '');
    return digits ? Number(digits) : null;
}

function filterCars() {
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    const filterButton = document.getElementById('filterButton');
    const cards = Array.from(document.querySelectorAll('.vehicle-card'));
    if (!cards.length) return;

    const brandValue = brandSelect ? brandSelect.value.trim() : '';
    const modelValue = modelSelect ? modelSelect.value.trim() : '';
    const priceMin = parsePrice(priceMinInput?.value);
    const priceMax = parsePrice(priceMaxInput?.value);
    const condition = document.querySelector('.filter-tab.active')?.dataset.condition || 'all';
    const query = searchInput?.value.trim().toLowerCase();

    let visibleCount = 0;

    cards.forEach(card => {
        const cardBrand = card.dataset.brand?.toLowerCase() || '';
        const cardModel = card.dataset.model?.toLowerCase() || '';
        const cardPrice = Number(card.dataset.price || 0);
        const cardCondition = card.dataset.condition || 'all';

        let visible = true;
        if (brandValue && cardBrand !== brandValue.toLowerCase()) visible = false;
        if (modelValue && cardModel !== modelValue.toLowerCase()) visible = false;
        if (condition !== 'all' && cardCondition !== condition) visible = false;
        if (priceMin !== null && cardPrice < priceMin) visible = false;
        if (priceMax !== null && cardPrice > priceMax) visible = false;
        if (query && !(cardBrand.includes(query) || cardModel.includes(query) || String(cardPrice).includes(query))) visible = false;

        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount += 1;
    });

    const countText = document.querySelector('.catalog-info');
    if (countText) {
        countText.textContent = `Найдено ${visibleCount} предложений от проверенных дилеров`;
    }
    if (filterButton) {
        filterButton.textContent = `Показать ${visibleCount}`;
    }
}

function setupBuyPageFilters() {
    const filterButton = document.getElementById('filterButton');
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    const tabButtons = Array.from(document.querySelectorAll('.filter-tab'));

    if (filterButton) {
        filterButton.addEventListener('click', filterCars);
    }

    [brandSelect, modelSelect, priceMinInput, priceMaxInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterCars);
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(tab => tab.classList.remove('active'));
            button.classList.add('active');
            filterCars();
        });
    });

    filterCars();
}

if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            navigateSearch();
        }
    });
}

if (searchIcon) {
    searchIcon.addEventListener('click', function () {
        navigateSearch();
    });
}

function setupSupportPopup() {
    const supportLinks = Array.from(document.querySelectorAll('.support'));
    const supportPopup = document.getElementById('supportPopup');
    const supportClose = document.getElementById('supportClose');
    const supportSend = document.getElementById('supportSend');
    const supportMessage = document.getElementById('supportMessage');

    if (!supportPopup || !supportLinks.length) return;

    supportLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            supportPopup.classList.add('open');
            supportMessage?.focus();
        });
    });

    supportClose?.addEventListener('click', () => {
        supportPopup.classList.remove('open');
    });

    supportSend?.addEventListener('click', () => {
        const value = supportMessage?.value.trim();
        if (!value) {
            alert('Введите сообщение для поддержки.');
            supportMessage?.focus();
            return;
        }
        alert('Ваше сообщение отправлено. Служба поддержки ответит в ближайшее время.');
        if (supportMessage) supportMessage.value = '';
        supportPopup.classList.remove('open');
    });
}

if (isBuyPage) {
    setupBuyPageFilters();
}

if (isServicePage) {
    setupServicePage();
}

setupSupportPopup();

//МОДАЛЬНОЕ ОКНО ВХОДА
function setupLoginModal() {
    const loginModalOverlay = document.getElementById('loginModalOverlay');
    const loginModalClose = document.getElementById('loginModalClose');
    const userIcon = document.querySelector('.user-icon');
    const loginForm = document.getElementById('loginForm');

  
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModalOverlay) {
                loginModalOverlay.classList.add('active');
            }
        });
    }

    
    if (loginModalClose) {
        loginModalClose.addEventListener('click', () => {
            if (loginModalOverlay) {
                loginModalOverlay.classList.remove('active');
            }
        });
    }

    
    if (loginModalOverlay) {
        loginModalOverlay.addEventListener('click', (e) => {
            if (e.target === loginModalOverlay) {
                loginModalOverlay.classList.remove('active');
            }
        });
    }

   
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Here you would send data to server
            console.log('Login attempt:', { email, password });
            
           
            alert('Добро пожаловать, ' + email + '!');
            loginForm.reset();
            
            if (loginModalOverlay) {
                loginModalOverlay.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModalOverlay && loginModalOverlay.classList.contains('active')) {
            loginModalOverlay.classList.remove('active');
        }
    });
}

//ФОРМА ПРОДАЖИ АВТОМОБИЛЯ 
function setupSellForm() {
    const sellForm = document.querySelector('.sell-form');
    const appNotificationOverlay = document.getElementById('appNotificationOverlay');
    const notificationCloseBtn = document.getElementById('notificationCloseBtn');

    if (!sellForm) return;

    // Функции валидации
    function validateLicense(license) {
        const licenseRegex = /^[А-Яа-я]\d{3}[А-Яа-я]{2}\d{2}$/;
        return licenseRegex.test(license);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\+7\d{10}$/;
        
        return phoneRegex.test(phone);
    }


    function validateAddress(address) {
        return address.trim().length >= 5 && /^[А-Яа-яA-Za-z0-9\s\-,\.\,()]+$/.test(address);
    }

    function validateMileage(mileage) {
        const mileageNum = parseInt(mileage);
        return !isNaN(mileageNum) && mileageNum >= 0;
    }

    //  ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ 
    sellForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Получение значений полей
        const license = sellForm.querySelector('input[name="license"]').value.trim().toUpperCase();
        const mileage = sellForm.querySelector('input[name="mileage"]').value.trim();
        const address = sellForm.querySelector('input[name="address"]').value.trim();
        const phone = sellForm.querySelector('input[name="phone"]').value.trim();

        // Валидация всех полей
        if (!validateLicense(license)) {
            alert('Госномер должен быть в формате: А111АА11\nПример: А123БВ45');
            return;
        }

        if (!validateMileage(mileage)) {
            alert('Пробег должен быть положительным числом');
            return;
        }

        if (!validateAddress(address)) {
            alert('Адрес должен быть не менее 5 символов и содержать только буквы, цифры, пробелы и знаки препинания');
            return;
        }

        if (!validatePhone(phone)) {
            alert('Номер телефона должен быть в формате: +7XXXXXXXXXX\nПример: +79991234567');
            return;
        }

        //СОХРАНЕНИЕ И ОТПРАВКА ДАННЫХ
        const applicationData = {
            license,
            mileage,
            address,
            phone,
            timestamp: new Date().toISOString()
        };
        console.log('Received application:', applicationData);

        // Показ уведомления об успехе
        if (appNotificationOverlay) {
            appNotificationOverlay.classList.add('active');
        }

        // Очистка формы после отправки
        sellForm.reset();

        // Автоматическое закрытие уведомления через 5 секунд
        setTimeout(() => {
            if (appNotificationOverlay) {
                appNotificationOverlay.classList.remove('active');
            }
        }, 5000);
    });

    //УПРАВЛЕНИЕ ЗАКРЫТИЕМ УВЕДОМЛЕНИЯ
    // Закрытие по кнопке "Закрыть"
    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', () => {
            if (appNotificationOverlay) {
                appNotificationOverlay.classList.remove('active');
            }
        });
    }

    // Закрытие при клике на фон
    if (appNotificationOverlay) {
        appNotificationOverlay.addEventListener('click', (e) => {
            if (e.target === appNotificationOverlay) {
                appNotificationOverlay.classList.remove('active');
            }
        });
    }
}

// МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ АВТОМОБИЛЯ
function setupCarModal() {
    const carModal = document.getElementById('carModal');
    const carModalOverlay = document.getElementById('carModalOverlay');
    const carModalClose = document.getElementById('carModalClose');
    const vehicleCards = Array.from(document.querySelectorAll('.vehicle-card'));

    if (!carModal || !vehicleCards.length) return;

    // Функция открытия модального окна
    function openCarModal(card) {
        const brand = card.dataset.brand || '';
        const model = card.dataset.model || '';
        const price = card.dataset.price || '';
        const condition = card.dataset.condition || '';
        const image = card.querySelector('.card-image')?.src || '';
        const specs = Array.from(card.querySelectorAll('.card-spec')).map(spec => spec.textContent).join('\n');
        const status = card.querySelector('.tag')?.textContent || '';

        // Заполнение модального окна данными
        document.getElementById('carModalImage').src = image;
        document.getElementById('carModalImage').alt = `${brand} ${model}`;
        document.getElementById('carModalTitle').textContent = `${brand} ${model}`;
        
        // Форматирование спецификаций
        const specsArray = specs.split('\n').filter(s => s.trim());
        const specsHTML = specsArray.map(spec => `<div class="car-modal-spec-item">${spec.trim()}</div>`).join('');
        document.getElementById('carModalSpecs').innerHTML = specsHTML;

        // Форматирование цены
        const priceNum = parseInt(price);
        const formattedPrice = priceNum.toLocaleString('ru-RU') + ' ₽';
        document.getElementById('carModalPrice').textContent = formattedPrice;

        // Статус
        document.getElementById('carModalStatus').innerHTML = `<span class="car-modal-tag">${status}</span>`;

        // Открытие модального окна
        carModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Функция закрытия модального окна
    function closeCarModal() {
        carModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчики событий для карточек
    vehicleCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openCarModal(card));
    });

    // Закрытие по кнопке
    carModalClose?.addEventListener('click', closeCarModal);

    // Закрытие при клике на фон
    carModalOverlay?.addEventListener('click', closeCarModal);

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && carModal.classList.contains('active')) {
            closeCarModal();
        }
    });
}

if (isBuyPage) {
    setupCarModal();
}

//ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
setupSellForm();
setupLoginModal();
