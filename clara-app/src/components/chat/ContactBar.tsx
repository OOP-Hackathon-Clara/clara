'use client';

import Image from 'next/image';

interface ContactBarProps {
  name: string;
  status: string;
  avatar?: string;
}

export default function ContactBar({ name, status, avatar }: ContactBarProps) {
  return (
    <div className="bg-white shadow-md p-4 flex items-center sticky top-0 z-10">
      <button className="mr-4 md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="relative h-10 w-10 rounded-full bg-gray-300 flex-shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={`${name}'s avatar`}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-600 font-medium text-lg">
            {name.charAt(0)}
          </div>
        )}
        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
          status === 'Online' ? 'bg-green-500' : 'bg-gray-400'
        } border-2 border-white`}></span>
      </div>
      
      <div className="ml-3">
        <h2 className="font-semibold text-gray-800">{name}</h2>
        <p className="text-xs text-gray-500">{status}</p>
      </div>
      
      <div className="ml-auto flex">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
