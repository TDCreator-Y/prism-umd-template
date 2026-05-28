/** 组件类型字面量，限定合法值 */
export type ComponentType = 'component' | 'module' | 'widget' | 'utility';

/** 库输出格式字面量 */
export type LibraryFormat = 'umd' | 'cjs' | 'esm';

/**
 * 单个组件的元数据描述，用于组件内部 defineExpose({ manifest })
 */
export interface Manifest {
  name: string;
  type: ComponentType;
  description: string;
  version: string;
  author: string;
}

/**
 * 用于菜单渲染和动态路由的组件详细信息
 */
export interface ComponentDetailedInfo {
  name: string;
  zhName: string;
  icon: string;
  description: string;
}

/**
 * 库级别的元数据清单，与 prism-admin-web RemoteComponentManifest 接口对应。
 * 消费方通过读取 window[libName].manifest 获得此对象。
 */
export interface LibraryManifest {
  /** 挂载到 window 的全局变量名，如 "VueComponent" */
  libName: string;
  format: LibraryFormat;
  /** 构建产物文件名 */
  fileName: string;
  /** 中文库名，用于菜单显示 */
  zhName: string;
  author: string;
  version: string;
  description: string;
  /** 导出的组件名列表 */
  components: string[];
  /** 组件名 -> 简短描述的映射 */
  componentsMap: Record<string, string>;
  /** 用于菜单渲染的详细信息列表 */
  componentsDetailed: ComponentDetailedInfo[];
}
