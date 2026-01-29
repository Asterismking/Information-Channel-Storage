import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// 初始化解析器
const parser = new Parser();

export async function GET() {
  try {
    // 1. 定义我们要抓取的真实数据源 (这里以 36Kr 为例，它提供了公开的 RSS)
    // 你以后可以加更多，比如 少数派、知乎日报 等
    const feedUrl = 'https://36kr.com/feed';

    // 2. 开始抓取 (这一步是服务器去访问 36Kr，速度很快)
    const feed = await parser.parseURL(feedUrl);

    // 3. 清洗数据 (把复杂的 RSS 格式转换成我们页面需要的简单格式)
    // 我们只取前 10 条
    const cleanData = feed.items.slice(0, 10).map((item, index) => {
      // 计算发布时间 (例如: "10分钟前")
      const pubDate = new Date(item.pubDate || '');
      const timeDiff = Math.floor((Date.now() - pubDate.getTime()) / 60000); // 分钟差
      
      let timeString = '';
      if (timeDiff < 60) {
        timeString = `${timeDiff}分钟前`;
      } else if (timeDiff < 1440) {
        timeString = `${Math.floor(timeDiff / 60)}小时前`;
      } else {
        timeString = '1天前';
      }

      return {
        id: index + 1,
        tag: "36氪", // 因为源是 36Kr
        time: timeString,
        title: item.title,
        desc: item.contentSnippet || item.content || "点击查看详情...", // 摘要
        link: item.link // 新闻原文链接
      };
    });

    // 4. 返回清洗后的真数据
    return NextResponse.json({
      success: true,
      source: "36Kr RSS",
      data: cleanData
    });

  } catch (error) {
    console.error("抓取失败:", error);
    return NextResponse.json({
      success: false,
      message: "抓取数据失败，请检查网络或源地址",
      data: [] // 失败时返回空数组，防止页面崩坏
    });
  }
}