import { create } from "zustand";

type AuthState = {
    user: any,
    setUser: (user: any) => void
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser(user: any) {
        set(state => ({
            user
        }))
    }
}))

export default useAuthStore