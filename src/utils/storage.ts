/**
 * 获取本地存储项
 * @param {string} itemKey - 存储键
 * @returns {string} 存储值
 */
/**
 * 获取本地存储项
 * @param {string} itemKey - 存储键
 * @returns {string} 存储值
 */
export const getLocalStorageItem = (itemKey: string): string => {
  const now = +new Date();
  let ls = localStorage.getItem(itemKey);

  let itemValue = '';
  if (ls !== null) {
    let data = JSON.parse(ls);
    if (data.expire > now) {
      itemValue = data.value;
    } else {
      localStorage.removeItem(itemKey);
    }
  }

  return itemValue;
};

/**
 * 设置本地存储项
 * @param {string} itemKey - 存储键
 * @param {string} itemValue - 存储值
 * @param {number} ttl - 生存时间（秒）
 */
export const setLocalStorageItem = (itemKey: string, itemValue: string, ttl: number): void => {
  const now = +new Date();

  let data = {
    setTime: now,
    ttl: parseInt(ttl.toString()),
    expire: now + ttl * 1000,
    value: itemValue
  };
  localStorage.setItem(itemKey, JSON.stringify(data));
};
