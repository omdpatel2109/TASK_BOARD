"use client"
import Image from 'next/image';
import React from 'react';
import image from '@/public/images/images.jpeg'

export default function Header(){
    return(
        <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-4 shadow-md">
            <div className="text-xl font-semibold text-gray-100">Task Board</div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-100">Welcome, User</span>
                {/* image profile user */}
                <Image
                    src={image} 
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full aspect-square object-cover border border-gray-300"
                />
            </div>
        </div>
    )
}
