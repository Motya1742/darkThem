document.addEventListener('DOMContentLoaded', function() {
    // Инициализация бургер-меню
    const burgerBtn = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    
    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('show');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Инициализация хранилища обзоров
    initReviewsStorage();
    
    // Загрузка обзоров
    loadReviews();
    
    // Инициализация рейтинга звездами
    initStarRating();
    
    // Инициализация слайдера героя
    initHeroSlider();
    
    // Обработчик формы добавления обзора
    document.getElementById('review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addReview();
    });
    
    // Обработчик формы поиска
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        searchReviews();
    });
    
    // Обработчик сортировки
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadReviews(this.dataset.sort);
        });
    });
    
    // Обработчик темы
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Кнопка "Наверх"
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function searchReviews() {
        const searchInput = document.querySelector('#search-form input').value.toLowerCase();
        const genreSelect = document.getElementById('genre-filter').value;
        const yearSelect = document.getElementById('year-filter').value;
        const ratingSelect = document.getElementById('rating-filter').value;
        
        const reviews = JSON.parse(localStorage.getItem('filmReviews')) || [];
        
        const filteredReviews = reviews.filter(review => {
            const title = review.title.toLowerCase();
            const director = review.director.toLowerCase();
            const genre = review.genre.toLowerCase();
            const year = review.year.toString();
            const text = review.text.toLowerCase();
            const rating = review.rating.toString();
            
            const matchesSearch = 
                title.includes(searchInput) || 
                director.includes(searchInput) ||
                text.includes(searchInput);
            
            const matchesGenre = genreSelect === '' || genre === genreSelect.toLowerCase();
            const matchesYear = yearSelect === '' || year === yearSelect;
            const matchesRating = ratingSelect === '' || rating >= ratingSelect;
            
            return matchesSearch && matchesGenre && matchesYear && matchesRating;
        });
        
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';
        
        if (filteredReviews.length === 0) {
            reviewList.innerHTML = '<p class="no-reviews">По вашему запросу ничего не найдено.</p>';
            return;
        }
        
        filteredReviews.forEach(review => {
            reviewList.appendChild(createReviewElement(review));
        });
    }
});

// Инициализация хранилища обзоров
function initReviewsStorage() {
    let reviews = localStorage.getItem('filmReviews');

    if (!reviews) {
        const initialReviews = [
            {
                id: 1,
                title: 'Интерстеллар',
                year: 2014,
                director: 'Кристофер Нолан',
                genre: 'фантастика',
                author: 'Алексей Иванов',
                rating: 5,
                text: 'Великолепный фильм, который сочетает в себе научную фантастику и глубокую человеческую драму. Визуальные эффекты и музыка Ханса Циммера создают неповторимую атмосферу. Однозначно рекомендую к просмотру!',
                trailer: 'https://youtu.be/qcPfI0y7wRU',
                views: 1250,
                date: '2023-05-15'
            },
            {
                id: 2,
                title: 'Темный рыцарь',
                year: 2008,
                director: 'Кристофер Нолан',
                genre: 'боевик',
                author: 'Мария Петрова',
                rating: 5,
                text: 'Лучший фильм о Бэтмене и один из лучших фильмов в жанре супергероики. Хит Леджер в роли Джокера - это нечто невероятное!',
                trailer: 'https://youtu.be/EXeTwQWrcwY',
                views: 980,
                date: '2023-04-22'
            },
            {
                id: 3,
                title: 'Начало',
                year: 2010,
                director: 'Кристофер Нолан',
                genre: 'фантастика',
                author: 'Дмитрий Сидоров',
                rating: 4,
                text: 'Умный и сложный фильм, который заставляет задуматься. Отличный актерский состав и потрясающие визуальные эффекты. Немного запутанный сюжет, но это скорее плюс, чем минус.',
                trailer: 'https://youtu.be/YoHD9XEInc0',
                views: 870,
                date: '2023-03-10'
            },
            {
                id: 4,
                title: 'Крестный отец',
                year: 1972,
                director: 'Фрэнсис Форд Коппола',
                genre: 'драма',
                author: 'Иван Кузнецов',
                rating: 5,
                text: 'Абсолютный шедевр мирового кинематографа. Марлон Брандо и Аль Пачино великолепны. Фильм, который должен посмотреть каждый!',
                trailer: 'https://youtu.be/sY1S34973zA',
                views: 760,
                date: '2023-02-28'
            },
            {
                id: 5,
                title: 'Побег из Шоушенка',
                year: 1994,
                director: 'Фрэнк Дарабонт',
                genre: 'драма',
                author: 'Елена Смирнова',
                rating: 5,
                text: 'Вдохновляющая история о надежде и дружбе. Тим Роббинс и Морган Фриман создали незабываемые образы. Фильм, который оставляет теплые чувства.',
                trailer: 'https://youtu.be/6hB3S9bIaco',
                views: 690,
                date: '2023-01-15'
            },
            {
                id: 6,
                title: 'Форрест Гамп',
                year: 1994,
                director: 'Роберт Земекис',
                genre: 'драма',
                author: 'Ольга Васильева',
                rating: 5,
                text: 'Трогательная история простого человека, который стал свидетелем и участником важных событий в истории Америки. Том Хэнкс великолепен в главной роли!',
                trailer: 'https://youtu.be/bLvqoHBptjg',
                views: 620,
                date: '2022-12-10'
            },
            {
                id: 7,
                title: 'Зеленая миля',
                year: 1999,
                director: 'Фрэнк Дарабонт',
                genre: 'драма',
                author: 'Сергей Петров',
                rating: 5,
                text: 'Невероятно эмоциональный фильм с блестящей игрой актеров. История, которая заставляет задуматься о жизни, смерти и человечности.',
                trailer: 'https://youtu.be/Ki4haFrqSrw',
                views: 580,
                date: '2022-11-05'
            },
            {
                id: 8,
                title: 'Список Шиндлера',
                year: 1993,
                director: 'Стивен Спилберг',
                genre: 'драма',
                author: 'Анна Козлова',
                rating: 5,
                text: 'Мощный и эмоциональный фильм о Холокосте. Лиам Нисон в роли Оскара Шиндлера показывает, как один человек может изменить судьбы многих.',
                trailer: 'https://youtu.be/mxphAlJID9U',
                views: 540,
                date: '2022-10-20'
            },
            {
                id: 9,
                title: 'Матрица',
                year: 1999,
                director: 'Лана и Лилли Вачовски',
                genre: 'фантастика',
                author: 'Денис Волков',
                rating: 5,
                text: 'Революционный фильм, изменивший представление о научной фантастике. Инновационные спецэффекты и глубокая философская подоплека.',
                trailer: 'https://youtu.be/vKQi3bBA1y8',
                views: 890,
                date: '2022-09-15'
            },
            {
                id: 10,
                title: 'Властелин колец: Возвращение короля',
                year: 2003,
                director: 'Питер Джексон',
                genre: 'фэнтези',
                author: 'Михаил Соколов',
                rating: 5,
                text: 'Эпическое завершение трилогии, которое собрало все "Оскары". Великолепные пейзажи, захватывающие битвы и трогательная история дружбы.',
                trailer: 'https://youtu.be/r5X-hFf6Bwo',
                views: 920,
                date: '2022-08-10'
            }
        ];
        
        localStorage.setItem('filmReviews', JSON.stringify(initialReviews));
    }
}

// Загрузка обзоров
function loadReviews(sortBy = 'date') {
    const reviews = JSON.parse(localStorage.getItem('filmReviews')) || [];
    const reviewList = document.getElementById('review-list');
    
    reviewList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewList.innerHTML = '<p class="no-reviews">Пока нет обзоров. Будьте первым!</p>';
        return;
    }
    
    // Сортировка
    let sortedReviews = [...reviews];
    
    switch(sortBy) {
        case 'rating':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'views':
            sortedReviews.sort((a, b) => b.views - a.views);
            break;
        default: // date
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    sortedReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        if (reviewElement) {
            reviewList.appendChild(reviewElement);
        } else {
            console.error('Failed to create element for review:', review);
        }
    });
}

// Создание элемента обзора
function createReviewElement(review) {
    if (!review) return null;

    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-card';

    reviewElement.innerHTML = `
        <div class="review-header">
            <div class="film-info">
                <h3 class="film-title">${review.title} (${review.year})</h3>
                <div class="film-director">Режиссер: ${review.director}</div>
                <div class="film-genre">Жанр: ${review.genre}</div>
                <div class="film-author">Автор: ${review.author}</div>
                <div class="film-rating">Оценка: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
        </div>
        <div class="review-text">${review.text}</div>
        <div class="review-footer">
            <span class="review-date">Дата: ${review.date}</span>
            <span class="review-views">Просмотры: ${review.views}</span>
            ${review.trailer ? `<a href="${review.trailer}" target="_blank" class="trailer-link">Смотреть трейлер</a>` : ''}
        </div>
    `;
    return reviewElement;
}

// Инициализация звездного рейтинга
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            document.getElementById('rating').value = value;
            
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Добавление нового обзора
function addReview() {
    const title = document.getElementById('film-title').value;
    const year = document.getElementById('film-year').value;
    const director = document.getElementById('film-director').value;
    const genre = document.getElementById('film-genre').value;
    const author = document.getElementById('author').value;
    const rating = document.getElementById('rating').value;
    const text = document.getElementById('review-text').value;
    const trailer = document.getElementById('film-trailer').value;
    
    if (!title || !year || !director || !genre || !author || !rating || !text) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('filmReviews')) || [];
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    
    const newReview = {
        id: newId,
        title,
        year: parseInt(year),
        director,
        genre,
        author,
        rating: parseInt(rating),
        text,
        trailer,
        views: 0,
        date: new Date().toISOString().split('T')[0]
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('filmReviews', JSON.stringify(reviews));
    
    // Обновляем списки
    loadReviews();
    
    // Сбрасываем форму
    document.getElementById('review-form').reset();
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.getElementById('rating').value = '0';
    
    // Прокручиваем к списку обзоров
    document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    
    // Показываем уведомление
    showNotification('Спасибо за ваш обзор! Он успешно добавлен.');
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Поиск обзоров
function searchReviews() {
    const searchInput = document.querySelector('#search-form input').value.toLowerCase();
    const genreSelect = document.getElementById('genre-filter').value;
    const yearSelect = document.getElementById('year-filter').value;
    
    const reviews = JSON.parse(localStorage.getItem('filmReviews')) || [];
    
    const filteredReviews = reviews.filter(review => {
        const title = review.title.toLowerCase();
        const director = review.director.toLowerCase();
        const genre = review.genre.toLowerCase();
        const year = review.year.toString();
        const text = review.text.toLowerCase();
        
        const matchesSearch = 
            title.includes(searchInput) || 
            director.includes(searchInput) ||
            text.includes(searchInput);
        
        const matchesGenre = genreSelect === '' || genre === genreSelect.toLowerCase();
        const matchesYear = yearSelect === '' || year === yearSelect;
        
        return matchesSearch && matchesGenre && matchesYear;
    });
    
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    if (filteredReviews.length === 0) {
        reviewList.innerHTML = '<p class="no-reviews">По вашему запросу ничего не найдено.</p>';
        return;
    }
    
    filteredReviews.forEach(review => {
        reviewList.appendChild(createReviewElement(review));
    });
}

// Инициализация слайдера героя
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentIndex = 0;
    let interval;

    // Создаем точки для навигации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        dotsContainer.children[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        slides[currentIndex].classList.add('active');
        dotsContainer.children[currentIndex].classList.add('active');
        
        resetAutoSlide();
    }

    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }

    // Назначение обработчиков событий
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Запускаем автоматическое перелистывание
    startAutoSlide();
    
    // Пауза при наведении
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => clearInterval(interval));
    hero.addEventListener('mouseleave', startAutoSlide);
}