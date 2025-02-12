import { useEffect, useState } from 'react';

const createStore = (createState) => {
  let state; // 全局状态
  const listeners = new Set(); // 监听器

  /**
   * 修改状态
   * @param {*} partial 修改的状态，可以是一个函数
   * @param {boolean} replace 新状态是否替换旧状态，默认 false，即旧状态合并新状态
   */
  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;

      if (!replace) {
        state =
          typeof nextState !== 'object' || nextState === null
            ? nextState
            : Object.assign({}, state, nextState);
      } else {
        state = nextState;
      }
      listeners.forEach((listener) => listener(state, previousState));
    }
  };

  /**
   * 读取状态
   */
  const getState = () => state;

  /**
   * 添加监听器
   */
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  /**
   * 清除所有监听器
   */
  const destroy = () => {
    listeners.clear();
  };

  const api = { setState, getState, subscribe, destroy };

  state = createState(setState, getState, api);

  return api;
};

function useStore(api, selector) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    api.subscribe((state, prevState) => {
      const newObj = selector(state);
      const oldObj = selector(prevState);

      if (newObj !== oldObj) {
        // 通过 set 一个 state 触发 React 渲染
        forceRender(Math.random());
      }
    });
  }, []);

  return selector(api.getState());
}

export const create = (createState) => {
  const api = createStore(createState);

  const useBoundStore = (selector) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};
