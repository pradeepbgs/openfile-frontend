import {z} from 'zod'

export const AuthSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(4,"Password must be at least 4 characters")
})