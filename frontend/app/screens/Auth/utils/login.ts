import messages from "app/utils/messages"

export interface LoginState {
  email: string
  password: string
}

export const initialState: LoginState = {
  email: "",
  password: "",
}

export const validateLogin = (loginState: LoginState) => {
  const errors: Partial<LoginState> = {}

  Object.entries(loginState).forEach(([key, value]) => {
    if (!value) {
      errors[key] = messages.required
    }
  })

  return errors
}
