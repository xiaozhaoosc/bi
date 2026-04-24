# DEBT LEDGER

## [HIGH] HUD Overlapping / Clipping
- **描述**: 在不同长宽比下，3D 旋转的 HUD 卡片可能与中央沙盘或侧边栏发生重叠。
- **风险**: 关键数据被遮挡，视觉不专业。
- **对策**: 引入基于 `scale` 的动态偏移计算。

## [MEDIUM] Font Loading Race Condition
- **描述**: Pretext 渲染器依赖字体加载。如果字体加载慢，首屏测量可能不准。
- **风险**: 初始排版破碎。
- **对策**: 使用 `document.fonts.ready` 或 `FontFaceSet` 确保加载后再渲染。
