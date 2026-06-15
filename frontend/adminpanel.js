const DEFAULT_EMPLOYERS = [
    {
        brand: "Ростсайт",
        person: "Кривов Владимир Сергеевич",
        description: "Создаем сайты и приложения для компаний, разрабатываем 3D-графику и анимацию.",
        tags: ["Маркетинг", "IT", "Дизайн", "Практика", "Работа"],
        link: "https://tolyatti.rostsayt.ru",
        logo: "icon/logoros.svg"
    },
    {
        brand: "Сео тлт",
        person: "Бодров Сергей Юрьевич",
        description: "Цифровые решения для крупных корпораций. Цифровые решения для среднего бизнеса",
        tags: ["Маркетинг", "IT", "Дизайн", "Практика", "Работа"],
        link: "https://www.seotlt.ru",
        logo: "icon/seotlt.svg"
    },
    {
        brand: "ТЛТ Про",
        person: "Токарев Дмитрий Владимирович",
        description: "Развиваете веб — мы сразу упаковываем его в iOS/Android. Экономия времени и бюджета.",
        tags: ["Маркетинг", "IT", "Дизайн", "Практика", "Работа"],
        link: "https://tltpro.org",
        logo: "icon/tltpro.svg"
    },
    {
        brand: "Оптимакс",
        person: "Токарев Дмитрий Владимирович",
        description: "Компания Optimax родилась из идеи. Большой идеи сделать процесс приобретения оптики проще и доступнее для людей во всем мире.",
        tags: ["Маркетинг", "IT", "Практика", "Работа"],
        link: "https://optimax.dev",
        logo: "icon/optimax.svg"
    },
    {
        brand: "Виват айкью",
        person: "Токарев Дмитрий Владимирович",
        description: "Подбираем и разрабатываем стратегию внедрения 1С: ERP для каждой компании индивидуально. Помогаем повышать эффективность управления производством и бизнесом.",
        tags: ["IT", "Практика", "Работа"],
        link: "https://www.vivat-iq.ru",
        logo: "icon/vivatiq.svg"
    }
];

const AVAILABLE_TAGS = ["Маркетинг", "IT", "Дизайн", "Практика", "Работа"];
let employers = [];
let editMode = false;
let editingId = null;
let extraTagsArray = [];

async function loadData() {
    try {
        const response = await fetch('http://localhost:3001/company', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const result = await response.json();

        console.log('ВЕСЬ ОТВЕТ:', result);

        if (result.success && result.data) {
            employers = result.data.map(company => ({
                id: company.id,
                brand: company.company_name,
                person: company.director,
                description: company.company_description,
                link: company.company_site,
                logo: company.path_logo,
                tags: parseTags(company.type_coop)
            }));
        } else {
            throw new Error('Invalid response format');
        }

        renderAdminGrid();
    } catch (error) {
        console.error('Error loading data:', error);
        employers = DEFAULT_EMPLOYERS.map((emp, index) => ({
            ...emp,
            id: `temp_${index + 1}`
        }));
        renderAdminGrid();
        showMessage('Ошибка загрузки данных с сервера, отображаются локальные данные', 'error');
    }
}

function parseTags(tagsInput) {
    if (!tagsInput) return [];
    if (Array.isArray(tagsInput)) return tagsInput;
    if (typeof tagsInput === 'string') {
        return tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [];
}

function renderAdminGrid() {
    const grid = document.getElementById('employersGrid');
    const countSpan = document.getElementById('employersCount');
    if (!grid) return;

    if (!employers.length) {
        grid.innerHTML = `<div class="empty-placeholder">Нет работодателей. Добавьте первого!</div>`;
        countSpan.innerText = '0 компаний';
        return;
    }

    countSpan.innerText = `${employers.length} ${getNoun(employers.length, 'компания', 'компании', 'компаний')}`;

    grid.innerHTML = employers.map(emp => `
        <div class="admin-card" data-id="${emp.id}">
            <div class="admin-card-header">
                <div class="card-logo">
                    <img src="${emp.logo || 'icon/logoros.svg'}" alt="Логотип ${escapeHtml(emp.brand)}" onerror="this.onerror=null; this.src='icon/logoros.svg'">
                </div>
                <div class="card-title">
                    <h4>${escapeHtml(emp.brand)}</h4>
                    <p class="card-person">${escapeHtml(emp.person)}</p>
                </div>
            </div>
            <div class="admin-card-body">
                <p class="card-desc">${escapeHtml(emp.description)}</p>
                <div class="card-tags">
                    ${(emp.tags || []).map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <a href="${emp.link || '#'}" target="_blank" class="card-link">Посетить сайт</a>
            </div>
            <div class="admin-card-actions">
                <button class="btn-icon edit-btn" data-id="${emp.id}" title="Редактировать">Редактировать</button>
                <button class="btn-icon delete-btn" data-id="${emp.id}" title="Удалить">Удалить</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            openEditForm(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            deleteEmployerById(id);
        });
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function getNoun(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
}

async function deleteEmployerById(id) {
    if (!confirm('Удалить карточку работодателя?')) return;

    try {
        const response = await fetch(`http://localhost:3000/company/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        await loadData();
        showMessage('Карточка удалена', 'success');
    } catch (error) {
        console.error(error);
        showMessage('Ошибка удаления', 'error');
    }
}

function renderTagsCheckboxes() {
    const container = document.getElementById('tagsCheckboxes');
    if (!container) return;
    container.innerHTML = AVAILABLE_TAGS.map(tag => `
        <label class="tag-checkbox-label">
            <input type="checkbox" class="tag-checkbox" value="${escapeHtml(tag)}"> 
            <span>${escapeHtml(tag)}</span>
        </label>
    `).join('');
}

function renderExtraTags() {
    const container = document.getElementById('dynamicTagsContainer');
    if (!container) return;
    container.innerHTML = '';
    extraTagsArray.forEach((tag) => {
        const tagSpan = document.createElement('div');
        tagSpan.className = 'tag-item';
        tagSpan.innerHTML = `${escapeHtml(tag)} <button type="button" class="tag-remove" data-tag="${escapeHtml(tag)}">&times;</button>`;
        container.appendChild(tagSpan);
    });
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const tagToRemove = btn.getAttribute('data-tag');
            extraTagsArray = extraTagsArray.filter(t => t !== tagToRemove);
            renderExtraTags();
        });
    });
}

function addExtraTag(newTag) {
    if (!newTag || newTag.trim() === '') return false;
    const trimmed = newTag.trim();
    if (extraTagsArray.includes(trimmed)) {
        showMessage('Такой тег уже добавлен', 'error');
        return false;
    }
    if (AVAILABLE_TAGS.includes(trimmed)) {
        showMessage('Этот тег уже есть в основных. Выберите его чекбоксом.', 'error');
        return false;
    }
    extraTagsArray.push(trimmed);
    renderExtraTags();
    return true;
}

function openEditForm(id) {
    const employer = employers.find(emp => emp.id == id);
    if (!employer) return;

    editMode = true;
    editingId = id;

    document.getElementById('formTitle').innerHTML = 'Редактировать работодателя';
    document.getElementById('cancelEditBtn').style.display = 'inline-flex';
    document.getElementById('brand').value = employer.brand || '';
    document.getElementById('person').value = employer.person || '';
    document.getElementById('description').value = employer.description || '';
    document.getElementById('link').value = employer.link || '';
    document.getElementById('logo').value = employer.logo || 'icon/logoros.svg';

    const checkboxes = document.querySelectorAll('.tag-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = employer.tags && employer.tags.includes(cb.value);
    });

    extraTagsArray = (employer.tags || []).filter(tag => !AVAILABLE_TAGS.includes(tag));
    renderExtraTags();

    document.getElementById('employerForm').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    editMode = false;
    editingId = null;
    document.getElementById('formTitle').innerHTML = 'Добавить работодателя';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('brand').value = '';
    document.getElementById('person').value = '';
    document.getElementById('description').value = '';
    document.getElementById('link').value = '';
    document.getElementById('logo').value = 'icon/logoros.svg';

    document.querySelectorAll('.tag-checkbox').forEach(cb => cb.checked = false);

    extraTagsArray = [];
    renderExtraTags();
    document.getElementById('formMessage').innerHTML = '';
    document.getElementById('newTagInput').value = '';
}

function showMessage(msg, type = 'info') {
    const msgDiv = document.getElementById('formMessage');
    const colors = { error: '#dc2626', success: '#10b981', info: '#3b82f6' };
    msgDiv.innerHTML = `<span style="color: ${colors[type]}">${escapeHtml(msg)}</span>`;
    setTimeout(() => { if (msgDiv) msgDiv.innerHTML = ''; }, 3000);
}

async function saveEmployer() {
    const brand = document.getElementById('brand').value.trim();
    const person = document.getElementById('person').value.trim();
    const description = document.getElementById('description').value.trim();
    const link = document.getElementById('link').value.trim();
    let logo = document.getElementById('logo').value.trim();

    if (!brand) { showMessage('Введите название компании', 'error'); return; }
    if (!person) { showMessage('Укажите контактное лицо', 'error'); return; }
    if (!link) { showMessage('Введите сайт компании', 'error'); return; }

    let selectedMainTags = [];
    document.querySelectorAll('.tag-checkbox:checked').forEach(cb => selectedMainTags.push(cb.value));

    let allTags = [...selectedMainTags, ...extraTagsArray];
    allTags = [...new Set(allTags)];

    if (allTags.length === 0) {
        showMessage('Добавьте хотя бы один тег', 'error');
        return;
    }

    if (!logo || logo.trim() === '') {
        logo = 'icon/logoros.svg';
    }

    const employerData = {
        id: editingId,
        company_name: brand,
        director: person,
        company_description: description || 'Нет описания',
        company_site: link,
        path_logo: logo,
        type_coop: allTags.join(', '),
        specialization: allTags.join(', ')
    };

    try {
        const url = editMode && editingId
            ? `http://localhost:3000/company/${editingId}`
            : 'http://localhost:3000/company';

        const method = editMode && editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employerData)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Ошибка');
        }

        showMessage(editMode ? `Обновлено: "${brand}"` : `Добавлена: "${brand}"`, 'success');
        await loadData();
        resetForm();
    } catch (error) {
        console.error(error);
        showMessage('Ошибка сохранения', 'error');
    }
}

async function init() {
    renderTagsCheckboxes();
    await loadData();

    document.getElementById('saveBtn').addEventListener('click', saveEmployer);
    document.getElementById('cancelEditBtn').addEventListener('click', resetForm);
    document.getElementById('addTagBtn').addEventListener('click', () => {
        const input = document.getElementById('newTagInput');
        if (addExtraTag(input.value)) input.value = '';
        else input.focus();
    });
    document.getElementById('newTagInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = document.getElementById('newTagInput');
            if (addExtraTag(input.value)) input.value = '';
        }
    });
}

init();