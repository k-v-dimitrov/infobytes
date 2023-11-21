import messages from "app/utils/messages"

export interface RegisterState {
  email: string
  password: string
  repeatPassword: string
}

export const initialState: RegisterState = {
  email: "",
  password: "",
  repeatPassword: "",
}

export const validateRegister = (registerState: RegisterState) => {
  const { email, password, repeatPassword } = registerState
  const errors: Partial<RegisterState> = {}
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/

  Object.entries(registerState).forEach(([key, value]) => {
    if (!value) {
      errors[key] = messages.required
    }
  })

  if (email && !emailRegex.test(email)) {
    errors.email = messages.invalid
  }

  if (password && password.length < 8) {
    errors.password = messages.invalid
  }

  if (password !== repeatPassword) {
    errors.repeatPassword = "Passwords are not matching!"
  }

  return errors
}
