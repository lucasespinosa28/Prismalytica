import { createFileRoute } from '@tanstack/react-router'
import LinkItem from '../components/LinkItem'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
    return (
        <main className="flex flex-col items-center min-h-screen pt-8 bg-gradient-to-b from-purple-900 to-blue-900">
          <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
            <div className="w-56 h-56 rounded-lg bg-white shadow-md p-2 mb-6 mx-auto">
              <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                <img src="logo_telegram.png" className="rounded-lg" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center text-white">Prismalytica</h1>
            <p className="text-blue-100 text-center mb-6 font-bold">A Telegram bot for analyzing on-chain cryptocurrency data on the Cronos blockchain.</p>
            <ul className="space-y-3 w-full">
              <LinkItem href="https://prismalytica.pages.dev/howtouse" label="How to use" color='text-stone-900 hover:text-stone-700'/>
              <LinkItem href="https://t.me/PrismalyticaBot" label="Bot channel" color='text-stone-900 hover:text-stone-700'/>
              <LinkItem href="https://t.me/+OFnFVbQ2R_FhYTQx" label="Alert group" color='text-stone-900 hover:text-stone-700'/>
              <LinkItem href="https://github.com/lucasespinosa28/Prismalytica" label="GitHub" color='text-stone-900 hover:text-stone-700'/>
            </ul>
          </div>
        </main>
      )
}