import { createFileRoute } from '@tanstack/react-router'
import { auth } from '../../../auth/auth-handler'
import { db } from '../../../db'
import { profiles } from '../../../db/schema'
import crypto from 'crypto'

export const Route = (createFileRoute as any)('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }): Promise<Response> => {
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }): Promise<Response> => {
        const url = new URL(request.url)

        if (url.pathname.endsWith('/signup')) {
          try {
            const formData = await request.formData()
            const name = formData.get('name')?.toString() || ''
            const email = formData.get('email')?.toString() || ''
            const password = formData.get('password')?.toString() || ''

            if (!name || !email || !password) {
              return new Response('Vul alle velden in.', { status: 400 })
            }

            await auth.api.signUpEmail({
              body: {
                email: email.trim(),
                password: password,
                name: name.trim(),
              }
            })

            return new Response(null, {
              status: 302,
              headers: { 'Location': '/profile-setup' },
            })
          } catch (error: any) {
            return new Response(`Registratie mislukt: ${error.message}`, { status: 400 })
          }
        }

        if (url.pathname.endsWith('/setup')) {
          try {
            const session = await auth.api.getSession({ headers: request.headers })
            if (!session?.user?.id) {
              return new Response('Niet geautoriseerd.', { status: 401 })
            }

            const formData = await request.formData()
            const age = Number(formData.get('age')) || 25
            const gender = formData.get('gender')?.toString() || 'Vrouw'
            const height = Number(formData.get('height')) || 170
            const weight = Number(formData.get('weight')) || 70
            
            const conditions = formData.getAll('conditions').map(c => c.toString())
            const diets = formData.getAll('diets').map(d => d.toString())
            const allergies = formData.getAll('allergies').map(a => a.toString())
            const likes = formData.getAll('likes').map(l => l.toString())
            const dislikes = formData.getAll('dislikes').map(d => d.toString())

            const mappedConditions = conditions.map(c => c.includes('Diabeet') ? 'Diabetic' : c)

            await db
              .insert(profiles)
              .values({
                id: crypto.randomUUID(),
                userId: session.user.id,
                age,
                gender,
                height,
                weight,
                conditions: mappedConditions,
                diets,
                allergies,
                likes,
                dislikes,
              })
              .onConflictDoUpdate({
                target: profiles.userId,
                set: { age, gender, height, weight, conditions: mappedConditions, diets, allergies, likes, dislikes },
              })

            return new Response(null, {
              status: 302,
              headers: { 'Location': '/dashboard' },
            })
          } catch (error: any) {
            return new Response(`Profiel opslaan mislukt: ${error.message}`, { status: 500 })
          }
        }

        return await auth.handler(request)
      },
    },
  },
})
