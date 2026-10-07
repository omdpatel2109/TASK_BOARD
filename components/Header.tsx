import Image from 'next/image';
import image from '@/public/images/images.jpeg'

export default function Header(){
    return(
        <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900 px-6 text-white">
    <h1 className="text-xl font-semibold">
        Task Board
    </h1>

    <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700">
            
        </div>

        <span className="text-sm font-medium">
            User
        </span>
    </div>
</header>
    )
}
