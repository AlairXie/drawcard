import type { Card } from '../types';

export const defaultCards: Card[] = [
  { id: 'S1', tier: 'S', title: '简历微调 1 句', instruction: '打开简历，只改进 1 句措辞。', expectedOutputHint: '贴出修改前后对比。' },
  { id: 'S2', tier: 'S', title: '收藏 1 题', instruction: '在题库新增 1 道题目标题。', expectedOutputHint: '记录题目链接或名称。' },
  { id: 'S3', tier: 'S', title: '复制 1 个问题', instruction: '把今天遇到的 1 个问题抄到问题清单。', expectedOutputHint: '写下问题原文。' },
  { id: 'S4', tier: 'S', title: '改 1 个标题', instruction: '把一个文档标题改得更明确。', expectedOutputHint: '提交新标题。' },
  { id: 'S5', tier: 'S', title: '补 1 个标签', instruction: '给一个学习笔记补上标签。', expectedOutputHint: '写出标签与对应笔记。' },
  { id: 'S6', tier: 'S', title: '写 1 行总结', instruction: '对今天最重要的事写 1 行总结。', expectedOutputHint: '提交这 1 行总结。' },
  { id: 'S7', tier: 'S', title: '清理 1 个待办', instruction: '删除或归档一个无效待办。', expectedOutputHint: '说明删除了什么。' },
  { id: 'S8', tier: 'S', title: '记录 1 个指标', instruction: '记录一个可以量化的求职/学习指标。', expectedOutputHint: '提交指标值。' },
  { id: 'S9', tier: 'S', title: '开文件即胜利', instruction: '打开目标项目文件并停留 3 分钟。', expectedOutputHint: '写下打开了哪个文件。' },
  { id: 'S10', tier: 'S', title: '改 1 个错别字', instruction: '任意文档修正 1 个错别字。', expectedOutputHint: '提交修正内容。' },

  { id: 'M1', tier: 'M', title: '写 5 行八股', instruction: '围绕一个面试点写 5 行要点。', expectedOutputHint: '贴出 5 行内容。' },
  { id: 'M2', tier: 'M', title: '题解复述 3 行', instruction: '把一道题解用自己的话写 3 行。', expectedOutputHint: '提交复述内容。' },
  { id: 'M3', tier: 'M', title: 'STAR 写 S/T', instruction: '针对一个项目写 STAR 中的 S/T。', expectedOutputHint: '提交 S/T 两段。' },
  { id: 'M4', tier: 'M', title: '整理 1 个知识点', instruction: '整理一个概念：定义+应用场景。', expectedOutputHint: '提交整理结果。' },
  { id: 'M5', tier: 'M', title: '写 1 段自我介绍', instruction: '产出 60-100 字自我介绍。', expectedOutputHint: '贴出这段文案。' },
  { id: 'M6', tier: 'M', title: '复盘 1 次卡点', instruction: '写出卡点、原因和下一步。', expectedOutputHint: '三行复盘。' },
  { id: 'M7', tier: 'M', title: '做 1 道小题', instruction: '完成一道简单算法题并记录思路。', expectedOutputHint: '答案或思路摘要。' },
  { id: 'M8', tier: 'M', title: '列 3 个亮点', instruction: '给某段经历提炼 3 个亮点。', expectedOutputHint: '亮点条目。' },
  { id: 'M9', tier: 'M', title: '改 1 段项目描述', instruction: '把一段项目描述改成结果导向。', expectedOutputHint: '新版描述。' },
  { id: 'M10', tier: 'M', title: '写 3 个追问', instruction: '为一个知识点写 3 个可能追问。', expectedOutputHint: '追问列表。' },
  { id: 'M11', tier: 'M', title: '补 1 段注释', instruction: '给关键代码补一段解释注释。', expectedOutputHint: '注释内容。' },
  { id: 'M12', tier: 'M', title: '拆 1 个任务', instruction: '把一个大任务拆成 3 个小步骤。', expectedOutputHint: '步骤清单。' },
  { id: 'M13', tier: 'M', title: '手写流程 5 行', instruction: '写出某流程的 5 行步骤。', expectedOutputHint: '流程文本。' },
  { id: 'M14', tier: 'M', title: '更新题库标签', instruction: '给 3 道题补充标签。', expectedOutputHint: '题目与标签。' },
  { id: 'M15', tier: 'M', title: '写 1 条行动承诺', instruction: '写一句“明天我会先做什么”。', expectedOutputHint: '承诺句子。' },

  { id: 'L1', tier: 'L', title: '简历量化指标', instruction: '给一条经历补上明确数字。', expectedOutputHint: '提交量化后的句子。' },
  { id: 'L2', tier: 'L', title: '录音 60 秒回答', instruction: '录一段 60 秒自我表达。', expectedOutputHint: '录音说明或链接。' },
  { id: 'L3', tier: 'L', title: '画 1 页架构草图', instruction: '手绘或电子画出一页架构图。', expectedOutputHint: '截图说明。' },
  { id: 'L4', tier: 'L', title: '写完整 STAR', instruction: '为一个项目写完整 STAR 四段。', expectedOutputHint: 'STAR 全文。' },
  { id: 'L5', tier: 'L', title: '完成 1 次模拟问答', instruction: '做一次 3 问 3 答模拟。', expectedOutputHint: '问答摘要。' }
];
