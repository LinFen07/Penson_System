// src/utils/date-utils.ts

/**
 * 格式化时间为相对时间（如：刚刚、3分钟前、2小时前、昨天、3天前、2周前、1个月前、2023-05-15）
 * @param isoString ISO格式的时间字符串（如：2023-05-15T08:30:00）
 * @returns 相对时间字符串
 */
export function formatRelativeTime(isoString: string): string {
  const target = new Date(isoString);
  const now = new Date();
  
  // 处理无效时间
  if (isNaN(target.getTime())) {
    return '无效时间';
  }

  // 计算时间差（毫秒）
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000); // 秒
  const diffMin = Math.floor(diffSec / 60); // 分钟
  const diffHour = Math.floor(diffMin / 60); // 小时
  const diffDay = Math.floor(diffHour / 24); // 天
  const diffWeek = Math.floor(diffDay / 7); // 周
  const diffMonth = Math.floor(diffDay / 30); // 月（简化为30天/月）
  const diffYear = Math.floor(diffDay / 365); // 年（简化为365天/年）

  // 按时间差范围返回对应文本
  if (diffSec < 60) {
    return '刚刚';
  } else if (diffMin < 60) {
    return `${diffMin}分钟前`;
  } else if (diffHour < 24) {
    return `${diffHour}小时前`;
  } else if (diffDay === 1) {
    return '昨天';
  } else if (diffDay < 7) {
    return `${diffDay}天前`;
  } else if (diffWeek < 4) {
    return `${diffWeek}周前`;
  } else if (diffMonth < 12) {
    return `${diffMonth}个月前`;
  } else if (diffYear < 1) {
    // 超过11个月但不到1年，显示月份和日期
    return `${target.getMonth() + 1}月${target.getDate()}日`;
  } else {
    // 超过1年，显示完整日期
    return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
  }
}

/**
 * 格式化时间为标准格式（如：2023-05-15 08:30）
 * @param isoString ISO格式的时间字符串
 * @returns 标准时间字符串
 */
export function formatStandardTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '无效时间';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}