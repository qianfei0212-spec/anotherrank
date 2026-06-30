// ================================================================
// DATA LAYER
// ================================================================
const STORAGE_KEY = 'quCommunityData';
let data = loadData();

function getDefaultData() {
    return { users: [], posts: [], nextUserId: 1, nextPostId: 1 };
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            const def = getDefaultData();
            for (const k in def) {
                if (!(k in parsed)) parsed[k] = def[k];
            }
            return parsed;
        }
    } catch (_) {}
    return getDefaultData();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ================================================================
// SAMPLE DATA
// ================================================================
function initSampleData() {
    if (data.users.length > 0) return;
    const now = Date.now();
    data.users = [
        { id: 1, username: '星辰', password: '123456', avatar: '', joined: now - 86400000 * 30 },
        { id: 2, username: '月光', password: '123456', avatar: '', joined: now - 86400000 * 20 },
        { id: 3, username: '晚风', password: '123456', avatar: '', joined: now - 86400000 * 10 },
        { id: 4, username: '晨曦', password: '123456', avatar: '', joined: now - 86400000 * 5 },
    ];
    data.nextUserId = 5;
    data.posts = [
        { id: 1, title: '分享我最近的摄影作品', content: '周末去了郊外，拍到了绝美的日落。金色的阳光洒在田野上，一切都那么宁静美好。', authorId: 1,
            authorName: '星辰', authorAvatar: '', time: now - 3600000 * 2, likes: [2, 3], comments: [], views: 45,
            shares: 3, price: 0, images: [], video: '' },
        { id: 2, title: 'AI 时代下我们该如何自处', content: '最近 ChatGPT 大火，很多人担心被取代。我的观点是：AI 是工具，不是对手。', authorId: 2,
            authorName: '月光', authorAvatar: '', time: now - 3600000 * 5, likes: [1, 3, 4], comments: [],
            views: 128, shares: 12, price: 0, images: [], video: '' },
        { id: 3, title: '独立开发者的日常 —— 从零到上线', content: '花了一个月时间，独立开发了一款笔记应用。从构思、设计、编码到测试上线，每一步都充满挑战。', authorId: 3,
            authorName: '晚风', authorAvatar: '', time: now - 3600000 * 10, likes: [1, 4], comments: [],
            views: 89, shares: 7, price: 9.99, images: [], video: '' },
        { id: 4, title: '2026 年值得关注的 5 个科技趋势', content: '1. 边缘计算 2. 生成式 AI 3. 量子计算 4. 脑机接口 5. 可持续能源。', authorId: 4,
            authorName: '晨曦', authorAvatar: '', time: now - 3600000 * 18, likes: [2, 3], comments: [],
            views: 210, shares: 25, price: 0, images: [], video: '' },
        { id: 5, title: '我的读书笔记：<人类群星闪耀时>', content: '茨威格的这本书让我深受触动。历史的关键时刻，往往由少数人的勇气和决断所决定。', authorId: 1,
            authorName: '星辰', authorAvatar: '', time: now - 3600000 * 24, likes: [4], comments: [],
            views: 56, shares: 4, price: 0, images: [], video: '' },
    ];
    data.nextPostId = 6;
    saveData();
}
initSampleData();

// ================================================================
// STATE
// ================================================================
let currentUser = null;
let currentSort = 'new';
let currentRank = 'discuss';
let viewingPostId = null;
let uploadImages = [];
let uploadVideo = null;

// ================================================================
// DOM REFS
// ================================================================
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

const toastEl = $('#toast');
const userArea = $('#userArea');
const navLinks = $('#navLinks');
const navToggle = $('#navToggle');
const postList = $('#postList');
const feedTabs = $('#feedTabs');
const rankTabs = $('#rankTabs');
const rankList = $('#rankList');
const authModal = $('#authModal');
const authContent = $('#authContent');
const authClose = $('#authClose');
const profileBox = $('#profileBox');
const btnPublish = $('#btnPublish');
const pubTitle = $('#pubTitle');
const pubContent = $('#pubContent');
const pubPrice = $('#pubPrice');
const pubImages = $('#pubImages');
const pubVideo = $('#pubVideo');
const btnUploadImages = $('#btnUploadImages');
const btnUploadVideo = $('#btnUploadVideo');
const imageCount = $('#imageCount');
const videoCount = $('#videoCount');
const imagePreview = $('#imagePreview');
const videoPreview = $('#videoPreview');
const detailModal = $('#detailModal');
const detailContent = $('#detailContent');
const detailClose = $('#detailClose');
const shareModal = $('#shareModal');
const shareLinkInput = $('#shareLinkInput');
const shareCopyBtn = $('#shareCopyBtn');
const shareClose = $('#shareClose');
const champions = $('#champions');

// ================================================================
// TOAST
// ================================================================
let toastTimer = null;

function showToast(msg, type = 'info') {
    if (toastTimer) { clearTimeout(toastTimer);
        toastEl.classList.remove('show'); }
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + type;
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
        toastTimer = null;
    }, 2800);
}

// ================================================================
// AUTH
// ================================================================
function getCurrentUser() {
    if (currentUser) return currentUser;
    const saved = sessionStorage.getItem('quUser');
    if (saved) {
        try {
            const uid = parseInt(saved, 10);
            const user = data.users.find(u => u.id === uid);
            if (user) { currentUser = user; return user; }
        } catch (_) {}
    }
    return null;
}

function setCurrentUser(user) {
    currentUser = user;
    if (user) {
        sessionStorage.setItem('quUser', String(user.id));
    } else {
        sessionStorage.removeItem('quUser');
    }
    renderNav();
    renderFeed();
    renderRank();
    renderProfile();
    renderChampions();
}

function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        showToast('请先登录', 'error');
        openAuthModal();
        return null;
    }
    return user;
}

// ================================================================
// NAV
// ================================================================
function renderNav() {
    const user = getCurrentUser();
    if (user) {
        const avatarHtml = user.avatar ?
            `<img src="${user.avatar}" alt="头像" />` :
            `<span>${user.username.charAt(0).toUpperCase()}</span>`;
        userArea.innerHTML = `
            <div class="avatar-sm">${avatarHtml}</div>
            <span class="username">${user.username}</span>
            <button class="btn-logout" id="btnLogout"><i class="fas fa-sign-out-alt"></i> 退出</button>
        `;
        const btnLogout = $('#btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                setCurrentUser(null);
                showToast('已退出', 'info');
                closeAllModals();
            });
        }
    } else {
        userArea.innerHTML = `
            <button class="btn-login" id="btnLogin"><i class="fas fa-user-plus"></i> 登录 / 注册</button>
        `;
        const btnLogin = $('#btnLogin');
        if (btnLogin) {
            btnLogin.addEventListener('click', openAuthModal);
        }
    }
}

// ================================================================
// NAVIGATION
// ================================================================
function navigateTo(page) {
    $$('.page').forEach(el => el.classList.remove('active'));
    const target = $('#page-' + page);
    if (target) target.classList.add('active');

    $$('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
    });

    if (page === 'publish' || page === 'profile') {
        $('#sidebar').style.display = 'none';
    } else {
        $('#sidebar').style.display = '';
    }

    if (page === 'home') {
        renderFeed();
        renderRank();
        renderChampions();
    }
    if (page === 'profile') {
        renderProfile();
    }
}

$$('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(a.dataset.page);
    });
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// ================================================================
// AUTH MODAL
// ================================================================
let authMode = 'login';

function openAuthModal() {
    authModal.classList.add('open');
    renderAuthForm();
}

function closeAuthModal() {
    authModal.classList.remove('open');
}

function renderAuthForm() {
    const isLogin = authMode === 'login';
    authContent.innerHTML = `
        <div class="auth-title">${isLogin ? '登录' : '注册'}账号</div>
        <div class="auth-sub">${isLogin ? '欢迎回来！' : '加入趣社区，分享你的精彩'}</div>
        <form id="authForm">
            <div class="form-group">
                <label>用户名</label>
                <input type="text" id="authUsername" placeholder="请输入用户名" required />
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" id="authPassword" placeholder="请输入密码" required />
            </div>
            ${!isLogin ? `
            <div class="form-group">
                <label>确认密码</label>
                <input type="password" id="authPassword2" placeholder="请再次输入密码" required />
            </div>
            ` : ''}
            <button type="submit" class="btn-auth">${isLogin ? '登 录' : '注 册'}</button>
        </form>
        <div class="auth-switch">
            ${isLogin ? '还没有账号？' : '已有账号？'}
            <a id="authSwitch">${isLogin ? '去注册' : '去登录'}</a>
        </div>
    `;

    const form = $('#authForm');
    if (form) {
        form.addEventListener('submit', handleAuthSubmit);
    }
    const switchLink = $('#authSwitch');
    if (switchLink) {
        switchLink.addEventListener('click', () => {
            authMode = authMode === 'login' ? 'register' : 'login';
            renderAuthForm();
        });
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const username = $('#authUsername').value.trim();
    const password = $('#authPassword').value.trim();
    if (!username || !password) {
        showToast('请填写完整信息', 'error');
        return;
    }

    if (authMode === 'login') {
        const user = data.users.find(u => u.username === username && u.password === password);
        if (!user) {
            showToast('用户名或密码错误', 'error');
            return;
        }
        setCurrentUser(user);
        showToast('登录成功！', 'success');
        closeAuthModal();
        renderFeed();
        renderRank();
        renderProfile();
        renderChampions();
    } else {
        const password2 = $('#authPassword2').value.trim();
        if (password !== password2) {
            showToast('两次密码输入不一致', 'error');
            return;
        }
        if (data.users.find(u => u.username === username)) {
            showToast('用户名已存在', 'error');
            return;
        }
        const newUser = {
            id: data.nextUserId++,
            username,
            password,
            avatar: '',
            joined: Date.now(),
        };
        data.users.push(newUser);
        saveData();
        setCurrentUser(newUser);
        showToast('注册成功！欢迎加入 🎉', 'success');
        closeAuthModal();
        renderFeed();
        renderRank();
        renderProfile();
        renderChampions();
    }
}

authClose.addEventListener('click', closeAuthModal);
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
});

// ================================================================
// CHAMPIONS (顶部三个排行榜第一名)
// ================================================================
function renderChampions() {
    const posts = data.posts;
    if (posts.length === 0) {
        champions.innerHTML = '';
        return;
    }

    // 讨论度第一
    const discussSorted = [...posts].sort((a, b) =>
        (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
    );
    const discussChamp = discussSorted[0];

    // 点赞量第一
    const likesSorted = [...posts].sort((a, b) => b.likes.length - a.likes.length);
    const likesChamp = likesSorted[0];

    // 付费最高第一
    const priceSorted = [...posts].sort((a, b) => (b.price || 0) - (a.price || 0));
    const priceChamp = priceSorted[0];

    const champs = [
        { label: '🔥 讨论度 No.1', post: discussChamp, key: 'discuss' },
        { label: '❤️ 点赞量 No.1', post: likesChamp, key: 'likes' },
        { label: '💰 付费最高 No.1', post: priceChamp, key: 'price' },
    ];

    let html = '';
    champs.forEach(({ label, post, key }) => {
        if (!post) return;
        const rankText = key === 'discuss' ? `互动 ${post.likes.length + post.comments.length}` :
            key === 'likes' ? `点赞 ${post.likes.length}` :
            `¥${(post.price || 0).toFixed(2)}`;
        html += `
            <div class="champion-item" onclick="openDetail(${post.id})">
                <div class="champ-label">${label}</div>
                <div class="champ-title">${escapeHtml(post.title)}</div>
                <div class="champ-meta">${post.authorName} · ${formatTime(post.time)}</div>
                <div class="champ-badge">${rankText}</div>
            </div>
        `;
    });

    champions.innerHTML = html;
}

// ================================================================
// FEED
// ================================================================
function renderFeed() {
    let posts = [...data.posts];
    if (currentSort === 'new') {
        posts.sort((a, b) => b.time - a.time);
    } else {
        posts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    }

    const user = getCurrentUser();
    if (posts.length === 0) {
        postList.innerHTML = `
            <div style="text-align:center;padding:60px 0;color:var(--text-secondary);">
                <i class="fas fa-inbox" style="font-size:40px;display:block;margin-bottom:12px;"></i>
                暂无帖子，快来发布第一条吧！
            </div>
        `;
        return;
    }

    // 获取排行榜信息
    const rankInfo = getRankInfo();

    let html = '';
    posts.forEach(p => {
        const liked = user ? p.likes.includes(user.id) : false;
        const commentCount = p.comments ? p.comments.length : 0;
        const price = p.price || 0;

        // 热度徽章
        let hotBadge = '';
        if (p.likes.length + commentCount > 20) {
            hotBadge = `<span class="hot-badge">🔥 热门</span>`;
        }

        // 排行榜徽章
        let rankBadge = '';
        if (rankInfo[p.id]) {
            rankBadge = `<span class="rank-badge">🏆 ${rankInfo[p.id]}</span>`;
        }

        // 作者头像
        const authorUser = data.users.find(u => u.id === p.authorId);
        const authorAvatar = authorUser && authorUser.avatar ? authorUser.avatar : '';

        // 媒体
        let mediaHtml = '';
        if (p.images && p.images.length > 0) {
            mediaHtml += `<div class="post-media">`;
            p.images.forEach(img => {
                mediaHtml += `<img src="${img}" alt="图片" />`;
            });
            mediaHtml += `</div>`;
        }
        if (p.video) {
            mediaHtml += `<div class="post-media"><video src="${p.video}" controls></video></div>`;
        }

        html += `
            <div class="post-card" data-id="${p.id}">
                <div class="post-header">
                    <div class="avatar">${authorAvatar ? `<img src="${authorAvatar}" />` : p.authorName.charAt(0).toUpperCase()}</div>
                    <div class="info">
                        <div class="name">${p.authorName}</div>
                        <div class="time">${formatTime(p.time)}</div>
                    </div>
                </div>
                <div class="post-title">${escapeHtml(p.title)}</div>
                <div class="post-content">${escapeHtml(p.content)}</div>
                ${mediaHtml}
                <div class="post-meta">
                    <button class="action-btn like-btn ${liked ? 'liked' : ''}" data-id="${p.id}">
                        <i class="${liked ? 'fas' : 'far'} fa-heart"></i>
                        <span class="count">${p.likes.length}</span>
                    </button>
                    <button class="action-btn comment-btn" data-id="${p.id}">
                        <i class="far fa-comment"></i>
                        <span class="count">${commentCount}</span>
                    </button>
                    <button class="action-btn share-btn" data-id="${p.id}">
                        <i class="fas fa-share-alt"></i>
                        <span class="count">${p.shares || 0}</span>
                    </button>
                    ${price > 0 ? `<span class="price-tag"><i class="fas fa-coins"></i> ¥${price.toFixed(2)}</span>` : ''}
                    ${hotBadge}
                    ${rankBadge}
                </div>
            </div>
        `;
    });
    postList.innerHTML = html;

    // 事件绑定
    $$('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id, 10);
            if (id) toggleLike(id);
        });
    });

    $$('.comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id, 10);
            if (id) openDetail(id);
        });
    });

    $$('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id, 10);
            if (id) openShare(id);
        });
    });

    $$('.post-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id, 10);
            if (id) openDetail(id);
        });
    });
}

feedTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('.feed-header .tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    renderFeed();
});

// ================================================================
// RANK INFO (获取每个帖子的排名)
// ================================================================
function getRankInfo() {
    const posts = data.posts;
    const result = {};

    // 讨论度排名
    const discussSorted = [...posts].sort((a, b) =>
        (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
    );
    discussSorted.forEach((p, idx) => {
        if (idx < 10) {
            if (!result[p.id]) result[p.id] = [];
            result[p.id].push(`讨论度 No.${idx + 1}`);
        }
    });

    // 点赞量排名
    const likesSorted = [...posts].sort((a, b) => b.likes.length - a.likes.length);
    likesSorted.forEach((p, idx) => {
        if (idx < 10) {
            if (!result[p.id]) result[p.id] = [];
            result[p.id].push(`点赞 No.${idx + 1}`);
        }
    });

    // 付费排名
    const priceSorted = [...posts].sort((a, b) => (b.price || 0) - (a.price || 0));
    priceSorted.forEach((p, idx) => {
        if (idx < 10 && (p.price || 0) > 0) {
            if (!result[p.id]) result[p.id] = [];
            result[p.id].push(`付费 No.${idx + 1}`);
        }
    });

    // 转为字符串
    for (const key in result) {
        result[key] = result[key].join(' · ');
    }

    return result;
}

// ================================================================
// RANK (侧边栏)
// ================================================================
function renderRank() {
    let list = [...data.posts];
    if (currentRank === 'discuss') {
        list.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    } else if (currentRank === 'likes') {
        list.sort((a, b) => b.likes.length - a.likes.length);
    } else {
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    const top = list.slice(0, 10);
    if (top.length === 0) {
        rankList.innerHTML = `<div class="rank-empty">暂无数据</div>`;
        return;
    }

    let html = '';
    top.forEach((p, idx) => {
        const numClass = idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : '';
        let value = '';
        if (currentRank === 'discuss') value = (p.likes.length + p.comments.length) + ' 互动';
        else if (currentRank === 'likes') value = p.likes.length + ' 赞';
        else value = '¥' + (p.price || 0).toFixed(2);

        html += `
            <div class="rank-item" data-id="${p.id}">
                <div class="rank-num ${numClass}">${idx + 1}</div>
                <div class="rank-info">
                    <div class="r-title">${escapeHtml(p.title)}</div>
                    <div class="r-meta">${p.authorName} · ${formatTime(p.time)}</div>
                </div>
                <div class="rank-value">${value}</div>
            </div>
        `;
    });
    rankList.innerHTML = html;

    $$('.rank-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id, 10);
            if (id) openDetail(id);
        });
    });
}

rankTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    $$('.rank-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRank = btn.dataset.rank;
    renderRank();
});

// ================================================================
// LIKE
// ================================================================
function toggleLike(postId) {
    const user = requireAuth();
    if (!user) return;
    const post = data.posts.find(p => p.id === postId);
    if (!post) return;

    const idx = post.likes.indexOf(user.id);
    if (idx > -1) {
        post.likes.splice(idx, 1);
        showToast('已取消点赞', 'info');
    } else {
        post.likes.push(user.id);
        showToast('点赞成功 ❤️', 'success');
    }
    saveData();
    renderFeed();
    renderRank();
    renderChampions();
    if (detailModal.classList.contains('open') && viewingPostId === postId) {
        openDetail(postId);
    }
}

// ================================================================
// DETAIL
// ================================================================
function openDetail(postId) {
    const post = data.posts.find(p => p.id === postId);
    if (!post) { showToast('帖子不存在', 'error'); return; }

    viewingPostId = postId;
    post.views = (post.views || 0) + 1;
    saveData();

    const user = getCurrentUser();
    const liked = user ? post.likes.includes(user.id) : false;
    const commentCount = post.comments ? post.comments.length : 0;
    const price = post.price || 0;

    const authorUser = data.users.find(u => u.id === post.authorId);
    const authorAvatar = authorUser && authorUser.avatar ? authorUser.avatar : '';

    // 媒体
    let mediaHtml = '';
    if (post.images && post.images.length > 0) {
        mediaHtml += `<div class="detail-media">`;
        post.images.forEach(img => {
            mediaHtml += `<img src="${img}" alt="图片" />`;
        });
        mediaHtml += `</div>`;
    }
    if (post.video) {
        mediaHtml += `<div class="detail-media"><video src="${post.video}" controls></video></div>`;
    }

    // 评论
    let commentsHtml = '';
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(c => {
            const cUser = data.users.find(u => u.id === c.authorId);
            const cAvatar = cUser && cUser.avatar ? cUser.avatar : '';
            const cName = c.authorName || '匿名';
            commentsHtml += `
                <div class="comment-item">
                    <div class="c-avatar">${cAvatar ? `<img src="${cAvatar}" />` : cName.charAt(0).toUpperCase()}</div>
                    <div class="c-body">
                        <span class="c-name">${cName}</span>
                        <span class="c-time">${formatTime(c.time)}</span>
                        <div class="c-text">${escapeHtml(c.content)}</div>
                    </div>
                </div>
            `;
        });
    } else {
        commentsHtml = `<div class="comment-empty">暂无评论，来说点什么吧</div>`;
    }

    detailContent.innerHTML = `
        <div class="detail-header">
            <div class="avatar">${authorAvatar ? `<img src="${authorAvatar}" />` : post.authorName.charAt(0).toUpperCase()}</div>
            <div class="info">
                <div class="name">${post.authorName}</div>
                <div class="time">${formatTime(post.time)} · ${post.views || 0} 次浏览</div>
            </div>
        </div>
        <div class="detail-title">${escapeHtml(post.title)}</div>
        <div class="detail-body">${escapeHtml(post.content)}</div>
        ${mediaHtml}
        <div class="detail-meta">
            <button class="action-btn like-btn ${liked ? 'liked' : ''}" data-id="${post.id}">
                <i class="${liked ? 'fas' : 'far'} fa-heart"></i>
                <span class="count">${post.likes.length}</span>
            </button>
            <button class="action-btn comment-btn" data-id="${post.id}">
                <i class="far fa-comment"></i>
                <span class="count">${commentCount}</span>
            </button>
            <button class="action-btn share-btn" data-id="${post.id}">
                <i class="fas fa-share-alt"></i>
                <span class="count">${post.shares || 0}</span>
            </button>
            ${price > 0 ? `<span class="price-tag"><i class="fas fa-coins"></i> 付费 ¥${price.toFixed(2)}</span>` : ''}
        </div>
        <div class="comments-section">
            <div class="comment-title"><i class="far fa-comment-dots"></i> 评论 (${commentCount})</div>
            <div class="comment-input">
                <input type="text" id="commentInput" placeholder="写下你的评论..." />
                <button id="commentSubmit">发送</button>
            </div>
            <div id="commentList">${commentsHtml}</div>
        </div>
    `;

    detailModal.classList.add('open');

    // 点赞
    const likeBtn = detailContent.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const id = parseInt(likeBtn.dataset.id, 10);
            if (id) toggleLike(id);
        });
    }

    // 分享
    const shareBtn = detailContent.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const id = parseInt(shareBtn.dataset.id, 10);
            if (id) openShare(id);
        });
    }

    // 评论
    const commentInput = detailContent.querySelector('#commentInput');
    const commentSubmit = detailContent.querySelector('#commentSubmit');
    if (commentSubmit && commentInput) {
        const submitComment = () => {
            const text = commentInput.value.trim();
            if (!text) { showToast('请输入评论内容', 'error'); return; }
            const user = requireAuth();
            if (!user) return;
            const post = data.posts.find(p => p.id === postId);
            if (!post) return;
            if (!post.comments) post.comments = [];
            post.comments.push({
                id: 'c' + Date.now() + Math.random().toString(36).slice(2, 6),
                authorId: user.id,
                authorName: user.username,
                content: text,
                time: Date.now(),
            });
            saveData();
            commentInput.value = '';
            showToast('评论成功！', 'success');
            openDetail(postId);
            renderFeed();
            renderRank();
            renderChampions();
        };
        commentSubmit.addEventListener('click', submitComment);
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitComment();
        });
    }
}

detailClose.addEventListener('click', () => {
    detailModal.classList.remove('open');
    renderFeed();
    renderRank();
    renderChampions();
});
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove('open');
        renderFeed();
        renderRank();
        renderChampions();
    }
});

// ================================================================
// SHARE
// ================================================================
function openShare(postId) {
    const post = data.posts.find(p => p.id === postId);
    if (!post) { showToast('帖子不存在', 'error'); return; }

    post.shares = (post.shares || 0) + 1;
    saveData();

    const url = window.location.href.split('?')[0] + '?post=' + postId;
    shareLinkInput.value = url;
    shareModal.classList.add('open');
    renderFeed();
    renderRank();
    renderChampions();
}

shareCopyBtn.addEventListener('click', () => {
    const val = shareLinkInput.value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(val).then(() => {
            showToast('链接已复制！', 'success');
        }).catch(() => {
            fallbackCopy(val);
        });
    } else {
        fallbackCopy(val);
    }
});

function fallbackCopy(text) {
    shareLinkInput.select();
    try {
        document.execCommand('copy');
        showToast('链接已复制！', 'success');
    } catch (_) {
        showToast('复制失败，请手动复制', 'error');
    }
}

shareClose.addEventListener('click', () => shareModal.classList.remove('open'));
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.remove('open');
});

// ================================================================
// PUBLISH (支持图片/视频上传)
// ================================================================
// 图片上传
btnUploadImages.addEventListener('click', () => {
    pubImages.click();
});

pubImages.addEventListener('change', function(e) {
    const files = Array.from(this.files);
    const remaining = 8 - uploadImages.length;

    if (files.length > remaining) {
        showToast(`最多还能上传 ${remaining} 张图片`, 'error');
        this.value = '';
        return;
    }

    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            showToast('图片不能超过 5MB', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadImages.push(e.target.result);
            renderImagePreview();
            updateImageCount();
        };
        reader.readAsDataURL(file);
    });
    this.value = '';
});

function renderImagePreview() {
    let html = '';
    uploadImages.forEach((img, idx) => {
        html += `
            <div class="preview-item">
                <img src="${img}" alt="图片" />
                <button class="remove-btn" data-idx="${idx}"><i class="fas fa-times"></i></button>
            </div>
        `;
    });
    imagePreview.innerHTML = html;

    imagePreview.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx, 10);
            uploadImages.splice(idx, 1);
            renderImagePreview();
            updateImageCount();
        });
    });
}

function updateImageCount() {
    imageCount.textContent = `已选 ${uploadImages.length} 张`;
}

// 视频上传
btnUploadVideo.addEventListener('click', () => {
    pubVideo.click();
});

pubVideo.addEventListener('change', function(e) {
    const file = this.files[0];
    if (!file) return;

    if (uploadVideo) {
        showToast('只能上传 1 个视频', 'error');
        this.value = '';
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        showToast('视频不能超过 50MB', 'error');
        this.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadVideo = e.target.result;
        renderVideoPreview();
        updateVideoCount();
    };
    reader.readAsDataURL(file);
    this.value = '';
});

function renderVideoPreview() {
    if (uploadVideo) {
        videoPreview.innerHTML = `
            <div class="preview-item">
                <video src="${uploadVideo}" controls></video>
                <button class="remove-btn" id="removeVideo"><i class="fas fa-times"></i></button>
            </div>
        `;
        const removeBtn = document.getElementById('removeVideo');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                uploadVideo = null;
                renderVideoPreview();
                updateVideoCount();
            });
        }
    } else {
        videoPreview.innerHTML = '';
    }
}

function updateVideoCount() {
    videoCount.textContent = uploadVideo ? '已选择 1 个视频' : '未选择';
}

// 发布
btnPublish.addEventListener('click', () => {
    const user = requireAuth();
    if (!user) return;

    const title = pubTitle.value.trim();
    const content = pubContent.value.trim();
    const price = parseFloat(pubPrice.value) || 0;

    if (!title) { showToast('请输入标题', 'error');
        pubTitle.focus(); return; }
    if (!content) { showToast('请输入内容', 'error');
        pubContent.focus(); return; }
    if (price < 0) { showToast('金额不能为负数', 'error'); return; }

    const newPost = {
        id: data.nextPostId++,
        title,
        content,
        authorId: user.id,
        authorName: user.username,
        time: Date.now(),
        likes: [],
        comments: [],
        views: 0,
        shares: 0,
        price: price,
        images: [...uploadImages],
        video: uploadVideo || '',
    };

    data.posts.unshift(newPost);
    saveData();

    // 重置
    pubTitle.value = '';
    pubContent.value = '';
    pubPrice.value = '0';
    uploadImages = [];
    uploadVideo = null;
    renderImagePreview();
    updateImageCount();
    renderVideoPreview();
    updateVideoCount();

    showToast('发布成功！🎉', 'success');
    navigateTo('home');
    renderFeed();
    renderRank();
    renderChampions();
});

// ================================================================
// PROFILE (含头像功能)
// ================================================================
function renderProfile() {
    const user = getCurrentUser();

    if (!user) {
        profileBox.innerHTML = `
            <div class="profile-empty">
                <i class="fas fa-user-circle" style="font-size:48px;color:var(--text-secondary);display:block;margin-bottom:12px;"></i>
                请先登录查看个人中心
                <br /><br />
                <button class="btn-login" style="background:var(--primary);color:#fff;padding:10px 32px;border-radius:30px;font-weight:500;border:none;cursor:pointer;" onclick="openAuthModal()">
                    去登录
                </button>
            </div>
        `;
        return;
    }

    const avatarUrl = user.avatar || '';
    const avatarDisplay = avatarUrl ?
        `<img src="${avatarUrl}" alt="头像" />` :
        `<div class="big-avatar">${user.username.charAt(0).toUpperCase()}</div>`;

    const userPosts = data.posts.filter(p => p.authorId === user.id);
    let postsHtml = '';
    if (userPosts.length === 0) {
        postsHtml = `<div class="profile-empty">你还没有发布过帖子</div>`;
    } else {
        userPosts.forEach(p => {
            postsHtml += `
                <div class="pp-item" data-id="${p.id}">
                    <div class="pp-title-text">${escapeHtml(p.title)}</div>
                    <div class="pp-meta">${formatTime(p.time)} · ${p.likes.length} 赞 · ${p.comments ? p.comments.length : 0} 评论</div>
                </div>
            `;
        });
    }

    profileBox.innerHTML = `
        <div class="profile-head">
            <div class="avatar-wrapper" id="avatarWrapper">
                ${avatarDisplay}
                <div class="avatar-overlay" id="avatarOverlay">
                    <i class="fas fa-camera"></i>
                    <span>更换头像</span>
                </div>
                <input type="file" id="avatarInput" accept="image/*" style="display:none;" />
            </div>
            <div class="p-info">
                <div class="p-name">${user.username}</div>
                <div class="p-joined">加入于 ${formatTime(user.joined)}</div>
                <button class="btn-change-avatar" id="changeAvatarBtn">
                    <i class="fas fa-camera"></i> 更换头像
                </button>
            </div>
        </div>
        <div class="profile-posts">
            <div class="pp-title">我的帖子 (${userPosts.length})</div>
            ${postsHtml}
        </div>
    `;

    // 头像事件
    const avatarWrapper = document.getElementById('avatarWrapper');
    const avatarOverlay = document.getElementById('avatarOverlay');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');

    if (avatarOverlay) {
        avatarOverlay.style.display = 'none';
    }

    if (avatarWrapper && avatarInput) {
        avatarWrapper.addEventListener('click', function(e) {
            if (e.target.closest('.btn-change-avatar')) return;
            avatarInput.click();
        });
    }

    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            avatarInput.click();
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                showToast('图片大小不能超过 2MB', 'error');
                this.value = '';
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
                showToast('仅支持 JPG、PNG、GIF、WEBP 格式', 'error');
                this.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const currentUser = getCurrentUser();
                if (currentUser) {
                    currentUser.avatar = e.target.result;
                    // 更新所有帖子的作者头像
                    data.posts.forEach(p => {
                        if (p.authorId === currentUser.id) {
                            p.authorAvatar = e.target.result;
                        }
                    });
                    saveData();
                    renderProfile();
                    renderNav();
                    renderFeed();
                    showToast('头像更新成功！ 🎉', 'success');
                }
            };
            reader.onerror = function() {
                showToast('读取图片失败，请重试', 'error');
            };
            reader.readAsDataURL(file);
        });
    }

    // 帖子点击
    $$('.pp-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id, 10);
            if (id) openDetail(id);
        });
    });
}

// ================================================================
// UTILITY
// ================================================================
function formatTime(ts) {
    if (!ts) return '刚刚';
    const diff = Date.now() - ts;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
    if (diff < 172800000) return '昨天';
    if (diff < 259200000) return '前天';
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
        pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeAllModals() {
    authModal.classList.remove('open');
    detailModal.classList.remove('open');
    shareModal.classList.remove('open');
}

// ================================================================
// INIT
// ================================================================
function init() {
    const user = getCurrentUser();
    if (user) currentUser = user;
    renderNav();
    renderFeed();
    renderRank();
    renderProfile();
    renderChampions();

    // URL 参数
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
        const id = parseInt(postId, 10);
        if (!isNaN(id)) {
            setTimeout(() => openDetail(id), 500);
        }
    }
}

// 暴露给全局
window.openAuthModal = openAuthModal;
window.openDetail = openDetail;
window.openShare = openShare;

init();

window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        data = loadData();
        renderFeed();
        renderRank();
        renderProfile();
        renderChampions();
    }
});

console.log('🌟 趣社区已启动！');
console.log('📦 数据存储在 localStorage 中');
console.log('💡 登录后进入「我的」页面，鼠标悬停到头像上即可更换头像');
console.log('📸 发布帖子支持上传最多 8 张图片和 1 个视频');
console.log('🏆 首页顶部展示三个排行榜的第一名');
