const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const { getDb } = require('./db');
const { requireAuth, redirectIfAuthed } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'department-portal-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')));

// 视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 注入全局设置
app.use((req, res, next) => {
  const db = getDb();
  const settings = {};
  const rows = db.prepare('SELECT key, value FROM settings').all();
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  res.locals.site = settings;
  res.locals.user = req.session.user || null;
  res.locals.query = req.query;
  next();
});

// 图标预设库
const iconPresets = [
  {
    name: '文档/办公',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 19h19l5 7h24v27H8z" fill="currentColor" opacity=".14"/><path d="M8 19h19l5 7h24v27H8z"/><path d="M8 19v-5h17l5 5"/></svg>'
  },
  {
    name: '教务/学习',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 23l24-11 24 11-24 11z" fill="currentColor" opacity=".16"/><path d="M8 23l24-11 24 11-24 11z"/><path d="M17 29v11l15 7 15-7V29"/><path d="M56 23v18"/></svg>'
  },
  {
    name: '人事/用户',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="10" fill="currentColor" opacity=".16"/><circle cx="32" cy="20" r="10"/><path d="M14 54c2.8-12.8 12.3-18 18-18s15.2 5.2 18 18"/><path d="M29 37l3 5 3-5M32 42v9"/></svg>'
  },
  {
    name: '财务/金钱',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 22h38a6 6 0 0 1 6 6v20H13a6 6 0 0 1-6-6V18a5 5 0 0 0 6 4z" fill="currentColor" opacity=".15"/><path d="M7 18a5 5 0 0 0 6 4h38a6 6 0 0 1 6 6v20H13a6 6 0 0 1-6-6z"/><path d="M41 16l11-5 3 11"/><path d="M39 35h14"/><path d="M46 29v12M42 29l4 5 4-5"/></svg>'
  },
  {
    name: '资产/仓库',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8l22 12-22 12L10 20z" fill="currentColor" opacity=".14"/><path d="M32 8l22 12-22 12L10 20z"/><path d="M10 32l22 12 22-12"/><path d="M10 44l22 12 22-12"/></svg>'
  },
  {
    name: '数据/中心',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="16" rx="20" ry="8" fill="currentColor" opacity=".14"/><ellipse cx="32" cy="16" rx="20" ry="8"/><path d="M12 16v16c0 4.4 9 8 20 8s20-3.6 20-8V16"/><path d="M12 32v16c0 4.4 9 8 20 8s20-3.6 20-8V32"/></svg>'
  },
  {
    name: '通知/公告',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 38h10l24 11V15L23 26H13z" fill="currentColor" opacity=".14"/><path d="M13 38h10l24 11V15L23 26H13z"/><path d="M23 38l4 14H17l-3-14"/><path d="M53 27c3 3.2 3 8.2 0 11.4"/></svg>'
  },
  {
    name: '会议/日历',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="14" width="42" height="42" rx="5" fill="currentColor" opacity=".12"/><rect x="11" y="14" width="42" height="42" rx="5"/><path d="M21 8v12M43 8v12M11 26h42"/><path d="M22 36h6M36 36h6M22 46h6M36 46h6"/></svg>'
  },
  {
    name: '实验/科学',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M26 10h12M29 10v17L14 52a5 5 0 0 0 4.3 7h27.4A5 5 0 0 0 50 52L35 27V10"/><path d="M22 42h20"/><path d="M26 50h12" fill="currentColor" opacity=".14"/></svg>'
  },
  {
    name: '后勤/建筑',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 54V16h20v38M33 28h18v26" fill="currentColor" opacity=".12"/><path d="M13 54V16h20v38M33 28h18v26M8 54h48"/><path d="M20 24h6M20 34h6M20 44h6M40 37h5M40 46h5"/></svg>'
  },
  {
    name: '档案/文件夹',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="18" width="40" height="34" rx="4" fill="currentColor" opacity=".12"/><rect x="12" y="18" width="40" height="34" rx="4"/><path d="M18 18v-6h28v6"/><path d="M24 35h16"/></svg>'
  },
  {
    name: '信息/地球',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="23" fill="currentColor" opacity=".10"/><circle cx="32" cy="32" r="23"/><path d="M9 32h46M32 9c7 6.5 10.5 14.1 10.5 23S39 48.5 32 55M32 9c-7 6.5-10.5 14.1-10.5 23S25 48.5 32 55"/></svg>'
  },
  {
    name: '设置/齿轮',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="8" fill="currentColor" opacity=".12"/><path d="M32 10v8M32 46v8M10 32h8M46 32h8M16.4 16.4l5.6 5.6M42 42l5.6 5.6M16.4 47.6l5.6-5.6M42 22l5.6-5.6"/><circle cx="32" cy="32" r="8"/></svg>'
  },
  {
    name: '安全/盾牌',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8l22 10v20c0 12.7-8.7 17.3-22 22-13.3-4.7-22-9.3-22-22V18z" fill="currentColor" opacity=".12"/><path d="M32 8l22 10v20c0 12.7-8.7 17.3-22 22-13.3-4.7-22-9.3-22-22V18z"/><path d="M24 32l6 6 10-12"/></svg>'
  },
  {
    name: '搜索/查找',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="28" r="16" fill="currentColor" opacity=".10"/><circle cx="28" cy="28" r="16"/><path d="M40 40l12 12"/></svg>'
  },
  {
    name: '邮件/消息',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="16" width="44" height="32" rx="4" fill="currentColor" opacity=".10"/><rect x="10" y="16" width="44" height="32" rx="4"/><path d="M10 20l22 16 22-16"/></svg>'
  },
  {
    name: '链接/外链',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M24 40H18a12 12 0 0 1 0-24h6M40 24h6a12 12 0 0 1 0 24h-6"/><path d="M22 32h20"/></svg>'
  },
  {
    name: '下载/导入',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M32 10v34M20 32l12 12 12-12"/><path d="M10 48v6a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4v-6"/></svg>'
  },
  {
    name: '图表/统计',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="34" width="10" height="18" rx="2" fill="currentColor" opacity=".12"/><rect x="27" y="22" width="10" height="30" rx="2" fill="currentColor" opacity=".12"/><rect x="44" y="10" width="10" height="42" rx="2" fill="currentColor" opacity=".12"/><rect x="10" y="34" width="10" height="18" rx="2"/><rect x="27" y="22" width="10" height="30" rx="2"/><rect x="44" y="10" width="10" height="42" rx="2"/></svg>'
  },
  {
    name: '时钟/时间',
    svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="24" fill="currentColor" opacity=".08"/><circle cx="32" cy="32" r="24"/><path d="M32 18v14l10 6"/></svg>'
  }
];

// ==================== 公开路由 ====================

// 落地页
app.get('/', (req, res) => {
  const db = getDb();
  const cards = db.prepare('SELECT * FROM cards ORDER BY sort_order ASC, id ASC').all();
  res.render('index', { cards });
});

// 登录页
app.get('/admin/login', redirectIfAuthed, (req, res) => {
  res.render('admin/login', { error: req.query.error });
});

// 登录提交
app.post('/admin/login', redirectIfAuthed, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect('/admin/login?error=请输入账号和密码');
  }
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.redirect('/admin/login?error=账号或密码错误');
  }
  req.session.user = { id: user.id, username: user.username };
  const returnTo = req.session.returnTo || '/admin';
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// 退出
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ==================== 受保护路由 ====================

// 管理后台首页
app.get('/admin', requireAuth, (req, res) => {
  const db = getDb();
  const cardCount = db.prepare('SELECT COUNT(*) AS cnt FROM cards').get().cnt;
  res.render('admin/dashboard', { cardCount });
});

// 网站设置
app.get('/admin/settings', requireAuth, (req, res) => {
  res.render('admin/settings', { success: req.query.success });
});

app.post('/admin/settings', requireAuth, (req, res) => {
  const { site_title, site_subtitle } = req.body;
  const db = getDb();
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  upsert.run('site_title', site_title || '');
  upsert.run('site_subtitle', site_subtitle || '');
  res.redirect('/admin/settings?success=1');
});

// 卡片管理
app.get('/admin/cards', requireAuth, (req, res) => {
  const db = getDb();
  const cards = db.prepare('SELECT * FROM cards ORDER BY sort_order ASC, id ASC').all();
  const editingCard = req.query.edit ? db.prepare('SELECT * FROM cards WHERE id = ?').get(req.query.edit) : null;
  res.render('admin/cards', { cards, editingCard, iconPresets, success: req.query.success, error: req.query.error });
});

app.post('/admin/cards', requireAuth, (req, res) => {
  const { title, icon_svg, icon_color, link_url, sort_order } = req.body;
  const db = getDb();
  if (!title || !title.trim()) {
    return res.redirect('/admin/cards?error=卡片名称不能为空');
  }
  db.prepare(
    'INSERT INTO cards (title, icon_svg, icon_color, link_url, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(title.trim(), icon_svg || '', icon_color || 'blue', link_url || '#', parseInt(sort_order) || 0);
  res.redirect('/admin/cards?success=1');
});

app.post('/admin/cards/:id/delete', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  res.redirect('/admin/cards?success=1');
});

app.post('/admin/cards/:id/update', requireAuth, (req, res) => {
  const { title, icon_svg, icon_color, link_url, sort_order } = req.body;
  const db = getDb();
  if (!title || !title.trim()) {
    return res.redirect('/admin/cards?error=卡片名称不能为空');
  }
  db.prepare(
    'UPDATE cards SET title = ?, icon_svg = ?, icon_color = ?, link_url = ?, sort_order = ? WHERE id = ?'
  ).run(title.trim(), icon_svg || '', icon_color || 'blue', link_url || '#', parseInt(sort_order) || 0, req.params.id);
  res.redirect('/admin/cards?success=1');
});

// 启动
app.listen(PORT, () => {
  console.log(`\n  部门综合服务平台已启动: http://localhost:${PORT}`);
  console.log(`  管理后台: http://localhost:${PORT}/admin`);
  console.log(`  默认账号: admin / admin123\n`);
});
