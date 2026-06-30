# Clash AI Router

让 Clash Verge Rev / Mihomo 里的 ChatGPT、Claude、Codex、Gemini、Cursor、Copilot 等 AI 服务走一个稳定的自动分组，减少线路不稳时反复手动切节点的麻烦。

这个项目的目标很简单：**已经有梯子和 Clash 配置的人，把这个链接交给本机 Agent 或照着 README 操作后，可以安装、刷新、验收，并且失败时知道卡在哪里。**

## 它做什么

- 给 AI 服务创建专门分组，不和普通国外流量混在一起。
- 给 AI 服务创建 `url-test` 自动测速分组，线路不可用时自动切到更可用的候选节点。
- 保留手动兜底分组，出问题时还能自己选。
- 默认避免高倍率、高成本节点进入 AI 自动分组，例如 `12x`。
- 不保存、不上传、不公开你的订阅地址和真实节点信息。

## 当前状态

这是最小可用版本，优先支持：

- macOS
- Clash Verge Rev
- 已经存在且可用的 Clash 订阅/配置
- Python 3.9+

仓库包含：

- `scripts/clash-ai-router.profile.js`：Clash Verge Rev 的 profile script。
- `bin/clash-ai-router`：本机辅助工具，用来检查、备份、安装、验收、回滚。
- `install.sh`：给人类和 Agent 使用的安装入口。
- `AGENTS.md`：给本机 Agent 读取的执行说明。
- `examples/config.json`：参数参考示例；当前不会被程序自动读取。

## 适合谁

适合已经在使用 Clash Verge Rev / Mihomo，但经常遇到：

- ChatGPT 一会能用一会不能用；
- Codex / Claude 经常断连；
- 每次超时都要手动换线路；
- 不知道哪个节点适合 AI 服务；
- 不小心用到高倍率节点。

## 不适合谁

- 完全没有代理配置或订阅的人。
- 需要这个项目提供订阅或节点的人。
- 需要绕过单位、学校或国家网络管控的人。
- 需要保证某个服务 100% 可用的人。

## 让本机 Agent 自动安装

把下面这段话发给你的本机 Agent：

> 请打开这个仓库，先阅读 README.md 和 AGENTS.md，然后在我的本机安装 Clash AI Router。
> 
> 目标是在 macOS 的 Clash Verge Rev 当前 profile 里安装 `scripts/clash-ai-router.profile.js`。
> 
> 必须先运行 `python3 bin/clash-ai-router doctor`，再运行 `bash install.sh`。
> 
> 安装前必须备份原 profile script。
> 
> 安装后请刷新 Clash Verge Rev 当前订阅/配置，然后运行 `python3 bin/clash-ai-router test --strict`。
> 
> 只有 `test --strict` 退出码为 0，才可以告诉我安装成功。
> 
> 不要询问、打印、上传或提交我的订阅地址、真实节点列表、运行缓存或流量信息。
> 
> 如果无法读取 Mihomo 运行时分组，不能报告成功。请告诉我打开 Clash Verge Rev、启动内核、刷新当前订阅/配置后再验收。
> 
> 如果没有识别到适合 AI 的节点候选，不能静默成功。请告诉我检查节点命名，或在 `AI代理` 里手动选择可用节点。

## 手动安装

先下载项目：

```bash
git clone https://github.com/kellanxu/clash-ai-router.git
cd clash-ai-router
```

然后运行安装入口：

```bash
bash install.sh
```

`install.sh` 会做这些事：

1. 检查本机环境。
2. 找到当前 Clash Verge Rev profile script。
3. 安装前备份旧脚本。
4. 写入 Clash AI Router profile script。
5. 尝试做严格验收。

如果安装后严格验收失败，通常是因为 Clash Verge Rev 还没有刷新配置。请打开 Clash Verge Rev，刷新当前订阅/配置，然后运行：

```bash
python3 bin/clash-ai-router test --strict
```

## 分步安装

如果你想一步步看清楚发生了什么：

```bash
python3 bin/clash-ai-router doctor
python3 bin/clash-ai-router install --dry-run
python3 bin/clash-ai-router install
```

安装后，打开 Clash Verge Rev，刷新一次当前订阅或配置，让 profile script 重新生成运行配置。

然后运行严格验收：

```bash
python3 bin/clash-ai-router test --strict
```

如果 `AI代理` 没有自动指向 `AI自动可用`，可以运行：

```bash
python3 bin/clash-ai-router select-auto
python3 bin/clash-ai-router test --strict
```

## 成功标准

只有下面条件全部满足，才算安装完成：

- 当前 Clash Verge Rev profile script 已写入 Clash AI Router。
- 原 profile script 已备份，或目标脚本原本不存在。
- 刷新配置后，运行时存在：
  - `AI自动可用`
  - `AI代理`
  - `国外自动可用`
  - `普通国外`
- `AI代理` 当前指向 `AI自动可用`。
- AI 域名规则已经写入 profile script。
- `AI自动可用` 有真实代理候选。
- `AI自动可用` 没有包含高倍率候选，例如 `12x`。
- 能识别到至少一个看起来适合 AI 的地区候选。

Agent 或脚本不能用 `status` 的输出代替验收。**最终验收必须看：**

```bash
python3 bin/clash-ai-router test --strict
```

并且这个命令必须退出码为 `0`。

## 命令说明

```bash
python3 bin/clash-ai-router doctor
```

检查本机环境、Clash Verge Rev 配置目录、当前 profile script 插槽、curl 和 Mihomo socket。

```bash
python3 bin/clash-ai-router install --dry-run
```

只显示将写入哪里，不实际修改文件。

```bash
python3 bin/clash-ai-router install
```

备份当前 profile script，然后写入 Clash AI Router profile script。

```bash
python3 bin/clash-ai-router status
```

展示当前状态。这个命令适合人看，不适合作为最终验收。

```bash
python3 bin/clash-ai-router test --strict
```

严格验收。失败会返回非 0，适合 Agent 判断是否真的完成。

```bash
python3 bin/clash-ai-router select-auto
```

把 `AI代理` 设置为 `AI自动可用`。

```bash
python3 bin/clash-ai-router rollback
```

恢复最近一次安装前备份。

```bash
python3 bin/clash-ai-router uninstall
```

通过恢复最近备份来卸载 Clash AI Router。为了避免误删用户自己的脚本，没有备份时不会自动清空当前脚本。

## 默认分组

- `AI自动可用`：自动测速分组，给 AI 服务选择可用线路。
- `AI代理`：手动兜底分组，默认走 `AI自动可用`。
- `国外自动可用`：普通国外流量自动测速。
- `普通国外`：普通国外流量手动兜底。

如果你是从早期个人脚本迁移，手动兜底分组也可能叫 `AI住宅IP`。辅助工具会兼容识别，但公开模板默认使用更通用的 `AI代理`。

## 手动使用

如果你不想运行辅助工具，也可以把下面这个文件的内容复制到 Clash Verge Rev 的 Profile Script / Script 扩展里：

```text
scripts/clash-ai-router.profile.js
```

复制后刷新当前订阅/配置，再运行：

```bash
python3 bin/clash-ai-router test --strict
```

## 常见问题

### doctor 提示找不到 script 插槽

说明当前 Clash Verge Rev profile 没有识别到 Profile Script / Script 扩展。处理方法：

1. 在 Clash Verge Rev 里给当前订阅/配置创建或打开 Profile Script / Script 扩展。
2. 把 `scripts/clash-ai-router.profile.js` 的内容复制进去，或用 `install --target` 指定目标脚本路径。
3. 刷新当前订阅/配置。
4. 运行 `python3 bin/clash-ai-router test --strict`。

### test --strict 提示无法读取 Mihomo 运行时分组

通常说明 Clash Verge Rev 没启动内核、没有刷新配置，或 Mihomo socket 路径不同。

先打开 Clash Verge Rev，确认当前配置正在运行并刷新一次订阅/配置，然后重试：

```bash
python3 bin/clash-ai-router test --strict
```

如果你的 socket 不在默认路径，可以这样指定：

```bash
MIHOMO_SOCKET=/path/to/mihomo.sock python3 bin/clash-ai-router test --strict
```

### test --strict 提示没有识别到推荐 AI 地区候选

这个工具是根据节点名称识别候选的。如果你的节点名字非常简短或没有地区信息，自动识别可能失败。

你可以：

- 在 Clash Verge Rev 里手动打开 `AI代理`，选择你确认可用的节点。
- 调整节点命名，让名称里包含地区或用途，例如 `日本 ChatGPT`、`美国 Residential`。
- 修改 `scripts/clash-ai-router.profile.js` 里的地区和节点匹配规则。

### 会不会改坏我原来的节点？

安装前会备份旧 profile script。当前版本只在自己创建的 AI/普通自动分组里排除高倍率节点，不会从你的原始订阅里删除真实节点，也不会清空无关分组。

需要恢复时运行：

```bash
python3 bin/clash-ai-router rollback
```

## 安全说明

这个工具不会读取、打印或上传你的订阅地址。辅助工具只会在本机 Clash Verge Rev 配置目录内备份并写入 profile script。

默认地区和域名规则只是实用模板，不代表任何服务商的官方政策。不同 AI 服务的可用地区、风控策略和条款可能变化。请自行确认并遵守当地法律、服务条款和网络使用规则。

## License

MIT
