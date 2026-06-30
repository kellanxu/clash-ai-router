# Clash AI Router

让 Clash Verge Rev / Mihomo 里的 AI 服务走一个稳定的自动分组，减少 ChatGPT、Claude、Codex 等服务因为线路不稳而反复手动切换的烦恼。

这个项目的目标是给新手一个尽量少折腾的方案：

- AI 服务走专门分组，不和普通国外流量混在一起。
- 自动测速，线路不可用时自动切到更可用的节点。
- 保留手动兜底分组，出问题时还能自己选。
- 可过滤高倍率、高成本节点，例如 `12x`，避免误用贵线路。
- 不保存、不上传、不开源你的订阅地址和节点信息。

## 当前状态

这是最小可用版本，优先支持 macOS 上的 Clash Verge Rev。

已包含：

- `scripts/clash-ai-router.profile.js`：Clash Verge Rev 的 profile script，可直接粘贴或安装。
- `bin/clash-ai-router`：本机辅助工具，用来检查、备份、安装脚本和查看运行状态。
- `examples/config.json`：可调参数示例。

## 快速开始

先下载项目，然后在项目目录里运行：

```bash
python3 bin/clash-ai-router status
python3 bin/clash-ai-router install --dry-run
python3 bin/clash-ai-router install
```

安装后，打开 Clash Verge Rev，刷新一次当前订阅或配置，让 profile script 重新生成运行配置。

然后检查：

```bash
python3 bin/clash-ai-router status
```

如果看到 `AI自动可用` 和 `AI代理` 分组，说明基础配置已经生效。

如果你是从早期个人脚本迁移，手动兜底分组也可能叫 `AI住宅IP`。辅助工具会兼容识别，但公开模板默认使用更通用的 `AI代理`。

## 手动使用

如果你不想运行辅助工具，也可以把 `scripts/clash-ai-router.profile.js` 的内容复制到 Clash Verge Rev 的 Profile Script / Script 扩展里，然后刷新订阅。

## 默认分组

- `AI自动可用`：自动测速分组，给 AI 服务选择可用线路。
- `AI代理`：手动兜底分组，默认走 `AI自动可用`。
- `国外自动可用`：普通国外流量自动测速。
- `普通国外`：普通国外流量手动兜底。

## 安全说明

这个工具不会读取或上传你的订阅内容。辅助工具只会在本机 Clash Verge Rev 配置目录内备份并写入 profile script。

默认地区和域名规则只是实用模板，不代表任何服务商的官方政策。不同 AI 服务的可用地区、风控策略和条款可能变化，请自行确认并遵守当地法律、服务条款和网络使用规则。

## 适合谁

适合已经在使用 Clash Verge Rev / Mihomo，但经常遇到：

- ChatGPT 一会能用一会不能用；
- Codex / Claude 经常断连；
- 每次超时都要手动换线路；
- 不知道哪个节点适合 AI 服务；
- 不小心用到高倍率节点。

## 不适合谁

- 完全没有代理配置或订阅的人。
- 需要绕过单位、学校或国家网络管控的人。
- 需要保证某个服务 100% 可用的人。

## License

MIT
