/**
 * 创建过滤器函数
 * @param {string} queryString - 查询字符串
 * @returns {Function} 过滤器函数
 */
export const createFilter = (queryString: string) => {
  return (candidate: { value: string }): boolean => {
    return (
      candidate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

/**
 * 后端搜索建议
 * @param {string} queryString - 查询字符串
 * @param {Array} backends - 后端列表
 * @returns {Array} 搜索结果
 */
export const backendSearch = (queryString: string, backends: Array<{ value: string }>): Array<{ value: string }> => {
  let results = queryString
    ? backends.filter(createFilter(queryString))
    : backends;

  return results;
};
