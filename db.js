const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data', 'portal.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initSchema();
    seedData();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      icon_svg TEXT NOT NULL DEFAULT '',
      icon_color TEXT NOT NULL DEFAULT 'blue',
      link_url TEXT NOT NULL DEFAULT '#',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
}

function seedData() {
  // 默认管理员
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingUser) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  }

  // 默认设置
  const existingSettings = db.prepare('SELECT key FROM settings').all();
  const settingKeys = existingSettings.map(s => s.key);
  const defaults = [
    ['site_title', '部门综合服务平台'],
    ['site_subtitle', '统一业务导航平台']
  ];
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of defaults) {
    insertSetting.run(k, v);
  }

  // 预置卡片
  const cardCount = db.prepare('SELECT COUNT(*) AS cnt FROM cards').get().cnt;
  if (cardCount === 0) {
    const insertCard = db.prepare(
      'INSERT INTO cards (title, icon_svg, icon_color, link_url, sort_order) VALUES (?, ?, ?, ?, ?)'
    );

    const defaultCards = [
      {
        title: '办公系统',
        color: 'blue',
        sort: 1,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 19h19l5 7h24v27H8z" fill="currentColor" opacity=".14"/><path d="M8 19h19l5 7h24v27H8z"/><path d="M8 19v-5h17l5 5"/></svg>'
      },
      {
        title: '教务系统',
        color: 'teal',
        sort: 2,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 23l24-11 24 11-24 11z" fill="currentColor" opacity=".16"/><path d="M8 23l24-11 24 11-24 11z"/><path d="M17 29v11l15 7 15-7V29"/><path d="M56 23v18"/></svg>'
      },
      {
        title: '人事系统',
        color: 'purple',
        sort: 3,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="10" fill="currentColor" opacity=".16"/><circle cx="32" cy="20" r="10"/><path d="M14 54c2.8-12.8 12.3-18 18-18s15.2 5.2 18 18"/><path d="M29 37l3 5 3-5M32 42v9"/></svg>'
      },
      {
        title: '财务系统',
        color: 'orange',
        sort: 4,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 22h38a6 6 0 0 1 6 6v20H13a6 6 0 0 1-6-6V18a5 5 0 0 0 6 4z" fill="currentColor" opacity=".15"/><path d="M7 18a5 5 0 0 0 6 4h38a6 6 0 0 1 6 6v20H13a6 6 0 0 1-6-6z"/><path d="M41 16l11-5 3 11"/><path d="M39 35h14"/><path d="M46 29v12M42 29l4 5 4-5"/></svg>'
      },
      {
        title: '资产管理',
        color: 'blue',
        sort: 5,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8l22 12-22 12L10 20z" fill="currentColor" opacity=".14"/><path d="M32 8l22 12-22 12L10 20z"/><path d="M10 32l22 12 22-12"/><path d="M10 44l22 12 22-12"/></svg>'
      },
      {
        title: '数据中心',
        color: 'blue',
        sort: 6,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="16" rx="20" ry="8" fill="currentColor" opacity=".14"/><ellipse cx="32" cy="16" rx="20" ry="8"/><path d="M12 16v16c0 4.4 9 8 20 8s20-3.6 20-8V16"/><path d="M12 32v16c0 4.4 9 8 20 8s20-3.6 20-8V32"/></svg>'
      },
      {
        title: '通知公告',
        color: 'red',
        sort: 7,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 38h10l24 11V15L23 26H13z" fill="currentColor" opacity=".14"/><path d="M13 38h10l24 11V15L23 26H13z"/><path d="M23 38l4 14H17l-3-14"/><path d="M53 27c3 3.2 3 8.2 0 11.4"/></svg>'
      },
      {
        title: '会议预约',
        color: 'blue',
        sort: 8,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="14" width="42" height="42" rx="5" fill="currentColor" opacity=".12"/><rect x="11" y="14" width="42" height="42" rx="5"/><path d="M21 8v12M43 8v12M11 26h42"/><path d="M22 36h6M36 36h6M22 46h6M36 46h6"/></svg>'
      },
      {
        title: '实验室平台',
        color: 'teal',
        sort: 9,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M26 10h12M29 10v17L14 52a5 5 0 0 0 4.3 7h27.4A5 5 0 0 0 50 52L35 27V10"/><path d="M22 42h20"/><path d="M26 50h12" fill="currentColor" opacity=".14"/></svg>'
      },
      {
        title: '后勤服务',
        color: 'orange',
        sort: 10,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M13 54V16h20v38M33 28h18v26" fill="currentColor" opacity=".12"/><path d="M13 54V16h20v38M33 28h18v26M8 54h48"/><path d="M20 24h6M20 34h6M20 44h6M40 37h5M40 46h5"/></svg>'
      },
      {
        title: '档案管理',
        color: 'blue',
        sort: 11,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="18" width="40" height="34" rx="4" fill="currentColor" opacity=".12"/><rect x="12" y="18" width="40" height="34" rx="4"/><path d="M18 18v-6h28v6"/><path d="M24 35h16"/></svg>'
      },
      {
        title: '信息门户',
        color: 'purple',
        sort: 12,
        svg: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="23" fill="currentColor" opacity=".10"/><circle cx="32" cy="32" r="23"/><path d="M9 32h46M32 9c7 6.5 10.5 14.1 10.5 23S39 48.5 32 55M32 9c-7 6.5-10.5 14.1-10.5 23S25 48.5 32 55"/></svg>'
      }
    ];

    const insertMany = db.transaction((cards) => {
      for (const c of cards) {
        insertCard.run(c.title, c.svg, c.color, '#', c.sort);
      }
    });

    insertMany(defaultCards);
  }
}

module.exports = { getDb };
