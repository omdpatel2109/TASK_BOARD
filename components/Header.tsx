import Image from 'next/image';
import image from '@/public/images/images.jpeg';

export default function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

            {/* Title */}
            <h1 className="text-xl font-bold text-blue-700">
                Task Board
            </h1>

            {/* User */}
            <div className="flex items-center gap-3">

                <Image
                    src={image}
                    alt="User profile"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                />

                <span className="text-sm font-medium text-gray-700">
                    User
                </span>

            </div>

        </header>
    );
}