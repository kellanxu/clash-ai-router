#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[ERR] 找不到 python3。请先安装 Python 3。" >&2
  exit 1
fi

echo "== Clash AI Router installer =="
echo

echo "[1/5] 运行环境检查"
if ! python3 bin/clash-ai-router doctor; then
  echo "[ERR] 环境检查未通过，已停止安装。" >&2
  exit 1
fi

echo
echo "[2/5] 预览安装目标"
python3 bin/clash-ai-router install --dry-run

echo
echo "[3/5] 写入 profile script"
python3 bin/clash-ai-router install

echo
echo "[4/5] 尝试把 AI代理 设置为 AI自动可用"
if python3 bin/clash-ai-router select-auto; then
  echo "[OK] 已尝试设置 AI代理 -> AI自动可用"
else
  echo "[WARN] 暂时无法设置运行时分组。通常是 Clash Verge Rev 未运行、核心未启动或配置尚未刷新。"
fi

echo
echo "[5/5] 严格验收"
if python3 bin/clash-ai-router test --strict; then
  echo
  echo "[OK] 安装和运行时验收通过。"
  exit 0
fi

cat <<'EOF'

[WARN] 已写入脚本，但严格验收还没有通过。

请按下面步骤完成最后刷新：

1. 打开 Clash Verge Rev。
2. 确认核心已经启动。
3. 刷新当前订阅或配置。
4. 重新运行：

   python3 bin/clash-ai-router select-auto
   python3 bin/clash-ai-router test --strict

只有 test --strict 退出码为 0，才算真正安装完成。
EOF

exit 2
