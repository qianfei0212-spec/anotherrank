// ================================================================
//  DATA LAYER
// ================================================================
const STORAGE_KEY = 'quCommunityData';
let data = loadData();

function getDefaultData() {
    return {
        users: [],
        posts: [],
        nextUserId: 1,
        nextPostId: 1,
    };
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                const def = getDefaultData();
                for (const k in def) {
                    if (!(k in parsed)) parsed[k] = def[k];
                }
                return parsed;
            }
        }
    } catch (_) { /* ignore */ }
    return getDefaultData();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ================================================================
//  INIT SAMPLE DATA (if empty)
// ================================================================
function initSampleData() {
    if (data.users.length > 0) return;
    const now = Date.now();
    const users = [
        { id: 1, username: '星辰', password: '123456', avatar: '', joined: now - 86400000 * 30 },
        { id: 2, username: '月光', password: '123456', avatar: '', joined: now - 86400000 * 20 },
        { id: 3, username: '晚风', password: '123456', avatar: '', joined: now - 86400000 * 10 },
        { id: 4, username: '晨曦', password: '123456', avatar: '', joined: now - 86400000 * 5 },
    ];
    data.users = users;
    data.nextUserId = 5;

    const posts = [
        { id: 1, title: '分享我最近的摄影作品', content: '周末去了郊外，拍到了绝美的日落。金色的阳光洒在田野上，一切都那么宁静美好。分享给大家，希望你们也能感受到这份治愈。', authorId: 1,
            authorName: '星辰', time: now - 3600000 * 2, likes: [2, 3], comments: [{ id: 'c1', authorId: 2,
                authorName: '月光', content: '太美了！求地点！', time: now - 3600000 * 1.5 }, { id: 'c2',
                authorId: 3, authorName: '晚风', content: '光影处理得太棒了', time: now - 3600000 * 1.2 }],
            views: 45, shares: 3, price: 0 },
        { id: 2, title: 'AI 时代下我们该如何自处', content: '最近 ChatGPT 大火，很多人担心被取代。我的观点是：AI 是工具，不是对手。学会使用工具的人，永远不会被工具淘汰。大家怎么看？', authorId: 2,
            authorName: '月光', time: now - 3600000 * 5, likes: [1, 3, 4], comments: [{ id: 'c3',
                authorId: 1, authorName: '星辰', content: '说得对，人机协作才是未来', time: now - 3600000 * 4.5 },
            { id: 'c4', authorId: 4, authorName: '晨曦', content: '我觉得还是要保持学习的热情', time: now -
                    3600000 * 4 }], views: 128, shares: 12, price: 0 },
        { id: 3, title: '独立开发者的日常 —— 从零到上线', content: '花了一个月时间，独立开发了一款笔记应用。从构思、设计、编码到测试上线，每一步都充满挑战。这里分享一些心得和踩过的坑，希望对大家有帮助。', authorId: 3,
            authorName: '晚风', time: now - 3600000 * 10, likes: [1, 4], comments: [{ id: 'c5',
                authorId: 1, authorName: '星辰', content: '太强了！我也想学独立开发', time: now - 3600000 * 9 },
            { id: 'c6', authorId: 2, authorName: '月光', content: '后端用的什么框架？', time: now - 3600000 *
                    8.5 }], views: 89, shares: 7, price: 9.99 },
        { id: 4, title: '2026 年值得关注的 5 个科技趋势', content: '1. 边缘计算 2. 生成式 AI 3. 量子计算 4. 脑机接口 5. 可持续能源。这些领域在未来几年将迎来爆发式增长，值得提前布局。', authorId: 4,
            authorName: '晨曦', time: now - 3600000 * 18, likes: [2, 3], comments: [{ id: 'c7',
                authorId: 2, authorName: '月光', content: '量子计算还早吧？', time: now - 3600000 * 17 },
            { id: 'c8', authorId: 3, authorName: '晚风', content: '边缘计算确实是大趋势', time: now - 3600000 *
                    16.5 }], views: 210, shares: 25, price: 0 },
        { id: 5, title: '我的读书笔记：<人类群星闪耀时>', content: '茨威格的这本书让我深受触动。历史的关键时刻，往往由少数人的勇气和决断所决定。摘抄几段与大家共勉： "一个人生命中最大的幸运，莫过于在他的人生中途，即在他年富力强时发现了自己的使命。"', authorId: 1,
            authorName: '星辰', time: now - 3600000 * 24, likes: [4], comments: [{ id: 'c9',
                authorId: 4, authorName: '晨曦', content: '这本书我也读过，真的很震撼', time: now - 3600000 *
                    23 }], views: 56, shares: 4, price: 0 },
        { id: 6, title: '付费深度内容：如何构建个人知识体系', content: '（付费内容预览）在这个信息爆炸的时代，构建一个属于自己的知识体系至关重要。本文将分享一套完整的知识管理方法论，包括信息收集、整理、内化和输出四个环节。', authorId: 2,
            authorName: '月光', time: now - 3600000 * 30, likes: [1, 3, 4], comments: [{ id: 'c10',
                authorId: 1, authorName: '星辰', content: '付费支持！干货满满', time: now - 3600000 * 29 },
            { id: 'c11', authorId: 3, authorName: '晚风', content: '已购，内容很值', time: now - 3600000 *
                    28 }], views: 320, shares: 18, price: 19.99 },
        { id: 7, title: '旅行 vlog：大理的慢生活', content: '在大理待了一周，每天看云、喝茶、散步。这里的节奏很慢，但每一天都很充实。附上一些随手拍的照片，希望能把这份惬意传递给你。', authorId: 3,
            authorName: '晚风', time: now - 3600000 * 40, likes: [1, 2, 4], comments: [{ id: 'c12',
                authorId: 1, authorName: '星辰', content: '大理是我一直想去的地方', time: now - 3600000 * 39 },
            { id: 'c13', authorId: 2, authorName: '月光', content: '照片拍得太有感觉了', time: now - 3600000 *
                    38 }, { id: 'c14', authorId: 4, authorName: '晨曦', content: '下次一起啊！',
                time: now - 3600000 * 37 }], views: 176, shares: 9, price: 0 },
    ];
    data.posts = posts;
    data.nextPostId = 8;
    saveData();
}
initSampleData();

// ================================================================
//  STATE
// ================================================================
let currentUser = null;
let currentSort = 'new';
let currentRank = 'discuss';
let viewingPostId = null;
let sharePostId = null;

// ================================================================
//  DOM REFS
// ================================================================
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

const toastEl = $('#toast');
const navLinks = $('#navLinks');
const navToggle = $('#navToggle');
const userArea = $('#userArea');
const postList = $('#postList');
const feedTabs = $('#feedTabs');
const rankTabs = $('#rankTabs');
const rankList = $('#rankList');
const detailModal = $('#detailModal');
const detailContent = $('#detailContent');
const detailClose = $('#detailClose');
const authModal = $('#authModal');
const authContent = $('#authContent');
const authClose = $('#authClose');
const shareModal = $('#shareModal');
const shareLinkInput = $('#shareLinkInput');
const shareCopyBtn = $('#shareCopyBtn');
const shareClose = $('#shareClose');
const btnPublish = $('#btnPublish');
const pubTitle = $('#pubTitle');
const pubContent = $('#pubContent');
const pubPrice = $('#pubPrice');
const profileBox = $('#profileBox');

// ================================================================
//  TOAST
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
//  AUTH
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
//  NAV
// ================================================================
function renderNav() {
    const user = getCurrentUser();
    if (user) {
        // 使用用户头像，如果没有则使用首字母
        const avatarHtml = user.avatar ? 
            `<img src="${user.avatar}" alt="头像" style="width:34px;height:34px;border-radius:50%;object-fit:cover;" />` :
            `<span class="avatar-sm">${user.username.charAt(0).toUpperCase()}</span>`;
        
        userArea.innerHTML = `
            ${avatarHtml}
            <span class="username">${user.username}</span>
            <button class="btn-logout" id="btnLogout"><i class="fas fa-sign-out-alt"></i> 退出</button>
        `;
        const btnLogout = $('#btnLogout');
        if (btnLogout) btnLogout.addEventListener('click', () => {
            setCurrentUser(null);
            showToast('已退出', 'info');
            closeAllModals();
        });
    } else {
        userArea.innerHTML = `
            <button class="btn-login" id="btnLogin"><i class="fas fa-user-plus"></i> 登录 / 注册</button>
        `;
        const btnLogin = $('#btnLogin');
        if (btnLogin) btnLogin.addEventListener('click', openAuthModal);
    }
}

function navigateTo(page) {
    $$('.page').forEach(el => el.classList.remove('active'));
    const target = $('#page-' + page);
    if (target) target.classList.add('active');
    $$('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
    });
    navLinks.classList.remove('open');
    if (page === 'publish' || page === 'profile') {
        $('#sidebar').style.display = 'none';
    } else {
        $('#sidebar').style.display = '';
    }
    if (page === 'home') {
        renderFeed();
        renderRank();
    }
    if (page === 'profile') {
        renderProfile();
    }
}

$$('.nav-links a').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const page = a.dataset.page;
        if (page) navigateTo(page);
    });
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// ================================================================
//  AUTH MODAL
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
        <form id="authForm" autocomplete="off">
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
    form.addEventListener('submit', handleAuthSubmit);
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
    if (!username || !password) { showToast('请填写完整信息', 'error'); return; }
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
    } else {
        const password2 = $('#authPassword2').value.trim();
        if (password !== password2) { showToast('两次密码输入不一致', 'error'); return; }
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
    }
}

authClose.addEventListener('click', closeAuthModal);
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
});

// ================================================================
//  FEED
// ================================================================
function renderFeed() {
    const sort = currentSort;
    let posts = [...data.posts];
    if (sort === 'new') {
        posts.sort((a, b) => b.time - a.time);
    } else if (sort === 'hot') {
        posts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    }
    const user = getCurrentUser();
    if (posts.length === 0) {
        postList.innerHTML = `<div style="text-align:center;padding:60px 0;color:var(--text-secondary);">
            <i class="fas fa-inbox" style="font-size:40px;display:block;margin-bottom:12px;"></i>
            暂无帖子，快来发布第一条吧！
        </div>`;
        return;
    }
    let html = '';
    posts.forEach(p => {
        const liked = user ? p.likes.includes(user.id) : false;
        const commentCount = p.comments ? p.comments.length : 0;
        const price = p.price || 0;
        html += `
            <div class="post-card" data-id="${p.id}">
                <div class="post-header">
                    <div class="avatar">${p.authorName.charAt(0).toUpperCase()}</div>
                    <div class="info">
                        <div class="name">${p.authorName}</div>
                        <div class="time">${formatTime(p.time)}</div>
                    </div>
                </div>
                <div class="post-title">${escapeHtml(p.title)}</div>
                <div class="post-content">${escapeHtml(p.content)}</div>
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
                        <i class="fas fa-share-square"></i>
                        <span class="count">${p.shares || 0}</span>
                    </button>
                    ${price > 0 ? `<span class="price-tag"><i class="fas fa-coins"></i> ¥${price.toFixed(2)}</span>` : ''}
                </div>
            </div>
        `;
    });
    postList.innerHTML = html;

    $$('.post-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn')) return;
            const id = parseInt(card.dataset.id, 10);
            if (id) openDetail(id);
        });
    });

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
}

feedTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const sort = btn.dataset.sort;
    if (!sort) return;
    $$('.feed-header .tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSort = sort;
    renderFeed();
});

// ================================================================
//  RANK
// ================================================================
function renderRank() {
    const type = currentRank;
    let list = [...data.posts];
    if (type === 'discuss') {
        list.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    } else if (type === 'likes') {
        list.sort((a, b) => b.likes.length - a.likes.length);
    } else if (type === 'price') {
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
        if (type === 'discuss') value = (p.likes.length + p.comments.length) + ' 互动';
        else if (type === 'likes') value = p.likes.length + ' 赞';
        else if (type === 'price') value = '¥' + (p.price || 0).toFixed(2);
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
    const rank = btn.dataset.rank;
    if (!rank) return;
    $$('.rank-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRank = rank;
    renderRank();
});

// ================================================================
//  DETAIL
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

    let commentsHtml = '';
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(c => {
            const cName = c.authorName || '匿名';
            commentsHtml += `
                <div class="comment-item">
                    <div class="c-avatar">${cName.charAt(0).toUpperCase()}</div>
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
            <div class="avatar">${post.authorName.charAt(0).toUpperCase()}</div>
            <div class="info">
                <div class="name">${post.authorName}</div>
                <div class="time">${formatTime(post.time)} · ${post.views || 0} 次浏览</div>
            </div>
        </div>
        <div class="detail-title">${escapeHtml(post.title)}</div>
        <div class="detail-body">${escapeHtml(post.content)}</div>
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
                <i class="fas fa-share-square"></i>
                <span class="count">${post.shares || 0}</span>
            </button>
            ${price > 0 ? `<span class="price-tag"><i class="fas fa-coins"></i> 付费 ¥${price.toFixed(2)}</span>` : ''}
        </div>
        <div class="comments-section">
            <div class="comment-title"><i class="far fa-comment-dots"></i> 评论 (${commentCount})</div>
            <div class="comment-input">
                <input type="text" id="commentInput" placeholder="写下你的评论..." />
                <button class="emoji-btn" id="emojiToggle" title="选择图标">
                    <i class="far fa-smile"></i>
                </button>
                <button id="commentSubmit">发送</button>
            </div>
            <div class="emoji-picker" id="emojiPicker">
                <button class="emoji-option" data-emoji="😊">😊</button>
                <button class="emoji-option" data-emoji="😂">😂</button>
                <button class="emoji-option" data-emoji="❤️">❤️</button>
                <button class="emoji-option" data-emoji="👍">👍</button>
                <button class="emoji-option" data-emoji="🔥">🔥</button>
                <button class="emoji-option" data-emoji="🎉">🎉</button>
                <button class="emoji-option" data-emoji="💡">💡</button>
                <button class="emoji-option" data-emoji="🙌">🙌</button>
                <button class="emoji-option" data-emoji="✨">✨</button>
                <button class="emoji-option" data-emoji="💪">💪</button>
                <button class="emoji-option" data-emoji="🤔">🤔</button>
                <button class="emoji-option" data-emoji="👏">👏</button>
            </div>
            <div id="commentList">${commentsHtml}</div>
        </div>
    `;

    detailModal.classList.add('open');

    const likeBtn = detailContent.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const id = parseInt(likeBtn.dataset.id, 10);
            if (id) toggleLike(id);
        });
    }

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
        };
        commentSubmit.addEventListener('click', submitComment);
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitComment();
        });
    }

    // 图标选择器
    const emojiToggle = detailContent.querySelector('#emojiToggle');
    const emojiPicker = detailContent.querySelector('#emojiPicker');
    if (emojiToggle && emojiPicker) {
        emojiToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPicker.classList.toggle('open');
        });
        document.addEventListener('click', () => {
            emojiPicker.classList.remove('open');
        });
        emojiPicker.querySelectorAll('.emoji-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const emoji = btn.dataset.emoji;
                const input = detailContent.querySelector('#commentInput');
                if (input) {
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const text = input.value;
                    input.value = text.substring(0, start) + emoji + text.substring(end);
                    input.focus();
                    input.selectionStart = input.selectionEnd = start + emoji.length;
                }
                emojiPicker.classList.remove('open');
            });
        });
    }

    const shareBtn = detailContent.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const id = parseInt(shareBtn.dataset.id, 10);
            if (id) openShare(id);
        });
    }
}

detailClose.addEventListener('click', () => {
    detailModal.classList.remove('open');
    renderFeed();
    renderRank();
});
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove('open');
        renderFeed();
        renderRank();
    }
});

// ================================================================
//  LIKE
// ================================================================
function toggleLike(postId) {
    const user = requireAuth();
    if (!user) return;
    const post = data.posts.find(p => p.id === postId);
    if (!post) { showToast('帖子不存在', 'error'); return; }
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
    if (detailModal.classList.contains('open') && viewingPostId === postId) {
        openDetail(postId);
    }
}

// ================================================================
//  SHARE
// ================================================================
function openShare(postId) {
    const post = data.posts.find(p => p.id === postId);
    if (!post) { showToast('帖子不存在', 'error'); return; }
    sharePostId = postId;
    post.shares = (post.shares || 0) + 1;
    saveData();
    const url = window.location.href.split('?')[0] + '?post=' + postId;
    shareLinkInput.value = url;
    shareModal.classList.add('open');
    renderFeed();
    renderRank();
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
//  PUBLISH
// ================================================================
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
    };
    data.posts.unshift(newPost);
    saveData();
    pubTitle.value = '';
    pubContent.value = '';
    pubPrice.value = '0';
    showToast('发布成功！🎉', 'success');
    navigateTo('home');
    renderFeed();
    renderRank();
});

// ================================================================
//  PROFILE
// ================================================================
function renderProfile() {
    const user = getCurrentUser();
    if (!user) {
        profileBox.innerHTML = `
            <div class="profile-empty">
                <i class="fas fa-user-circle" style="font-size:48px;color:var(--text-secondary);display:block;margin-bottom:12px;"></i>
                请先登录查看个人中心
                <br /><br />
                <button class="btn-login" style="background:var(--primary);color:#fff;padding:10px 32px;border-radius:30px;font-weight:500;" onclick="openAuthModal()">
                    去登录
                </button>
            </div>
        `;
        return;
    }
    
    // 获取用户头像，如果没有则使用默认
    const avatarUrl = user.avatar || '';
    const avatarDisplay = avatarUrl ? 
        `<img src="${avatarUrl}" alt="头像" style="width:72px;height:72px;border-radius:50%;object-fit:cover;" />` :
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

   // ===== 在 profileBox.innerHTML 中，头像部分使用这个 =====
profileBox.innerHTML = `
    <div class="profile-head">
        <div class="avatar-wrapper" id="avatarWrapper">
            ${avatarDisplay}
            <div class="avatar-overlay" id="avatarOverlay">
                <i class="fas fa-camera" style="font-size:24px;"></i>
                <span style="display:block;font-size:12px;margin-top:4px;">更换头像</span>
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

// ===== 头像悬停效果 - 使用更可靠的方式 =====
const avatarWrapper = document.getElementById('avatarWrapper');
const avatarOverlay = document.getElementById('avatarOverlay');

if (avatarWrapper && avatarOverlay) {
    // 使用 mouseenter/mouseleave 事件
    avatarWrapper.addEventListener('mouseenter', function() {
        avatarOverlay.style.display = 'flex';
    });
    avatarWrapper.addEventListener('mouseleave', function() {
        avatarOverlay.style.display = 'none';
    });
    
    // 如果头像已经有图片，也要显示 overlay
    // 默认隐藏，只在 hover 时显示
    avatarOverlay.style.display = 'none';
}

// 更换头像按钮
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
const avatarInput = document.getElementById('avatarInput');

if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        avatarInput.click();
    });
    
    if (avatarWrapper) {
        avatarWrapper.addEventListener('click', function(e) {
            if (e.target.closest('.btn-change-avatar')) return;
            avatarInput.click();
        });
    }
    
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
            const base64 = e.target.result;
            const user = getCurrentUser();
            if (user) {
                user.avatar = base64;
                saveData();
                renderProfile();
                renderNav();
                showToast('头像更新成功！', 'success');
            }
        };
        reader.onerror = function() {
            showToast('读取图片失败，请重试', 'error');
        };
        reader.readAsDataURL(file);
    });
}

// ================================================================
//  UTILITY
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
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d
        .getMinutes());
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeAllModals() {
    detailModal.classList.remove('open');
    authModal.classList.remove('open');
    shareModal.classList.remove('open');
}

// ================================================================
//  ROUTE
// ================================================================
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('post');
    if (postId) {
        const id = parseInt(postId, 10);
        if (!isNaN(id)) {
            setTimeout(() => openDetail(id), 300);
        }
    }
}

// ================================================================
//  INIT
// ================================================================
function init() {
    const user = getCurrentUser();
    if (user) currentUser = user;
    renderNav();
    renderFeed();
    renderRank();
    renderProfile();
    handleUrlParams();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('open');
        }
    });
}

window.openAuthModal = openAuthModal;
window.openDetail = openDetail;

init();

window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        data = loadData();
        renderFeed();
        renderRank();
        renderProfile();
    }
});

console.log('🌟 趣社区已启动！数据存储在 localStorage 中。');
console.log('📦 当前数据:', data);
