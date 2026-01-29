"use client";
import React, { useState, useEffect, useMemo } from 'react';

// --- 🎨 V24 样式升级：容器化布局 (大框套万物) ---
const CSS_STYLES = `
  /* 全局容器 */
  .app-container { 
    display: flex; height: 100vh; width: 100vw; overflow: hidden; 
    background-color: #121212; color: #e0e0e0; 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  /* 侧边栏 (动态宽度) */
  .sidebar { 
    height: 100%; flex-shrink: 0; background-color: #181818; 
    border-right: 1px solid #333; display: flex; flex-direction: column; 
    padding: 20px 10px; z-index: 20; 
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; 
  }
  
  .sidebar-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 30px; padding-left: 6px; padding-right: 2px; height: 30px;
  }

  .app-title { font-size: 1.1rem; font-weight: 800; color: #fff; white-space: nowrap; opacity: 1; transition: opacity 0.2s; }
  
  .nav-item { 
    padding: 10px 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; color: #aaa; 
    transition: all 0.2s; display: flex; align-items: center; gap: 12px; font-size: 0.95rem; white-space: nowrap; overflow: hidden;
  }
  .nav-item:hover { background-color: rgba(255,255,255,0.05); color: #fff; }
  .nav-item.active { background-color: rgba(55, 0, 179, 0.2); color: #bb86fc; font-weight: 600; }
  .nav-icon { font-size: 1.2rem; min-width: 24px; text-align: center; }

  .toggle-btn {
    background: transparent; border: none; color: #666; cursor: pointer;
    padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;
  }
  .toggle-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }

  /* 主内容区 */
  .main-content { flex: 1; height: 100%; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .page-view { width: 100%; height: 100%; display: flex; flex-direction: column; }
  
  /* 滚动区域 */
  .page-view.scrollable { 
    overflow-y: auto; 
    padding: 30px; /* 外部留白 */
  } 

  /* 🌟 V24 核心：大容器外框 (Big Container) */
  .main-container-frame {
    /* 核心样式：给所有内容加个框 */
    background-color: #1a1a1a; 
    border: 1px solid #333; 
    border-radius: 16px; 
    
    /* 布局约束：左右留白，最大宽度限制 */
    margin: 0 auto; /* 居中 */
    max-width: 1800px; /* 防止在大屏幕上拉太长 */
    padding: 30px; /* 大框内部的留白 */
    
    /* 视觉效果 */
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }

  /* 头部标题区 (在大框内) */
  .frame-header {
    display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end;
    margin-bottom: 24px; border-bottom: 1px solid #333; padding-bottom: 20px;
  }

  /* 筛选器样式微调 */
  .filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
  .search-input { background:#252525; border:1px solid #444; color:#fff; padding:8px 12px; border-radius:6px; min-width: 200px; }
  .category-select { background:#252525; border:1px solid #444; color:#fff; padding:8px 12px; border-radius:6px; }
  .filter-btn { background:#252525; border:1px solid #444; color:#aaa; padding:8px 16px; border-radius:6px; cursor: pointer; }
  .filter-btn.active { background: rgba(55, 0, 179, 0.2); color: #bb86fc; border-color: #bb86fc; }

  /* 网格布局 */
  .grid-wrapper { 
    display: grid; 
    /* 保持 V22 的宽卡片设定 */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 25px; 
  }
  
  /* Iframe 容器 */
  .iframe-container { width: 100%; height: 100%; border: none; flex: 1; display: block; }
  
  /* 顶部工具栏 */
  .toolbar-container { width: 100%; background-color: #1e1e1e; border-bottom: 1px solid #333; display: flex; justify-content: center; flex-shrink: 0; }
  .toolbar-inner { height: 60px; width: 100%; max-width: 1400px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
  .toolbar-title { font-weight: 600; font-size: 1.1rem; color: #fff; display: flex; align-items: center; gap: 10px; }
  .toolbar-actions { display: flex; gap: 12px; }

  .action-btn {
    background: rgba(255, 255, 255, 0.08); color: #ccc; padding: 8px 16px; border-radius: 8px;
    text-decoration: none; font-size: 0.9rem; font-weight: 500; border: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
  }
  .action-btn:hover { background: rgba(255, 255, 255, 0.15); color: #fff; transform: translateY(-1px); }
  .action-btn.primary { background: rgba(55, 0, 179, 0.6); color: #fff; border: 1px solid rgba(55, 0, 179, 0.8); }
  .action-btn.primary:hover { background: rgba(55, 0, 179, 0.9); }

  /* 卡片样式 */
  .card {
    background-color: #252525; /* 稍微亮一点，区别于大框背景 */
    border: 1px solid #3a3a3a; border-radius: 8px; padding: 16px;
    position: relative; display: flex; align-items: flex-start; gap: 12px;
    transition: all 0.2s; text-decoration: none; overflow: hidden;
  }
  .card:hover { transform: translateY(-3px); border-color: #666; background-color: #2a2a2a; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
  .card-indicator { position: absolute; top: 0; left: 0; bottom: 0; width: 4px; }
  
  /* 头像 */
  .char-avatar { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #bb86fc 0%, #3700b3 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0; }
  
  /* FAB 按钮 */
  .fab-btn {
    position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px; border-radius: 50%;
    background-color: #bb86fc; color: #000; font-size: 30px; border: none; cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .fab-btn:hover { background-color: #a370f7; transform: scale(1.05); }
  
  .icon-btn { background: transparent; border: none; color: #666; cursor: pointer; padding: 4px; border-radius: 4px; }
  .icon-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
  .icon-btn.pinned { color: #bb86fc; }
  .icon-btn.delete:hover { color: #cf6679; background: rgba(207,102,121,0.1); }
  .card-actions { margin-left: auto; display: flex; flex-direction: column; gap: 4px; opacity: 0; transition: opacity 0.2s; }
  .card:hover .card-actions { opacity: 1; }

  /* 弹窗 */
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 200; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
  .modal-content { padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  .btn-confirm { background: #bb86fc; color: #000; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; }
`;

// --- 类型定义 ---
type Resource = {
  id: number;
  name: string;
  url: string;
  category: string; 
  priority: string; 
  source: string;   
  isPinned: boolean;
  tags: {
    type: string;        
    reliability: string; 
    timeliness: string;  
  };
};

// --- 📋 预设数据常量 ---
const PREDEFINED_CATEGORIES = [
  "社科领域—政治新闻类", "社科领域—金融经济类", "社科领域—时事评论类", 
  "社科领域—法律知识类", "行业领域—商业机会类", "行业领域—AI科技类", 
  "行业领域—跨境电商类", "行业领域—时尚热点类", "技能领域—个人思考类", 
  "技能领域—资产投资类", "其他领域信息类"
];

const PREDEFINED_SOURCES = [
  "公众号", "新闻", "专业网站", "Twitter/X", "Newsletter", "知乎专栏", "Bilibili"
];

const PREDEFINED_TYPES = [
  "讯息类", "Insight思考", "领域信息分析", "时评类", "信息知识类", "分析", "知识"
];

// --- 🌟 核心数据初始化 ---
const DEFAULT_RESOURCES: Resource[] = [
  { id: 1, name: "环球时报", category: "社科领域—政治新闻类", priority: "高", source: "新闻", url: "https://www.google.com/search?q=环球时报", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 2, name: "联合早报", category: "社科领域—政治新闻类", priority: "高", source: "新闻", url: "https://www.google.com/search?q=联合早报", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 3, name: "路透社", category: "社科领域—政治新闻类", priority: "高", source: "新闻", url: "https://www.google.com/search?q=路透社", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 6, name: "美联社", category: "社科领域—政治新闻类", priority: "高", source: "新闻", url: "https://www.google.com/search?q=美联社", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 21, name: "纯科学", category: "社科领域—政治新闻类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "时评类", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 23, name: "秦小明", category: "社科领域—政治新闻类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 24, name: "tuzhuxi", category: "社科领域—政治新闻类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 25, name: "财联社", category: "社科领域—金融经济类", priority: "高", source: "新闻", url: "https://www.cls.cn/", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 26, name: "彭博新闻社", category: "社科领域—金融经济类", priority: "高", source: "新闻", url: "https://www.bloomberg.com/", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 38, name: "凤凰WEEKLY财经", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 39, name: "付鹏的财经世界", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 41, name: "郭磊宏观茶座", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 42, name: "经纬创投", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 44, name: "纪源资本", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 49, name: "覃汉研究笔记", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 50, name: "清河三思", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 52, name: "声鸣海外 Global", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 57, name: "一瑜中的", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 62, name: "中金点睛", category: "社科领域—金融经济类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 66, name: "拆哪儿", category: "社科领域—时事评论类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 69, name: "饭统戴老板", category: "社科领域—时事评论类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 70, name: "雷峰网", category: "社科领域—时事评论类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 72, name: "中国裁判文书", category: "社科领域—法律知识类", priority: "高", source: "专业网站", url: "https://wenshu.court.gov.cn/", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "低及时性" } },
  { id: 74, name: "今日热卖", category: "行业领域—商业机会类", priority: "高", source: "新闻", url: "https://www.google.com/search?q=今日热卖", isPinned: false, tags: { type: "讯息类", reliability: "非可靠信息类", timeliness: "高及时性" } },
  { id: 76, name: "笔记侠", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 79, name: "创业邦", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 80, name: "大碗楼市", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "信息知识类", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 86, name: "格总在人间", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 92, name: "MsQ星球", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 94, name: "秋水笔弹", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 96, name: "瑞恩资本RyanbenCapital", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 101, name: "晚点财经", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 102, name: "晚点LatePost", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 103, name: "WBusiness商业", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 104, name: "卫夕指北", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 106, name: "银杏科技", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 107, name: "铱星云商", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 108, name: "有数DataVision", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 109, name: "远川研究所", category: "行业领域—商业机会类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 110, name: "36氪", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "https://36kr.com/", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 112, name: "饼干哥哥AGI", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "中及时性" } },
  { id: 113, name: "硅发布", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "讯息类", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 118, name: "极客公园", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "讯息类", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 120, name: "量子连线", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 125, name: "少数派", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 126, name: "数字生命卡兹克", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 127, name: "讨厌我的人多了", category: "行业领域—AI科技类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 132, name: "雨果跨境", category: "行业领域—跨境电商类", priority: "高", source: "专业网站", url: "https://www.google.com/search?q=雨果跨境", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 133, name: "蓝海亿观网", category: "行业领域—跨境电商类", priority: "高", source: "专业网站", url: "https://www.google.com/search?q=蓝海亿观网", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "高及时性" } },
  { id: 138, name: "36氪出海", category: "行业领域—跨境电商类", priority: "高", source: "专业网站", url: "https://www.google.com/search?q=36氪出海", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "中及时性" } },
  { id: 148, name: "白鲸出海", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "可靠信息类", timeliness: "低及时性" } },
  { id: 149, name: "非线形Doris", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 151, name: "鲸犀", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 156, name: "Metabrandl", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 157, name: "圣总聊出海", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 161, name: "远川出海研究", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 163, name: "7点5度", category: "行业领域—跨境电商类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 164, name: "知微事见", category: "行业领域—时尚热点类", priority: "高", source: "专业网站", url: "https://www.google.com/search?q=知微事见", isPinned: false, tags: { type: "讯息类", reliability: "可靠信息类", timeliness: "中及时性" } },
  { id: 168, name: "刀法研究所", category: "行业领域—时尚热点类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 173, name: "娱乐资本论", category: "行业领域—时尚热点类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 174, name: "崔丁读毛选", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 176, name: "渡卡洪塔斯", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 177, name: "二当家李多余", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 179, name: "记忆承载3", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 180, name: "梁宁-闲花照水录", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 181, name: "琉璃创造", category: "技能领域—个人思考类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 184, name: "聪明投资者", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 188, name: "调研纪要", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 190, name: "方伟看十年", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 191, name: "公子豹投资圈", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 192, name: "很帅的投资客", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 193, name: "环球市场随笔", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 194, name: "家哥的小黑屋", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 195, name: "见微知著杂谈", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 197, name: "蓝迪兹Randiz", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "中及时性" } },
  { id: 198, name: "老韭菜生存日记", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 199, name: "梁狗蛋", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 202, name: "NE0", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 203, name: "培风客", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 207, name: "塔子哥的随笔", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 209, name: "约瑟聊股", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 210, name: "也谈钱", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "Insight思考", reliability: "非可靠信息类", timeliness: "低及时性" } },
  { id: 211, name: "乐世间", category: "技能领域—资产投资类", priority: "高", source: "公众号", url: "", isPinned: false, tags: { type: "领域信息分析", reliability: "非可靠信息类", timeliness: "低及时性" } },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'channels' | 'hotspots' | 'hot_baiwu'>('channels');
  const [resources, setResources] = useState<Resource[]>(DEFAULT_RESOURCES);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasUrl, setHasUrl] = useState(false); 
  const [iframeKey, setIframeKey] = useState(0);

  const [newRes, setNewRes] = useState({
    name: '', url: '', category: PREDEFINED_CATEGORIES[0], priority: '中',
    source: '公众号', type: '讯息类', reliability: '可靠信息类', timeliness: '高及时性'
  });

  useEffect(() => {
    const saved = localStorage.getItem('asterism_data_v24'); 
    if (saved) {
      setResources(JSON.parse(saved));
    } else {
      localStorage.setItem('asterism_data_v24', JSON.stringify(DEFAULT_RESOURCES));
      setResources(DEFAULT_RESOURCES);
    }
  }, []);

  const saveResources = (newResources: Resource[]) => {
    setResources(newResources);
    localStorage.setItem('asterism_data_v24', JSON.stringify(newResources));
  };

  const categories = useMemo(() => {
    const cats = new Set(resources.map(r => r.category));
    PREDEFINED_CATEGORIES.forEach(c => cats.add(c));
    return ['all', ...Array.from(cats)];
  }, [resources]);

  const togglePin = (id: number, e: React.MouseEvent) => {
    e.preventDefault(); 
    const updated = resources.map(r => r.id === id ? { ...r, isPinned: !r.isPinned } : r);
    saveResources(updated);
  };

  const deleteResource = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('确定要删除这个渠道吗？')) {
      const updated = resources.filter(r => r.id !== id);
      saveResources(updated);
    }
  };

  const refreshIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleAdd = () => {
    if (!newRes.name) return alert('请填写名称');
    if (!newRes.category) return alert('请填写或选择所属领域');
    const finalUrl = hasUrl ? (newRes.url.startsWith('http') ? newRes.url : `https://${newRes.url}`) : '';
    const newItem: Resource = {
      id: Date.now(),
      name: newRes.name,
      url: finalUrl,
      category: newRes.category,
      priority: newRes.priority,
      source: newRes.source,
      isPinned: false,
      tags: { type: newRes.type, reliability: newRes.reliability, timeliness: newRes.timeliness }
    };
    saveResources([...resources, newItem]);
    setShowModal(false);
    setNewRes({ ...newRes, name: '', url: '' });
  };

  useEffect(() => {
    if (showModal) {
      const noUrlSources = ['公众号', '微信', 'Twitter', 'X'];
      const shouldHaveUrl = !noUrlSources.some(s => newRes.source.includes(s));
      setHasUrl(shouldHaveUrl);
    }
  }, [newRes.source, showModal]);

  const getIcon = (url: string) => {
    try {
      if (!url) return '';
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch { return ''; }
  };

  const filteredResources = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchText.toLowerCase()) || 
                        r.category.toLowerCase().includes(searchText.toLowerCase());
    const matchPriority = filterPriority === 'all' || r.priority === filterPriority;
    const matchCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchSearch && matchPriority && matchCategory;
  });

  const pinnedItems = filteredResources.filter(r => r.isPinned);
  const normalItems = filteredResources.filter(r => !r.isPinned);

  const getBorderColor = (p: string) => {
    if (p === '高') return '#cf6679';
    if (p === '中') return '#03dac6';
    return '#3700b3';
  };

  return (
    <div className="app-container">
      {/* 🚀 安全注入 CSS */}
      <style dangerouslySetInnerHTML={{ __html: CSS_STYLES }} />

      {/* 侧边栏 (支持折叠) */}
      <aside className="sidebar" style={{ width: isSidebarCollapsed ? '60px' : '200px' }}>
        <div className="sidebar-header" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'space-between', paddingLeft: isSidebarCollapsed ? 0 : '6px' }}>
          {!isSidebarCollapsed && <div className="app-title" style={{margin:0}}>✨ 星群</div>}
          <button className="toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} title={isSidebarCollapsed ? "展开" : "收起"}>
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>
        <div className={`nav-item ${activeTab === 'channels' ? 'active' : ''}`} onClick={() => setActiveTab('channels')} title="情报渠道" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <span className="nav-icon">📡</span>{!isSidebarCollapsed && <span>情报渠道</span>}
        </div>
        <div className={`nav-item ${activeTab === 'hotspots' ? 'active' : ''}`} onClick={() => setActiveTab('hotspots')} title="NewsNow" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <span className="nav-icon">🔥</span>{!isSidebarCollapsed && <span>NewsNow</span>}
        </div>
        <div className={`nav-item ${activeTab === 'hot_baiwu' ? 'active' : ''}`} onClick={() => setActiveTab('hot_baiwu')} title="今日热榜" style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <span className="nav-icon">🚀</span>{!isSidebarCollapsed && <span>今日热榜</span>}
        </div>
      </aside>

      {/* 主界面 */}
      <main className="main-content">
        
        {/* === 页面 1: 渠道管理 (🌟 V24 容器版) === */}
        <div className={`page-view scrollable ${activeTab === 'channels' ? 'active' : 'hidden'}`} style={{display: activeTab === 'channels' ? 'block' : 'none'}}>
          
          {/* 🌟 V24: 整个列表内容被包在 .main-container-frame 里 */}
          <div className="main-container-frame">
            
            {/* 1. 顶部标题与筛选 (移到框内) */}
            <div className="frame-header">
              <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'600', color:'#fff'}}>信息源监控</h2>
              <div className="filter-bar">
                <select className="category-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">🌐 所有领域</option>
                  {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{display:'flex', gap:'5px'}}>
                  {['all', '高', '中', '低'].map(p => (
                    <button key={p} className={`filter-btn ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>{p === 'all' ? '全部' : p}</button>
                  ))}
                </div>
                <input type="text" className="search-input" placeholder="搜索..." value={searchText} onChange={e => setSearchText(e.target.value)} />
              </div>
            </div>

            {/* 2. 网格内容 */}
            <div className="grid-wrapper">
              {pinnedItems.length > 0 && (
                <>
                  <div className="pinned-divider" style={{gridColumn:'1/-1', fontSize:'0.9rem', color:'#888', marginBottom:'10px', borderBottom:'1px solid #333', paddingBottom:'5px'}}>📌 置顶关注 (High Priority)</div>
                  {pinnedItems.map(item => <Card key={item.id} item={item} />)}
                  {normalItems.length > 0 && <div className="pinned-divider" style={{gridColumn:'1/-1', fontSize:'0.9rem', color:'#888', marginTop:'20px', marginBottom:'10px', borderBottom:'1px solid #333', paddingBottom:'5px'}}>📑 所有列表</div>}
                </>
              )}
              {normalItems.map(item => <Card key={item.id} item={item} />)}
            </div>
          </div>

          <button className="fab-btn" onClick={() => setShowModal(true)}>+</button>
        </div>

        {/* ... 其他页面保持 V22 逻辑不变 ... */}
        <div className={`page-view ${activeTab === 'hotspots' ? 'active' : 'hidden'}`} style={{display: activeTab === 'hotspots' ? 'flex' : 'none'}}>
          <div className="toolbar-container">
            <div className="toolbar-inner">
              <div className="toolbar-title"><span>🔥</span> NewsNow 热点</div>
              <div className="toolbar-actions">
                <a href="https://newsnow.busiyi.world/" target="_blank" className="action-btn primary">🚀 官网全屏</a>
                <button className="action-btn" onClick={refreshIframe}>🔄 刷新本页</button>
              </div>
            </div>
          </div>
          <iframe key={`newsnow-${iframeKey}`} src="https://newsnow-navy-gamma.vercel.app/" className="iframe-container" title="NewsNow" />
        </div>

        <div className={`page-view ${activeTab === 'hot_baiwu' ? 'active' : 'hidden'}`} style={{display: activeTab === 'hot_baiwu' ? 'flex' : 'none'}}>
          <div className="toolbar-container">
            <div className="toolbar-inner">
              <div className="toolbar-title"><span>🚀</span> 今日热榜</div>
              <div className="toolbar-actions">
                <a href="https://hot.baiwumm.com/" target="_blank" className="action-btn primary">🚀 官网全屏</a>
                <button className="action-btn" onClick={refreshIframe}>🔄 刷新本页</button>
              </div>
            </div>
          </div>
          <iframe key={`baiwu-${iframeKey}`} src="https://hot.baiwumm.com/" className="iframe-container" title="Hot Baiwu" />
        </div>

      </main>

      {/* ... 弹窗代码保持 V22 ... */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => {if(e.target === e.currentTarget) setShowModal(false)}}>
          <div className="modal-content" style={{width: '550px', background:'#252525', border:'1px solid #444'}}>
            <h3 style={{marginTop:0, marginBottom:20, color:'#fff'}}>添加新情报源</h3>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'15px'}}>
              <div className="form-item">
                <label style={{color:'#aaa'}}>渠道名称</label>
                <input className="form-input" value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} placeholder="例如：纯科学" style={{background:'#333', border:'none', color:'#fff'}} />
              </div>
              <div className="form-item">
                <label style={{color:'#aaa'}}>优先级</label>
                <select className="form-input" value={newRes.priority} onChange={e => setNewRes({...newRes, priority: e.target.value})} style={{background:'#333', border:'none', color:'#fff'}}>
                  <option value="高">高</option><option value="中">中</option><option value="低">低</option>
                </select>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginTop:'15px'}}>
               <div className="form-item">
                <label style={{color:'#aaa'}}>所属领域</label>
                <input className="form-input" list="category-options" value={newRes.category} onChange={e => setNewRes({...newRes, category: e.target.value})} placeholder="选择或输入..." style={{background:'#333', border:'none', color:'#fff'}} />
                <datalist id="category-options">{PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat} />)}</datalist>
              </div>
              <div className="form-item">
                <label style={{color:'#aaa', display:'flex', justifyContent:'space-between'}}>
                  <span>来源方式</span>
                  <span style={{fontSize:'0.8rem', display:'flex', alignItems:'center'}}>
                    <input type="checkbox" checked={hasUrl} onChange={e => setHasUrl(e.target.checked)} style={{marginRight:4}} />链接?
                  </span>
                </label>
                <input className="form-input" list="source-options" value={newRes.source} onChange={e => setNewRes({...newRes, source: e.target.value})} placeholder="例如：Twitter" style={{background:'#333', border:'none', color:'#fff'}} />
                <datalist id="source-options">{PREDEFINED_SOURCES.map(src => <option key={src} value={src} />)}</datalist>
              </div>
            </div>
            {hasUrl && <div className="form-item" style={{marginTop:'15px'}}><label style={{color:'#aaa'}}>链接 URL</label><input className="form-input" value={newRes.url} onChange={e => setNewRes({...newRes, url: e.target.value})} placeholder="https://..." style={{background:'#333', border:'none', color:'#fff'}} /></div>}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'15px'}}>
              <div className="form-item"><label style={{color:'#aaa'}}>类型</label><input className="form-input" list="type-options" value={newRes.type} onChange={e => setNewRes({...newRes, type: e.target.value})} style={{background:'#333', border:'none', color:'#fff'}} /><datalist id="type-options">{PREDEFINED_TYPES.map(t => <option key={t} value={t} />)}</datalist></div>
              <div className="form-item"><label style={{color:'#aaa'}}>可靠性</label><select className="form-input" value={newRes.reliability} onChange={e => setNewRes({...newRes, reliability: e.target.value})} style={{background:'#333', border:'none', color:'#fff'}}><option value="可靠信息类">可靠</option><option value="非可靠信息类">非可靠</option></select></div>
              <div className="form-item"><label style={{color:'#aaa'}}>及时性</label><select className="form-input" value={newRes.timeliness} onChange={e => setNewRes({...newRes, timeliness: e.target.value})} style={{background:'#333', border:'none', color:'#fff'}}><option value="高及时性">高</option><option value="中及时性">中</option><option value="低及时性">低</option></select></div>
            </div>
            <div className="modal-btns" style={{marginTop:'25px'}}>
              <button className="btn-cancel" onClick={() => setShowModal(false)} style={{background:'transparent', color:'#aaa', border:'1px solid #555'}}>取消</button>
              <button className="btn-confirm" onClick={handleAdd}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function Card({ item }: { item: Resource }) {
    const useCharAvatar = !item.url || item.source.includes('公众号') || item.source.includes('Twitter');
    const firstChar = item.name.charAt(0);
    const getTagColor = (text: string) => { if(text.includes('高及时') || text.includes('可靠')) return 'rgba(3, 218, 198, 0.15)'; if(text.includes('低及时') || text.includes('非可靠')) return 'rgba(207, 102, 121, 0.15)'; return 'rgba(255, 255, 255, 0.1)'; };
    const getTagTextColor = (text: string) => { if(text.includes('高及时') || text.includes('可靠')) return '#03dac6'; if(text.includes('低及时') || text.includes('非可靠')) return '#cf6679'; return '#999'; };
    return (
      <a href={item.url || '#'} target={item.url ? "_blank" : "_self"} className="card" style={{cursor: item.url ? 'pointer' : 'default'}}>
        <div className="card-indicator" style={{backgroundColor: getBorderColor(item.priority)}}></div>
        {useCharAvatar ? <div className="char-avatar">{firstChar}</div> : <img src={getIcon(item.url)} style={{width:32, height:32, borderRadius:4, flexShrink:0}} alt="" />}
        <div className="card-content">
          <div style={{fontWeight:'bold', color:'#e0e0e0', marginBottom:'6px', fontSize:'0.95rem'}}>{item.name}</div>
          <span style={{fontSize:'0.7rem', color:'#bb86fc', background:'rgba(187,134,252,0.1)', padding:'2px 6px', borderRadius:'4px', marginRight:'6px'}}>{item.category.includes('—') ? item.category.split('—')[1] : item.category}</span>
          {item.tags && <div style={{display:'flex', gap:'4px', marginTop:'8px', flexWrap:'wrap'}}>{[item.tags.type, item.tags.reliability, item.tags.timeliness].map((tag, idx) => <span key={idx} style={{fontSize:'0.7rem', padding:'2px 6px', borderRadius:'4px', background: getTagColor(tag), color: getTagTextColor(tag)}}>{tag}</span>)}</div>}
        </div>
        <div className="card-actions">
          <button className={`icon-btn ${item.isPinned ? 'pinned' : ''}`} onClick={(e) => togglePin(item.id, e)}><svg width="16" height="16" viewBox="0 0 24 24" fill={item.isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></button>
          <button className="icon-btn delete" onClick={(e) => deleteResource(item.id, e)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
      </a>
    );
  }
}