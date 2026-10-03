import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// 注册 useGSAP，避免被 tree-shaking 掉（官方推荐做法）
gsap.registerPlugin(useGSAP);

// 统一默认缓动与时长；各动画只在需要时覆盖，保证全站节奏一致
gsap.defaults({ ease: "power2.out", duration: 0.45 });

/**
 * 「允许动态效果」的媒体查询。
 *
 * 所有动画都放进 `gsap.matchMedia().add(MOTION_OK, ...)` 分支：
 * 用户系统开启「减少动态效果」时直接跳过动画；而 useGSAP 会在
 * 组件卸载 / 依赖更新时自动 revert 这些 matchMedia 与 tween，无需手动清理。
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, useGSAP };
