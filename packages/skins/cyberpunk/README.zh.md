# @linxin666/dsh-client-ui-skin-cyberpunk

[English](README.md) | 中文

dsh Web GUI 的热插拔赛博朋克夜城皮肤。

- 霓虹青（#00e5ff）/ 品红（#ff2d78）/ 电紫（#9d4edd）/ 霓虹黄（#ffd600）
  体系重映射到全部 dsh token（`--dsw-static-*`、`--dsw-alias-*`、
  `--dsw-specific-*`、`--aion-*`）。
- 纯 CSS 霓虹背景：透视网格 + 青/品红光晕垫在深墨底上，零图片资源；
  遮罩随基础亮/暗主题实时切换，并支持皮肤中心背景控件
  （`--dsw-skin-scrim`）。
- 半透明面板让霓虹背景透出；aionui 右侧面板与 git-graph 提交图同样适配
  霓虹体系。
- 注入霓虹 favicon（深墨底青色圆环，PNG data URL）。

## 安装

本包是标准 dsh 插件 bundle 形态：

```sh
dsh plugin --profile web add link:$(pwd)/packages/skins/cyberpunk
```

皮肤互斥由 `scripts/dsh-skin` 管理（home 层 disabled 行）；皮肤中心 GUI
可一键试穿与应用。

## 开发

```sh
pnpm build    # tsdown 构建 -> lib/
pnpm test     # vitest（jsdom apply/dispose 规格）
```

CSS 是 `body[data-dsh-cyberpunk]` 作用域的独立样式表，由 bundle 加载器注入；
`apply()` 负责背景与 favicon，dispose 时全部撤回。
