"use client";

import Image from "next/image";
import useAuth from "../hooks/useAuth";


export default function ProfilePage() {
    const { currentUser } = useAuth();

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <div className="flex items-center space-x-4">
                <Image
                    src={"https://i.pravatar.cc/150?img=3"}
                    alt={currentUser?.name ?? "user avatar"}
                    className="w-20 h-20 rounded-full border"
                    width={80}
                    height={80}
                />
                <div>
                    <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                    <p className="text-gray-600">{currentUser?.email}</p>
                </div>
            </div>
        </div>
    );
}