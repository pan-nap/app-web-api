/** esbuild text loader 导入的文本资源（HTML/CSS 等）类型声明 */
declare module '*.html' {
  const content: string;
  export default content;
}
