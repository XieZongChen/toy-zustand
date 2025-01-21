import { useEffect } from 'react';
// import { create } from 'zustand';
// import { create } from './toy-zustand';
import { create } from './toy-zustand2';
import { persist } from 'zustand/middleware';

function logMiddleware(func) {
  return function (set, get, store) {
    function newSet(...args) {
      console.log('调用了 set，新的 state：', get());
      return set(...args);
    }

    return func(newSet, get, store);
  };
}

// ts 中的中间件由于要适配类型，写法为 create<State & Action>()(logMiddleware((set) => ({ aaa: '', updateAaa: (value) => set(() => ({ aaa: value })), }))
const useTestStore = create(
  persist(
    logMiddleware((set) => ({
      aaa: '',
      bbb: '',
      updateAaa: (value) => set(() => ({ aaa: value })),
      updateBbb: (value) => set(() => ({ bbb: value })),
    })),
    { name: 'testStorage' }
  )
);

export default function App() {
  const updateAaa = useTestStore((state) => state.updateAaa);
  const aaa = useTestStore((state) => state.aaa);

  useEffect(() => {
    useTestStore.subscribe(() => {
      console.log(useTestStore.getState());
    });
  }, []);

  return (
    <div>
      <input onChange={(e) => updateAaa(e.currentTarget.value)} value={aaa} />
      <Bbb></Bbb>
    </div>
  );
}

function Bbb() {
  return (
    <div>
      <Ccc></Ccc>
    </div>
  );
}

function Ccc() {
  const aaa = useTestStore((state) => state.aaa);
  return <p>hello, {aaa}</p>;
}
