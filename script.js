// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('active')));
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Highlight active nav link based on the section currently in view
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const isActive = this.classList.contains('active');

            // Close all accordion items
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.parentElement.querySelector('.accordion-content').classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                accordionContent.classList.add('active');
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.branch-card, .psychologist-card, .book-card, .timeline-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Timeline items animation with delay
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
    });

    // Cards hover effects
    const cards = document.querySelectorAll('.branch-card, .psychologist-card, .book-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // Transición segura del hero: el contenido sube al avanzar hacia la
    // siguiente sección. Antes bajaba y terminaba detrás de «¿Sabías que…?».
    const heroSection = document.querySelector('.hero');
    const heroContainer = document.querySelector('.hero-container');
    const reduceHeroMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let heroParallaxFrame = null;

    function updateHeroParallax() {
        if (!heroSection || !heroContainer || window.innerWidth <= 768 || reduceHeroMotion.matches) {
            if (heroContainer) heroContainer.style.removeProperty('transform');
            heroParallaxFrame = null;
            return;
        }

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (window.scrollY <= heroBottom) {
            const offset = Math.min(window.scrollY * 0.1, 72);
            heroContainer.style.transform = `translate3d(0, -${offset}px, 0)`;
        }

        heroParallaxFrame = null;
    }

    window.addEventListener('scroll', function() {
        if (heroParallaxFrame !== null) return;
        heroParallaxFrame = window.requestAnimationFrame(updateHeroParallax);
    }, { passive: true });
    updateHeroParallax();

    // Add book recommendation click handlers
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't intercept direct link clicks
            if (e.target.tagName === 'A' || e.target.closest('a')) return;

            const bookTitle = this.querySelector('h3').textContent;
            const bookAuthor = this.querySelector('.book-author').textContent;

            const modal = document.createElement('div');
            modal.className = 'book-modal';
            modal.innerHTML = `
                <div class="modal-content" style="background:white;padding:2rem;border-radius:15px;text-align:center;max-width:500px;width:90%;">
                    <h3 style="margin-bottom:0.5rem;color:#333;">${bookTitle}</h3>
                    <p style="color:#6c5ce7;font-weight:600;margin-bottom:1rem;">${bookAuthor}</p>
                    <p style="color:#555;margin-bottom:1.5rem;">Te recomendamos buscarlo en librerías locales o plataformas de libros digitales.</p>
                    <div style="display:flex;gap:1rem;justify-content:center;">
                        <button class="btn btn-primary search-book-btn">Buscar en línea</button>
                        <button class="btn btn-secondary close-modal-btn" style="color:#667eea;border-color:#667eea;">Cerrar</button>
                    </div>
                </div>
            `;
            modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;`;
            document.body.appendChild(modal);

            const searchQuery = encodeURIComponent(`${bookTitle} ${bookAuthor} libro`);
            modal.querySelector('.search-book-btn').addEventListener('click', function() {
                window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
            });
            modal.querySelector('.close-modal-btn').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    });

    // Add easter egg for psychology enthusiasts
    let clickCount = 0;
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount >= 5) {
                const messages = [
                    "¡Eres un verdadero entusiasta de la psicología! 🧠",
                    "La curiosidad es el motor del aprendizaje 🔍",
                    "Sigmund Freud estaría orgulloso de tu persistencia 👨‍⚕️",
                    "¡Has desbloqueado el nivel de psicólogo experto! 🎓"
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                alert(typeof t === 'function' ? t(randomMessage) : randomMessage);
                clickCount = 0;
            }
        });
    }

    // Initialize interactive features
    initializeCounters();
    initializeDisordersTab();
    initializeBranchFilter();
    initializePersonalityTest();
    initializeMoodTracker();
    initializePsychologyQuiz();
    initializeMoodChart();
    initializeSearch();
    initializeThemeToggle();
    initializeSabiasQue();
    
    console.log('Psicología & Psiquiatría – Guía Completa cargada exitosamente! 🧠✨');
});

// =============================================
// ¿Sabías que...? rotating facts
// =============================================
function initializeSabiasQue() {
    const facts = [
        "Un metaanálisis mundial estimó que el 62,5 % de las personas con un trastorno mental había presentado su inicio antes de los 25 años (Solmi et al., 2022).",
        "La psicología cognitiva demostró que podemos sostener 7±2 elementos en la memoria de trabajo (Miller, 1956).",
        "Tomar la misma decisión repetidamente agota nuestra capacidad cognitiva — se llama 'fatiga de decisiones'.",
        "El cerebro consume el 20% de toda la energía del cuerpo, aunque solo representa el 2% del peso corporal.",
        "La terapia cognitivo-conductual (TCC) es eficaz para más de 20 trastornos mentales diferentes.",
        "Pavlov descubrió el condicionamiento clásico mientras estudiaba la digestión en perros, no la psicología.",
        "La depresión mayor afecta a 280 millones de personas en todo el mundo (OMS, 2022).",
        "El hipocampo, clave para la memoria, puede generar nuevas neuronas incluso en la adultez.",
        "El 'efecto placebo' es tan potente que puede producir cambios físicos medibles en el cerebro.",
        "Los taxistas de Londres tienen más volumen en el hipocampo posterior por su uso intensivo de la navegación espacial.",
    ];
    const el = document.getElementById('sabias-text');
    if (!el) return;

    let current = 0;
    setInterval(() => {
        current = (current + 1) % facts.length;
        el.style.opacity = '0';
        setTimeout(() => {
            el.textContent = facts[current];
            el.style.opacity = '1';
        }, 400);
    }, 7000);

    // Fade transition style
    el.style.transition = 'opacity 0.4s ease';
}

// =============================================
// Utility: animate number from 0 to value
// =============================================
function animateValue(element, start, end, duration, suffix) {
    suffix = suffix || '';
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// =============================================
// Statistics counter animation for hero stats
// =============================================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const startedCounters = new Set();

    const startCounter = (counter) => {
        if (startedCounters.has(counter)) return;
        startedCounters.add(counter);
        const target = parseInt(counter.getAttribute('data-target'), 10);
        animateValue(counter, 0, target, 2000, '+');
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
        const rect = counter.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
            startCounter(counter);
        }
    });
}

// =============================================
// Branch filter functionality
// =============================================
function initializeBranchFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const branchCards = document.querySelectorAll('.branch-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            branchCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// =============================================
// Disorders tab functionality
// =============================================
function initializeDisordersTab() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const categories = document.querySelectorAll('.disorder-category');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            categories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            const targetEl = document.querySelector(`.disorder-category[data-category="${targetCategory}"]`);
            if (targetEl) targetEl.classList.add('active');
        });
    });
}

// =============================================
// Personality test functionality
// =============================================
function initializePersonalityTest() {
    const questions = document.querySelectorAll('.question');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const testResult = document.querySelector('.test-result');
    const restartButton = document.querySelector('.restart-test');
    
    let currentQuestion = 1;
    let answers = {};
    
    answerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const questionNum = this.closest('.question').getAttribute('data-question');
            const value = this.getAttribute('data-value');
            
            this.parentElement.querySelectorAll('.answer-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
            answers[questionNum] = value;
            
            setTimeout(() => {
                if (currentQuestion < 3) {
                    nextQuestion();
                } else {
                    showResults();
                }
            }, 500);
        });
    });
    
    function nextQuestion() {
        questions[currentQuestion - 1].classList.remove('active');
        currentQuestion++;
        questions[currentQuestion - 1].classList.add('active');
        
        const progress = (currentQuestion / 3) * 100;
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = `Pregunta ${currentQuestion} de 3`;
    }
    
    function showResults() {
        const qContainer = document.querySelector('.question-container');
        const tProgress = document.querySelector('.test-progress');
        if (qContainer) qContainer.style.display = 'none';
        if (tProgress) tProgress.style.display = 'none';
        if (testResult) testResult.style.display = 'block';
        
        const traits = calculatePersonalityTraits(answers);
        displayPersonalityResults(traits);
    }
    
    function calculatePersonalityTraits(answers) {
        let extraversion = 0;
        let thinking = 0;
        let stress = 0;
        
        if (answers['1'] === 'extravert') extraversion = 80;
        else if (answers['1'] === 'introvert') extraversion = 20;
        else extraversion = 50;
        
        if (answers['2'] === 'thinking') thinking = 85;
        else if (answers['2'] === 'feeling') thinking = 25;
        else thinking = 60;
        
        if (answers['3'] === 'action') stress = 75;
        else if (answers['3'] === 'reflection') stress = 90;
        else stress = 65;
        
        return { extraversion, thinking, stress };
    }
    
    function displayPersonalityResults(traits) {
        Object.keys(traits).forEach(trait => {
            const fill = document.querySelector(`.trait-fill[data-trait="${trait}"]`);
            const value = document.querySelector(`.trait-value[data-trait="${trait}"]`);
            
            if (fill && value) {
                setTimeout(() => {
                    fill.style.width = traits[trait] + '%';
                    value.textContent = traits[trait] + '%';
                }, 500);
            }
        });
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', function() {
            currentQuestion = 1;
            answers = {};
            
            questions.forEach((q, index) => {
                q.classList.toggle('active', index === 0);
                q.querySelectorAll('.answer-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
            });
            
            if (progressFill) progressFill.style.width = '33%';
            if (progressText) progressText.textContent = 'Pregunta 1 de 3';
            
            const qContainer = document.querySelector('.question-container');
            const tProgress = document.querySelector('.test-progress');
            if (qContainer) qContainer.style.display = 'block';
            if (tProgress) tProgress.style.display = 'block';
            if (testResult) testResult.style.display = 'none';
        });
    }
}

// =============================================
// Mood tracker functionality
// =============================================
function initializeMoodTracker() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const saveMoodButton = document.querySelector('.save-mood');
    const moodTextarea = document.querySelector('.mood-note textarea');
    const weeklyAvgElement = document.getElementById('weeklyAvg');
    const trendElement = document.getElementById('trend');
    
    let selectedMood = null;
    let moodData = JSON.parse(localStorage.getItem('moodData')) || [];
    
    updateMoodInsights();
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedMood = {
                value: parseInt(this.getAttribute('data-mood')),
                label: this.getAttribute('data-label'),
                emoji: this.textContent
            };
        });
    });
    
    if (saveMoodButton) {
        saveMoodButton.addEventListener('click', function() {
            if (!selectedMood) {
                alert(typeof t === 'function' ? t('Por favor selecciona tu estado de ánimo') : 'Por favor selecciona tu estado de ánimo');
                return;
            }
            
            const moodEntry = {
                date: new Date().toISOString().split('T')[0],
                mood: selectedMood.value,
                label: selectedMood.label,
                emoji: selectedMood.emoji,
                note: moodTextarea ? moodTextarea.value : ''
            };
            
            moodData = moodData.filter(entry => entry.date !== moodEntry.date);
            moodData.push(moodEntry);
            moodData = moodData.slice(-30);
            
            localStorage.setItem('moodData', JSON.stringify(moodData));
            
            updateMoodInsights();
            initializeMoodChart(); // Redraw chart
            
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            if (moodTextarea) moodTextarea.value = '';
            selectedMood = null;
            
            alert(typeof t === 'function' ? t('Estado de ánimo guardado exitosamente ✓') : 'Estado de ánimo guardado exitosamente ✓');
        });
    }
    
    function updateMoodInsights() {
        if (moodData.length === 0) return;
        
        const lastWeek = moodData.slice(-7);
        const weeklyAvg = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
        if (weeklyAvgElement) weeklyAvgElement.textContent = weeklyAvg.toFixed(1);
        
        if (moodData.length >= 2 && trendElement) {
            const recent = moodData.slice(-3).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(3, moodData.length);
            const older = moodData.length >= 6
                ? moodData.slice(-6, -3).reduce((sum, entry) => sum + entry.mood, 0) / 3
                : recent;
            
            if (recent > older + 0.3) {
                trendElement.textContent = '↗️ Mejorando';
                trendElement.style.color = '#51cf66';
            } else if (recent < older - 0.3) {
                trendElement.textContent = '↘️ Declinando';
                trendElement.style.color = '#ff6b6b';
            } else {
                trendElement.textContent = '→ Estable';
                trendElement.style.color = '#339af0';
            }
        }
    }
}

// =============================================
// Psychology quiz functionality
// =============================================
function initializePsychologyQuiz() {
    const quizQuestions = [
        {
            question: "¿Quién es considerado el padre del psicoanálisis?",
            options: ["Sigmund Freud", "Carl Jung", "B.F. Skinner", "Jean Piaget"],
            correct: 0,
            explanation: "Sigmund Freud desarrolló la teoría psicoanalítica y es considerado el fundador del psicoanálisis."
        },
        {
            question: "¿Qué estudia la neuropsicología?",
            options: ["Solo el comportamiento", "Solo el cerebro", "La relación entre cerebro y comportamiento", "Solo las emociones"],
            correct: 2,
            explanation: "La neuropsicología estudia específicamente cómo las funciones cerebrales se relacionan con el comportamiento."
        },
        {
            question: "¿Cuál es la capacidad promedio de la memoria de trabajo según Miller (1956)?",
            options: ["5±2 elementos", "7±2 elementos", "9±2 elementos", "11±2 elementos"],
            correct: 1,
            explanation: "La regla de Miller establece que la memoria de trabajo puede mantener 7±2 elementos simultáneamente. Investigaciones recientes sugieren 4±1 chunks verdaderos."
        },
        {
            question: "¿Qué trastorno se caracteriza por la alternancia de episodios maníacos y depresivos?",
            options: ["Depresión mayor", "Trastorno bipolar", "Esquizofrenia", "Trastorno de ansiedad generalizada"],
            correct: 1,
            explanation: "El trastorno bipolar se caracteriza por la alternancia entre episodios maníacos (euforia, grandiosidad) y episodios depresivos."
        },
        {
            question: "¿Quién desarrolló la Teoría del Aprendizaje Social y el concepto de autoeficacia?",
            options: ["Carl Rogers", "Abraham Maslow", "Albert Bandura", "Viktor Frankl"],
            correct: 2,
            explanation: "Albert Bandura desarrolló la teoría del aprendizaje social y el concepto de autoeficacia — la creencia en la propia capacidad para realizar tareas específicas."
        }
    ];
    
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    
    const questionElement = document.getElementById('quiz-question-text');
    const optionsContainer = document.querySelector('.quiz-options');
    const resultElement = document.querySelector('.quiz-result');
    const feedbackElement = document.querySelector('.result-feedback');
    const nextButton = document.querySelector('.next-question');
    const currentElement = document.getElementById('quiz-current');
    const totalElement = document.getElementById('quiz-total');
    const correctElement = document.getElementById('quiz-correct');
    const percentageElement = document.getElementById('quiz-percentage');
    
    if (!questionElement) return;
    
    if (totalElement) totalElement.textContent = quizQuestions.length;
    
    function loadQuestion() {
        const question = quizQuestions[currentQuestionIndex];
        questionElement.textContent = question.question;
        
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(button);
        });
        
        if (resultElement) resultElement.style.display = 'none';
        if (currentElement) currentElement.textContent = currentQuestionIndex + 1;
    }
    
    function selectAnswer(selectedIndex) {
        const question = quizQuestions[currentQuestionIndex];
        const options = optionsContainer.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.classList.add('disabled');
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedIndex) {
                option.classList.add('wrong');
            }
        });
        
        if (selectedIndex === question.correct) {
            correctAnswers++;
            if (feedbackElement) {
                feedbackElement.innerHTML = `<strong>¡Correcto!</strong><br>${question.explanation}`;
                feedbackElement.style.color = '#51cf66';
            }
        } else {
            if (feedbackElement) {
                feedbackElement.innerHTML = `<strong>Incorrecto.</strong><br>${question.explanation}`;
                feedbackElement.style.color = '#ff6b6b';
            }
        }
        
        if (correctElement) correctElement.textContent = correctAnswers;
        if (percentageElement) percentageElement.textContent = Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100) + '%';
        
        if (resultElement) resultElement.style.display = 'block';
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < quizQuestions.length) {
                loadQuestion();
            } else {
                showFinalResults();
            }
        });
    }
    
    function showFinalResults() {
        const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = '¡Excelente conocimiento en psicología!';
        } else if (percentage >= 60) {
            message = 'Buen conocimiento básico, ¡sigue explorando la plataforma!';
        } else {
            message = '¡Hay mucho por aprender! Te invitamos a explorar las secciones de Conceptos y Pioneros.';
        }
        
        if (feedbackElement) {
            feedbackElement.innerHTML = `<strong>Quiz Completado</strong><br>${message}<br><span class="i18n-inline">Puntuación final:</span> ${correctAnswers}/${quizQuestions.length} (${percentage}%)`;
        }
        if (nextButton) {
            nextButton.textContent = 'Reiniciar Quiz';
            nextButton.onclick = restartQuiz;
        }
    }
    
    function restartQuiz() {
        currentQuestionIndex = 0;
        correctAnswers = 0;
        if (correctElement) correctElement.textContent = '0';
        if (percentageElement) percentageElement.textContent = '0%';
        if (nextButton) {
            nextButton.textContent = 'Siguiente Pregunta';
            nextButton.onclick = function() {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizQuestions.length) {
                    loadQuestion();
                } else {
                    showFinalResults();
                }
            };
        }
        loadQuestion();
    }
    
    loadQuestion();
}

// =============================================
// Mood chart functionality
// =============================================
function initializeMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;
    window.__refreshMoodChart = initializeMoodChart;

    const translate = (typeof t === 'function') ? t : (s) => s;
    const ctx = canvas.getContext('2d');
    const moodData = JSON.parse(localStorage.getItem('moodData')) || [];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (moodData.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '14px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(translate('Registra tu estado de ánimo para ver el gráfico'), canvas.width / 2, canvas.height / 2);
        return;
    }
    
    const sortedData = [...moodData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dataToShow = sortedData.slice(-7);
    
    const padding = 50;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    // Grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
        const y = canvas.height - padding - (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    if (dataToShow.length > 1) {
        // Area fill
        ctx.beginPath();
        dataToShow.forEach((point, index) => {
            const x = padding + (chartWidth / (dataToShow.length - 1)) * index;
            const y = canvas.height - padding - (chartHeight / 5) * point.mood;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineTo(padding + chartWidth, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fillStyle = 'rgba(108, 92, 231, 0.1)';
        ctx.fill();
        
        // Line
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        dataToShow.forEach((point, index) => {
            const x = padding + (chartWidth / (dataToShow.length - 1)) * index;
            const y = canvas.height - padding - (chartHeight / 5) * point.mood;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
    
    // Points and labels
    dataToShow.forEach((point, index) => {
        const x = padding + (chartWidth / Math.max(1, dataToShow.length - 1)) * index;
        const y = canvas.height - padding - (chartHeight / 5) * point.mood;
        
        ctx.fillStyle = getMoodColor(point.mood);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.emoji, x, y - 14);
        
        ctx.fillStyle = '#888';
        ctx.font = '10px Poppins, sans-serif';
        const shortDate = point.date.slice(5); // MM-DD
        ctx.fillText(shortDate, x, canvas.height - padding + 14);
    });
    
    // Y-axis labels
    ctx.fillStyle = '#888';
    ctx.font = '10px Poppins, sans-serif';
    ctx.textAlign = 'right';
    const moodLabels = ['Terrible', 'Mal', 'Normal', 'Bien', 'Excelente'];
    moodLabels.forEach((label, index) => {
        const y = canvas.height - padding - (chartHeight / 5) * (index + 1);
        ctx.fillText(translate(label), padding - 6, y + 4);
    });
}

function getMoodColor(mood) {
    const colors = {
        1: '#ff6b6b',
        2: '#ff8e8e',
        3: '#ffd43b',
        4: '#51cf66',
        5: '#339af0'
    };
    return colors[mood] || '#666';
}

// =============================================
// Enhanced search functionality
// =============================================
function initializeSearch() {
    const header = document.querySelector('.nav-container');
    if (!header) return;

    // Avoid double-insertion
    if (document.getElementById('search-input')) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="search-input" placeholder="Buscar en el sitio..." aria-label="Buscar" />
        <div class="search-results" id="search-results"></div>
    `;
    header.appendChild(searchContainer);
    
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    const searchableContent = [
        { title: 'Historia de la Psicología', content: 'Wundt Leipzig Freud Watson conductismo humanista cognitiva Pavlov James', section: '#historia' },
        { title: 'Ramas de la Psicología', content: 'clínica social cognitiva experimental desarrollo organizacional deporte neuropsicología ciberpsicología forense', section: '#ramas' },
        { title: 'Latinoamérica / Latin America', content: 'latinoamérica latinoamerica argentina brasil mexico chile colombia peru martín-baró pichón-rivière lane psicología regional', section: '#latinoamerica' },
        { title: 'Psiquiatría', content: 'neurotransmisores serotonina dopamina farmacología antidepresivos antipsicóticos hospitalaria forense', section: '#psiquiatria' },
        { title: 'Trastornos Mentales', content: 'depresión ansiedad bipolar esquizofrenia personalidad autismo TDAH pánico TOC TEPT TLP anorexia bulimia', section: '#trastornos' },
        { title: 'Pioneros de la Psicología', content: 'Freud Jung Maslow Skinner Piaget Bandura Rogers Frankl Beck Vygotsky James Pavlov', section: '#psicologos' },
        { title: 'Conceptos Clave', content: 'condicionamiento memoria trabajo disonancia autoeficacia inteligencia emocional sesgo neuroplasticidad apego flujo flow', section: '#conceptos' },
        { title: 'Libros Recomendados', content: 'Kahneman Frankl Goleman Csikszentmihalyi DSM Rogers Freud Milgram Seligman Doidge', section: '#libros' },
        { title: 'Experiencia Interactiva', content: 'test personalidad estado ánimo quiz preguntas rastreador emociones', section: '#interactivo' },
        { title: 'Recursos Adicionales', content: 'universidades revistas científicas colegios cursos online Harvard Stanford UNAM APA OMS', section: '#contacto' },
    ];
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query)
        );
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-item">No se encontraron resultados</div>';
        } else {
            searchResults.innerHTML = results.map(result => 
                `<div class="search-item" data-section="${result.section}">
                    <strong>${result.title}</strong>
                </div>`
            ).join('');
        }
        
        searchResults.style.display = 'block';
    });
    
    searchResults.addEventListener('click', function(e) {
        const searchItem = e.target.closest('.search-item');
        if (searchItem) {
            const section = searchItem.getAttribute('data-section');
            if (section) {
                const targetEl = document.querySelector(section);
                if (targetEl) {
                    const headerEl = document.getElementById('header');
                    const headerH = headerEl ? headerEl.offsetHeight : 0;
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                searchInput.value = '';
                searchResults.style.display = 'none';
            }
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// =============================================
// Theme toggle functionality
// =============================================
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = 'Cambiar tema';
    themeToggle.setAttribute('aria-label', 'Cambiar entre modo claro y oscuro');
    
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && !document.getElementById('theme-toggle')) {
        navContainer.appendChild(themeToggle);
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Mapa de paradigmas psicológicos — cajas interactivas
document.addEventListener('DOMContentLoaded', function() {
    const paradigmDetails = {
        filosofia: {
            title: 'Filosofía — Fundamentos filosóficos',
            items: [
                'Sócrates, Platón, Aristóteles, Descartes.',
                'Reflexión racional sobre la mente, el alma y el conocimiento.',
                'Preguntas centrales: ¿libre albedrío?, ¿naturaleza del conocimiento?',
                'Sienta las bases conceptuales de las que partirá la psicología científica.'
            ]
        },
        experimental: {
            title: 'Psicología Experimental — Wundt · 1879',
            items: [
                'Wilhelm Wundt funda el primer laboratorio de psicología (Leipzig, 1879).',
                'Aportes: método experimental, introspección estructurada.',
                'Críticas: fuerte subjetividad del método introspectivo.'
            ]
        },
        psicoanalisis: {
            title: 'Psicoanálisis — Freud · 1900',
            items: [
                'Sigmund Freud.',
                'Aportes: inconsciente, interpretación de los sueños, mecanismos de defensa.',
                'Críticas: escasa evidencia empírica, difícil de refutar.'
            ]
        },
        conductismo: {
            title: 'Conductismo — Watson · 1913',
            items: [
                'John B. Watson, B. F. Skinner.',
                'Condicionamiento clásico y condicionamiento operante.',
                'Aportes: metodología rigurosa, base de las terapias conductuales.',
                'Críticas: ignora los procesos mentales internos.'
            ]
        },
        cognitivismo: {
            title: 'Cognitivismo — Miller · 1960',
            items: [
                'George Miller, Ulric Neisser.',
                'Aportes: estudio científico de memoria, atención, lenguaje y toma de decisiones.',
                'Críticas: el primer modelo de "caja negra" resultaba muy simplificado.'
            ]
        },
        humanismo: {
            title: 'Humanismo — Maslow · 1950',
            items: [
                'Abraham Maslow, Carl Rogers.',
                'Aportes: jerarquía de necesidades, autorrealización, enfoque centrado en la persona.',
                'Críticas: conceptos difíciles de medir empíricamente.'
            ]
        },
        neurociencia: {
            title: 'Neurociencia Cognitiva — 1990–hoy',
            items: [
                'Integra los hallazgos del cognitivismo con la biología del cerebro.',
                'Aportes: neuroimagen (fMRI, EEG), bases neuronales de la cognición.',
                'Enfoque contemporáneo dominante, en diálogo constante con el cognitivismo.'
            ]
        }
    };

    const paradigmNodes = document.querySelectorAll('.paradigm-node[data-detail]');
    const detailPanel = document.getElementById('paradigm-detail');
    const detailTitle = document.getElementById('paradigm-detail-title');
    const detailList = document.getElementById('paradigm-detail-list');
    const detailClose = document.getElementById('paradigm-detail-close');

    if (paradigmNodes.length && detailPanel && detailTitle && detailList) {
        const closeDetail = function() {
            detailPanel.hidden = true;
            paradigmNodes.forEach(n => n.classList.remove('is-active'));
        };

        const showDetail = function(node) {
            const key = node.getAttribute('data-detail');
            const data = paradigmDetails[key];
            if (!data) return;

            const alreadyActive = node.classList.contains('is-active');
            paradigmNodes.forEach(n => n.classList.remove('is-active'));

            if (alreadyActive) {
                closeDetail();
                return;
            }

            node.classList.add('is-active');
            detailTitle.textContent = data.title;
            detailList.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');
            detailPanel.hidden = false;
            detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        paradigmNodes.forEach(node => {
            node.addEventListener('click', function() {
                showDetail(this);
            });
            node.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showDetail(this);
                }
            });
        });

        if (detailClose) {
            detailClose.addEventListener('click', closeDetail);
        }
    }
});
