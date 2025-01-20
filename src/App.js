import { useEffect } from 'react';
import { create } from 'zustand';

const useTestStore = create((set) => ({
  aaa: '',
  bbb: '',
  updateAaa: (value) => set(() => ({ aaa: value })),
  updateBbb: (value) => set(() => ({ bbb: value })),
}));

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
