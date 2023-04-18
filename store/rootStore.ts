// rootStore.ts作为所有用户定义的store状态的根节点
import userStore, { IUserStore } from './userStore';
export interface IStore {
  user: IUserStore;
}

export default function createStore(initialValue: any): () => IStore {
  return () => {
    return {
      user: { ...userStore(), ...initialValue?.user },
    };
  };
}
